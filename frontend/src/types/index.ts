export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  lastLogin?: string;
}

export interface Booking {
  id: string;
  _id?: string;
  fullName: string;
  phone: string;
  email: string;
  service: string;
  package?: string;
  packagePrice?: string;
  eventDate: string;
  eventTime?: string;
  city: string;
  venue: string;
  eventDetails?: string;
  expectedGuests?: string;
  budgetRange?: string;
  instagramHandle?: string;
  additionalRequirements?: string;
  status: 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  whatsappStatus?: 'pending' | 'sent' | 'failed';
  whatsappMessageId?: string;
  whatsappError?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Inquiry {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  eventDate?: string;
  city?: string;
  venue?: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'CONVERTED' | 'CLOSED';
  createdAt: string;
  updatedAt?: string;
}

export interface PortfolioProject {
  id: string;
  _id?: string;
  title: string;
  category: string;
  description: string;
  city: string;
  venue: string;
  eventDate: string;
  coverImage: string;
  galleryImages: string[];
  videoUrl?: string;
  instagramUrl?: string;
  featured: boolean;
  published: boolean;
  clientName?: string;
  createdAt?: string;
}

export interface Reel {
  id: string;
  _id?: string;
  title: string;
  description?: string;
  category?: string;
  eventName: string;
  city: string;
  venue: string;
  eventDate: string;
  thumbnail: string;
  videoUrl?: string;
  secure_url?: string;
  public_id?: string;
  publicId?: string;
  mediaType?: 'video' | 'image';
  instagramUrl: string;
  views?: string;
  featured: boolean;
  published: boolean;
  order?: number;
  createdAt?: string;
}

export interface Service {
  id: string;
  _id?: string;
  serviceName: string;
  slug: string;
  description: string;
  startingPrice: string;
  duration?: string;
  image: string;
  deliverables?: string[];
  featured: boolean;
  published: boolean;
}

export interface Package {
  id: string;
  _id?: string;
  packageName: string;
  slug: string;
  description: string;
  price: string;
  duration: string;
  includedServices: string[];
  featured: boolean;
  popular?: boolean;
  published: boolean;
}

export interface Testimonial {
  id: string;
  _id?: string;
  customerName: string;
  customerRole: string;
  eventType?: string;
  review: string;
  rating: number;
  photo?: string;
  published: boolean;
}

export interface SiteSettings {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  instagramUrl: string;
  whatsAppNumber: string;
  address: string;
  city: string;
  logo: string;
  favicon?: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage?: string;
  socialLinks: {
    instagram: string;
    youtube?: string;
    whatsapp?: string;
    linkedin?: string;
  };
}

export interface AnalyticsData {
  totalBookings: number;
  totalInquiries: number;
  confirmedBookings: number;
  conversionRate: number;
  mostRequestedService: string;
  mostPopularCity: string;
  portfolioCount: number;
  reelsCount: number;
  statusCounts: {
    NEW: number;
    CONTACTED: number;
    CONFIRMED: number;
    COMPLETED: number;
    CANCELLED: number;
  };
  monthlyChartData: Array<{ month: string; count: number }>;
  upcomingEvents: Booking[];
  serviceDistribution: Array<{ name: string; value: number }>;
}
