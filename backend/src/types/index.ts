import { Request } from 'express';

export interface IAdmin {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'superadmin' | 'admin';
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBooking {
  id?: string;
  _id?: string;
  fullName: string;
  phone: string;
  email: string;
  service: string;
  package?: string;
  eventDate: string;
  city: string;
  venue: string;
  eventDetails: string;
  expectedGuests?: string;
  budgetRange?: string;
  instagramHandle?: string;
  additionalRequirements?: string;
  status: 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  internalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IInquiry {
  id?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface IPortfolioProject {
  id?: string;
  _id?: string;
  title: string;
  category: 'Event' | 'Wedding' | 'Reels' | 'Commercial' | 'Portraits' | 'Celebrity' | string;
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
  updatedAt?: string;
}

export interface IReel {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  eventName: string;
  city: string;
  venue: string;
  eventDate: string;
  thumbnail: string;
  videoUrl?: string;
  instagramUrl: string;
  views?: string;
  featured: boolean;
  published: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IService {
  id?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface IPackage {
  id?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ITestimonial {
  id?: string;
  _id?: string;
  customerName: string;
  customerRole: string;
  eventType?: string;
  review: string;
  rating: number;
  photo?: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGalleryItem {
  id?: string;
  _id?: string;
  title: string;
  url: string;
  category: string;
  city: string;
  venue?: string;
  date?: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMessage {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISiteSettings {
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
  updatedAt?: string;
}

export interface AuthAdminPayload {
  id?: string;
  _id?: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthRequest extends Request {
  admin?: AuthAdminPayload;
}
