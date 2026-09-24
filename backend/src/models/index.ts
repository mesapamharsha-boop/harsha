import { Collection, dbManager } from '../config/db';
import { mongoConnection } from '../database/connection';

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
  service?: string;
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

// Collections export
export const AdminModel = new Collection<IAdmin>('admins');
export const BookingModel = new Collection<IBooking>('bookings');
export const InquiryModel = new Collection<IInquiry>('inquiries');
export const PortfolioModel = new Collection<IPortfolioProject>('portfolio');
export const ReelModel = new Collection<IReel>('reels');
export const ServiceModel = new Collection<IService>('services');
export const PackageModel = new Collection<IPackage>('packages');
export const TestimonialModel = new Collection<ITestimonial>('testimonials');
export const GalleryModel = new Collection<IGalleryItem>('gallery');
export const MessageModel = new Collection<IMessage>('messages');

// Default site settings
const DEFAULT_SITE_SETTINGS: ISiteSettings = {
  businessName: 'LEOX',
  ownerName: 'LEOX',
  email: 'leoxshoots@gmail.com',
  phone: '',
  instagramUrl: 'https://www.instagram.com/leox_shoots/',
  whatsAppNumber: '8374404536',
  address: 'Vijayawada / Hyderabad, India',
  city: 'Vijayawada, India',
  logo: '/assets/leox-logo.png',
  favicon: '/leox-icon.svg',
  heroHeading: 'CAPTURE THE MOMENT. CREATE THE IMPACT.',
  heroSubheading: 'Professional cinematic reels, event coverage, and visual content — shot on the latest iPhones and crafted to make every moment stand out.',
  heroImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop',
  socialLinks: {
    instagram: 'https://www.instagram.com/leox_shoots/',
    youtube: 'https://youtube.com',
    whatsapp: '',
  },
  updatedAt: new Date().toISOString(),
};

// Site settings helper (single document in MongoDB or local store)
export const SettingsModel = {
  async get(): Promise<ISiteSettings> {
    const mongoDb = mongoConnection.getDb();
    if (mongoDb) {
      try {
        const col = mongoDb.collection('settings');
        const doc = await col.findOne({ key: 'site_settings' });
        if (doc && doc.data) {
          return doc.data as ISiteSettings;
        }
        // Initialize default settings in MongoDB Atlas
        await col.updateOne(
          { key: 'site_settings' },
          { $set: { key: 'site_settings', data: DEFAULT_SITE_SETTINGS, updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
        return DEFAULT_SITE_SETTINGS;
      } catch (err) {
        console.error('[SettingsModel] MongoDB read error, falling back to local:', err);
      }
    }

    // Local fallback
    const state = dbManager.getState();
    if (state.settings) {
      return state.settings;
    }
    state.settings = { ...DEFAULT_SITE_SETTINGS };
    dbManager.save();
    return state.settings;
  },

  async update(patch: Partial<ISiteSettings>): Promise<ISiteSettings> {
    const current = await this.get();
    const updated: ISiteSettings = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    const mongoDb = mongoConnection.getDb();
    if (mongoDb) {
      try {
        const col = mongoDb.collection('settings');
        await col.updateOne(
          { key: 'site_settings' },
          { $set: { key: 'site_settings', data: updated, updatedAt: updated.updatedAt } },
          { upsert: true }
        );
      } catch (err) {
        console.error('[SettingsModel] MongoDB update error:', err);
      }
    }

    // Update local state mirror as well
    const state = dbManager.getState();
    state.settings = updated;
    dbManager.save();
    return updated;
  },
};

