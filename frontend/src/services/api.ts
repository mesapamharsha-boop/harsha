import {
  AdminUser,
  Booking,
  Inquiry,
  PortfolioProject,
  Reel,
  Service,
  Package,
  Testimonial,
  SiteSettings,
  AnalyticsData,
} from '../types';

// Custom error for distinguishing network failures from unauthorized authentication responses
export class ApiError extends Error {
  status: number;
  isAuthError: boolean;
  isNetworkError: boolean;

  constructor(message: string, status: number, isAuthError = false, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isAuthError = isAuthError;
    this.isNetworkError = isNetworkError;
  }
}

// Centralized dynamic API Base URL resolution:
// Automatically uses relative /api for cloud preview (*.run.app) and production,
// while correctly honoring custom VITE_API_URL or local separate Vite dev server (port 5173).
export function resolveApiBase(): string {
  const rawEnv = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // 1. If on remote deployment (e.g. Cloud Run, production domain, *.run.app)
    if (!isLocalhost) {
      // If a full remote URL was explicitly configured (starting with http/https) and not pointing to localhost, use it
      if (
        rawEnv &&
        (rawEnv.startsWith('http://') || rawEnv.startsWith('https://')) &&
        !rawEnv.includes('localhost') &&
        !rawEnv.includes('127.0.0.1')
      ) {
        return rawEnv.endsWith('/api') ? rawEnv : `${rawEnv}/api`;
      }
      // Otherwise, the frontend is served co-hosted or reverse-proxied on the same origin: always use '/api'
      return '/api';
    }

    // 2. If running locally on backend server port 3000 (dev server or preview)
    if (isLocalhost && (window.location.port === '3000' || !window.location.port)) {
      return '/api';
    }

    // 3. If running standalone Vite on port 5173
    if (isLocalhost && window.location.port === '5173') {
      if (rawEnv && (rawEnv.startsWith('http://') || rawEnv.startsWith('https://'))) {
        return rawEnv.endsWith('/api') ? rawEnv : `${rawEnv}/api`;
      }
      return 'http://localhost:3000/api';
    }
  }

  // Fallback for SSR or non-browser contexts:
  if (!rawEnv || rawEnv === '/api') {
    return '/api';
  }
  return rawEnv.endsWith('/api') ? rawEnv : `${rawEnv}/api`;
}

export const API_BASE = resolveApiBase();

/**
 * Returns full URL for local uploads or remote URLs
 */
export function getMediaUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return url;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('leox_admin_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('leox_admin_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('leox_admin_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const base = resolveApiBase();
  const url = `${base}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: any) {
    // Network level failure (e.g. Failed to fetch, offline, server warming up)
    throw new ApiError(
      err?.message || 'Backend server is currently unreachable. Please verify network or server status.',
      0,
      false,
      true
    );
  }

  let data: any = {};
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => ({}));
  }

  if (!response.ok) {
    const isAuth = response.status === 401 || response.status === 403;
    throw new ApiError(
      data.message || `Request failed with status ${response.status}`,
      response.status,
      isAuth,
      false
    );
  }

  return data as T;
}

export const api = {
  // Auth
  async login(credentials: { email?: string; username?: string; password: string }): Promise<{ token: string; admin: AdminUser }> {
    return request<{ token: string; admin: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      clearAuthToken();
    }
  },

  async getMe(): Promise<{ admin: AdminUser }> {
    return request<{ admin: AdminUser }>('/auth/me');
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    return request<{ message: string }>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Bookings
  async createBooking(data: Partial<Booking>): Promise<{ success: boolean; booking: Booking; message: string }> {
    return request<{ success: boolean; booking: Booking; message: string }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getBookings(params: { status?: string; city?: string; service?: string; q?: string } = {}): Promise<{ bookings: Booking[]; count: number }> {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.city) query.set('city', params.city);
    if (params.service) query.set('service', params.service);
    if (params.q) query.set('q', params.q);
    return request<{ bookings: Booking[]; count: number }>(`/bookings?${query.toString()}`);
  },

  async getBooking(id: string): Promise<{ booking: Booking }> {
    return request<{ booking: Booking }>(`/bookings/${id}`);
  },

  async updateBooking(id: string, patch: Partial<Booking>): Promise<{ booking: Booking; message: string }> {
    return request<{ booking: Booking; message: string }>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
  },

  async deleteBooking(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },

  // Inquiries
  async createInquiry(data: Partial<Inquiry>): Promise<{ success: boolean; inquiry: Inquiry; message: string }> {
    return request<{ success: boolean; inquiry: Inquiry; message: string }>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getInquiries(params: { status?: string; q?: string } = {}): Promise<{ inquiries: Inquiry[]; count: number }> {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.q) query.set('q', params.q);
    return request<{ inquiries: Inquiry[]; count: number }>(`/inquiries?${query.toString()}`);
  },

  async updateInquiry(id: string, patch: Partial<Inquiry>): Promise<{ inquiry: Inquiry; message: string }> {
    return request<{ inquiry: Inquiry; message: string }>(`/inquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
  },

  async deleteInquiry(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/inquiries/${id}`, {
      method: 'DELETE',
    });
  },

  // Portfolio
  async getPortfolio(params: { category?: string; featured?: boolean; city?: string; all?: boolean } = {}): Promise<{ projects: PortfolioProject[]; count: number }> {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.featured) query.set('featured', 'true');
    if (params.city) query.set('city', params.city);
    if (params.all) query.set('all', 'true');
    return request<{ projects: PortfolioProject[]; count: number }>(`/portfolio?${query.toString()}`);
  },

  async getPortfolioById(id: string): Promise<{ project: PortfolioProject }> {
    return request<{ project: PortfolioProject }>(`/portfolio/${id}`);
  },

  async createPortfolio(data: Partial<PortfolioProject>): Promise<{ project: PortfolioProject; message: string }> {
    return request<{ project: PortfolioProject; message: string }>('/portfolio', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updatePortfolio(id: string, patch: Partial<PortfolioProject>): Promise<{ project: PortfolioProject; message: string }> {
    return request<{ project: PortfolioProject; message: string }>(`/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
  },

  async deletePortfolio(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/portfolio/${id}`, {
      method: 'DELETE',
    });
  },

  // Reels
  async getReels(params: { featured?: boolean; all?: boolean } = {}): Promise<{ reels: Reel[]; count: number }> {
    const query = new URLSearchParams();
    if (params.featured) query.set('featured', 'true');
    if (params.all) query.set('all', 'true');
    return request<{ reels: Reel[]; count: number }>(`/reels?${query.toString()}`);
  },

  async createReel(data: Partial<Reel>): Promise<{ reel: Reel; message: string }> {
    return request<{ reel: Reel; message: string }>('/reels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateReel(id: string, patch: Partial<Reel>): Promise<{ reel: Reel; message: string }> {
    return request<{ reel: Reel; message: string }>(`/reels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
  },

  async deleteReel(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/reels/${id}`, {
      method: 'DELETE',
    });
  },

  // Services
  async getServices(params: { all?: boolean } = {}): Promise<{ services: Service[]; count: number }> {
    const query = new URLSearchParams();
    if (params.all) query.set('all', 'true');
    return request<{ services: Service[]; count: number }>(`/services?${query.toString()}`);
  },

  async createService(data: Partial<Service>): Promise<{ service: Service; message: string }> {
    return request<{ service: Service; message: string }>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateService(id: string, patch: Partial<Service>): Promise<{ service: Service; message: string }> {
    return request<{ service: Service; message: string }>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
  },

  async deleteService(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/services/${id}`, {
      method: 'DELETE',
    });
  },

  // Packages
  async getPackages(params: { all?: boolean } = {}): Promise<{ packages: Package[]; count: number }> {
    const query = new URLSearchParams();
    if (params.all) query.set('all', 'true');
    return request<{ packages: Package[]; count: number }>(`/packages?${query.toString()}`);
  },

  async createPackage(data: Partial<Package>): Promise<{ package: Package; message: string }> {
    return request<{ package: Package; message: string }>('/packages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updatePackage(id: string, patch: Partial<Package>): Promise<{ package: Package; message: string }> {
    return request<{ package: Package; message: string }>(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
  },

  async deletePackage(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/packages/${id}`, {
      method: 'DELETE',
    });
  },

  // Testimonials
  async getTestimonials(params: { all?: boolean } = {}): Promise<{ testimonials: Testimonial[]; count: number }> {
    const query = new URLSearchParams();
    if (params.all) query.set('all', 'true');
    return request<{ testimonials: Testimonial[]; count: number }>(`/testimonials?${query.toString()}`);
  },

  async createTestimonial(data: Partial<Testimonial>): Promise<{ testimonial: Testimonial; message: string }> {
    return request<{ testimonial: Testimonial; message: string }>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTestimonial(id: string, patch: Partial<Testimonial>): Promise<{ testimonial: Testimonial; message: string }> {
    return request<{ testimonial: Testimonial; message: string }>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
  },

  async deleteTestimonial(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/testimonials/${id}`, {
      method: 'DELETE',
    });
  },

  // Settings
  async getSettings(): Promise<{ settings: SiteSettings }> {
    return request<{ settings: SiteSettings }>('/settings');
  },

  async updateSettings(patch: Partial<SiteSettings>): Promise<{ settings: SiteSettings; message: string }> {
    return request<{ settings: SiteSettings; message: string }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
  },

  // Analytics
  async getAnalytics(): Promise<{ analytics: AnalyticsData }> {
    return request<{ analytics: AnalyticsData }>('/analytics');
  },

  // Upload to Cloudinary via backend
  async uploadMedia(
    file: File,
    resourceType?: 'image' | 'video'
  ): Promise<{ url: string; secure_url: string; publicId: string; resourceType?: string }> {
    const formData = new FormData();
    formData.append('media', file);
    if (resourceType) {
      formData.append('resourceType', resourceType);
    }
    return request<{ url: string; secure_url: string; publicId: string; resourceType?: string }>('/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // Messages (Contact)
  async sendMessage(data: { name: string; email: string; phone?: string; service?: string; subject?: string; message: string }): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // System Health
  async checkHealth(): Promise<{ success: boolean; server: string; database: string; databaseType?: string }> {
    return request<{ success: boolean; server: string; database: string; databaseType?: string }>('/health');
  },
};
