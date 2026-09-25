import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { formatDisplayDate, formatDisplayTime, toIsoDate } from '../../utils/dateHelper';
import { EXACT_9_SERVICES, EXACT_PACKAGES } from '../../config/services';
import {
  Booking,
  Inquiry,
  PortfolioProject,
  Reel,
  Service,
  Package,
  Testimonial,
  SiteSettings,
  AnalyticsData,
} from '../../types';
import { Logo } from '../../components/common/Logo';
import { Modal } from '../../components/common/Modal';
import { CloudinaryMediaUploader } from '../../components/admin/CloudinaryMediaUploader';
import {
  LayoutDashboard,
  CalendarCheck,
  Inbox,
  Film,
  Play,
  Layers,
  Sparkles,
  MessageSquare,
  Settings,
  KeyRound,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Award,
  Users,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
  onDataUpdated?: () => void;
}

type TabType =
  | 'overview'
  | 'bookings'
  | 'inquiries'
  | 'portfolio'
  | 'reels'
  | 'services'
  | 'packages'
  | 'testimonials'
  | 'settings'
  | 'security';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate, onDataUpdated }) => {
  const { admin, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);

  // Core Data States
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Filter & Search states
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('ALL');
  const [bookingSearch, setBookingSearch] = useState<string>('');
  const [inquiryFilterStatus, setInquiryFilterStatus] = useState<string>('ALL');
  const [inquirySearch, setInquirySearch] = useState<string>('');

  // Modals
  const [activeBookingModal, setActiveBookingModal] = useState<Booking | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Partial<Booking> | null>(null);

  const [activeInquiryModal, setActiveInquiryModal] = useState<Inquiry | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState<Partial<Inquiry> | null>(null);

  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<PortfolioProject> | null>(null);
  const [reelModalOpen, setReelModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<Partial<Reel> | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<Package> | null>(null);
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);

  // Cross-component notification helper to keep Landing Page immediately updated
  const notifyDataChanged = () => {
    try {
      window.dispatchEvent(new CustomEvent('leox:data-updated'));
      if (onDataUpdated) {
        onDataUpdated();
      }
    } catch (err) {
      console.warn('notifyDataChanged error:', err);
    }
  };

  // Security password state
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passSubmitting, setPassSubmitting] = useState(false);

  // Protect Admin route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load all CMS collections
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        analyticsRes,
        bookingsRes,
        inquiriesRes,
        portfolioRes,
        reelsRes,
        servicesRes,
        packagesRes,
        testimonialsRes,
        settingsRes,
      ] = await Promise.all([
        api.getAnalytics().catch(() => null),
        api.getBookings(),
        api.getInquiries(),
        api.getPortfolio({ all: true }),
        api.getReels({ all: true }),
        api.getServices({ all: true }),
        api.getPackages({ all: true }),
        api.getTestimonials({ all: true }),
        api.getSettings(),
      ]);

      if (analyticsRes?.analytics) setAnalytics(analyticsRes.analytics);
      if (bookingsRes?.bookings) setBookings(bookingsRes.bookings);
      if (inquiriesRes?.inquiries) setInquiries(inquiriesRes.inquiries);
      if (portfolioRes?.projects) setPortfolio(portfolioRes.projects);
      if (reelsRes?.reels) setReels(reelsRes.reels);
      if (servicesRes?.services) setServices(servicesRes.services);
      if (packagesRes?.packages) setPackages(packagesRes.packages);
      if (testimonialsRes?.testimonials) setTestimonials(testimonialsRes.testimonials);
      if (settingsRes?.settings) setSiteSettings(settingsRes.settings);
    } catch (err: any) {
      error('Failed to load admin data', err.message);
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated, loadAllData]);

  // ---------------- BOOKINGS HANDLERS ----------------
  const handleUpdateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      const res = await api.updateBooking(id, { status });
      setBookings((prev) => prev.map((b) => (b.id === id ? res.booking : b)));
      if (activeBookingModal && activeBookingModal.id === id) {
        setActiveBookingModal(res.booking);
      }
      success('Booking Updated', `Status changed to ${status}`);
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to update booking', err.message);
    }
  };

  const handleUpdateBookingNotes = async (id: string, notes: string) => {
    try {
      const res = await api.updateBooking(id, { internalNotes: notes });
      setBookings((prev) => prev.map((b) => (b.id === id ? res.booking : b)));
      if (activeBookingModal && activeBookingModal.id === id) {
        setActiveBookingModal(res.booking);
      }
      success('Internal Notes Saved');
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to save notes', err.message);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this booking?')) return;
    try {
      await api.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setActiveBookingModal(null);
      success('Booking Removed');
      notifyDataChanged();
    } catch (err: any) {
      error('Delete failed', err.message);
    }
  };

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking?.fullName || !editingBooking?.phone || !editingBooking?.service) {
      error('Full name, phone, and service are required');
      return;
    }
    try {
      if (editingBooking.id) {
        const res = await api.updateBooking(editingBooking.id, editingBooking);
        setBookings((prev) => prev.map((b) => (b.id === editingBooking.id ? res.booking : b)));
        success('Booking Updated Successfully');
      } else {
        const res = await api.createBooking({
          ...editingBooking,
          status: editingBooking.status || 'NEW',
          eventDate: editingBooking.eventDate || new Date().toISOString().split('T')[0],
          city: editingBooking.city || 'Vijayawada',
          venue: editingBooking.venue || 'Private Venue',
        });
        setBookings((prev) => [res.booking, ...prev]);
        success('Booking Created Successfully');
      }
      setBookingModalOpen(false);
      setEditingBooking(null);
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to save booking', err.message);
    }
  };

  // ---------------- INQUIRIES HANDLERS ----------------
  const handleUpdateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    try {
      const res = await api.updateInquiry(id, { status });
      setInquiries((prev) => prev.map((i) => (i.id === id ? res.inquiry : i)));
      if (activeInquiryModal && activeInquiryModal.id === id) {
        setActiveInquiryModal(res.inquiry);
      }
      success('Inquiry Updated', `Status marked as ${status}`);
      notifyDataChanged();
    } catch (err: any) {
      error('Update failed', err.message);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await api.deleteInquiry(id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      setActiveInquiryModal(null);
      success('Inquiry Deleted');
      notifyDataChanged();
    } catch (err: any) {
      error('Delete failed', err.message);
    }
  };

  const handleSaveInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInquiry?.name || !editingInquiry?.email || !editingInquiry?.message) {
      error('Name, email, and message are required');
      return;
    }
    try {
      if (editingInquiry.id) {
        const res = await api.updateInquiry(editingInquiry.id, editingInquiry);
        setInquiries((prev) => prev.map((i) => (i.id === editingInquiry.id ? res.inquiry : i)));
        success('Inquiry Updated Successfully');
      } else {
        const res = await api.createInquiry({
          ...editingInquiry,
          status: editingInquiry.status || 'NEW',
          service: editingInquiry.service || 'Photography & Videography',
        });
        setInquiries((prev) => [res.inquiry, ...prev]);
        success('Inquiry Logged Successfully');
      }
      setInquiryModalOpen(false);
      setEditingInquiry(null);
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to save inquiry', err.message);
    }
  };

  // ---------------- PORTFOLIO CMS HANDLERS ----------------
  const handleSavePortfolioProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.category) {
      error('Title and category required');
      return;
    }
    try {
      if (editingProject.id) {
        const res = await api.updatePortfolio(editingProject.id, editingProject);
        setPortfolio((prev) => prev.map((p) => (p.id === editingProject.id ? res.project : p)));
        success('Project Updated Successfully');
      } else {
        const res = await api.createPortfolio(editingProject);
        setPortfolio((prev) => [res.project, ...prev]);
        success('Project Added to Archive');
      }
      setPortfolioModalOpen(false);
      setEditingProject(null);
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to save project', err.message);
    }
  };

  const handleDeletePortfolioProject = async (id: string) => {
    if (!window.confirm('Permanently remove this project from portfolio?')) return;
    try {
      await api.deletePortfolio(id);
      setPortfolio((prev) => prev.filter((p) => p.id !== id));
      success('Project Deleted');
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to delete project', err.message);
    }
  };

  // ---------------- REELS CMS HANDLERS ----------------
  const handleSaveReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReel?.title || (!editingReel?.thumbnail && !editingReel?.videoUrl && !editingReel?.secure_url)) {
      error('Title and either a video (Cloudinary upload/URL) or thumbnail are required');
      return;
    }
    try {
      const payload: Partial<Reel> = {
        ...editingReel,
        videoUrl: editingReel.videoUrl || editingReel.secure_url || '',
        secure_url: editingReel.secure_url || editingReel.videoUrl || '',
        mediaType: editingReel.mediaType || 'video',
        published: editingReel.published !== undefined ? Boolean(editingReel.published) : true,
      };

      if (editingReel.id) {
        const res = await api.updateReel(editingReel.id, payload);
        setReels((prev) => prev.map((r) => (r.id === editingReel.id ? res.reel : r)));
        success('Reel Updated');
      } else {
        const res = await api.createReel(payload);
        setReels((prev) => [res.reel, ...prev]);
        success('Reel Added');
      }
      setReelModalOpen(false);
      setEditingReel(null);
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to save reel', err.message);
    }
  };

  const handleTogglePublishReel = async (reel: Reel) => {
    try {
      const newStatus = !reel.published;
      const res = await api.updateReel(reel.id, { ...reel, published: newStatus });
      setReels((prev) => prev.map((r) => (r.id === reel.id ? res.reel : r)));
      success(newStatus ? 'Reel Published (Live on Website)' : 'Reel Unpublished (Hidden)');
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to change reel status', err.message);
    }
  };

  const handleDeleteReel = async (id: string) => {
    if (!window.confirm('Delete this reel?')) return;
    try {
      await api.deleteReel(id);
      setReels((prev) => prev.filter((r) => r.id !== id));
      success('Reel Deleted');
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to delete reel', err.message);
    }
  };

  // ---------------- SERVICES CMS HANDLERS ----------------
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.serviceName) {
      error('Service name required');
      return;
    }
    try {
      if (editingService.id) {
        const res = await api.updateService(editingService.id, editingService);
        setServices((prev) => prev.map((s) => (s.id === editingService.id ? res.service : s)));
        success('Service Updated');
      } else {
        const res = await api.createService(editingService);
        setServices((prev) => [...prev, res.service]);
        success('Service Created');
      }
      setServiceModalOpen(false);
      setEditingService(null);
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to save service', err.message);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      success('Service Deleted');
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to delete service', err.message);
    }
  };

  // ---------------- PACKAGES CMS HANDLERS ----------------
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage?.packageName || !editingPackage?.price) {
      error('Package name and price required');
      return;
    }
    try {
      if (editingPackage.id) {
        const res = await api.updatePackage(editingPackage.id, editingPackage);
        setPackages((prev) => prev.map((p) => (p.id === editingPackage.id ? res.package : p)));
        success('Package Updated');
      } else {
        const res = await api.createPackage(editingPackage);
        setPackages((prev) => [...prev, res.package]);
        success('Package Created');
      }
      setPackageModalOpen(false);
      setEditingPackage(null);
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to save package', err.message);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await api.deletePackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
      success('Package Deleted');
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to delete package', err.message);
    }
  };

  // ---------------- TESTIMONIALS CMS HANDLERS ----------------
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.customerName || !editingTestimonial?.review) {
      error('Customer name and review required');
      return;
    }
    try {
      if (editingTestimonial.id) {
        const res = await api.updateTestimonial(editingTestimonial.id, editingTestimonial);
        setTestimonials((prev) => prev.map((t) => (t.id === editingTestimonial.id ? res.testimonial : t)));
        success('Review Updated');
      } else {
        const res = await api.createTestimonial(editingTestimonial);
        setTestimonials((prev) => [...prev, res.testimonial]);
        success('Review Added');
      }
      setTestimonialModalOpen(false);
      setEditingTestimonial(null);
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to save review', err.message);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      success('Review Deleted');
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to delete review', err.message);
    }
  };

  // ---------------- SETTINGS HANDLER ----------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    try {
      const res = await api.updateSettings(siteSettings);
      setSiteSettings(res.settings);
      success('Settings Updated Successfully');
      notifyDataChanged();
    } catch (err: any) {
      error('Failed to update settings', err.message);
    }
  };

  // ---------------- SECURITY PASSWORD HANDLER ----------------
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      error('Mismatch', 'New password and confirmation do not match.');
      return;
    }
    if (passData.newPassword.length < 6) {
      error('Weak Password', 'New password must be at least 6 characters.');
      return;
    }
    setPassSubmitting(true);
    try {
      await api.changePassword({
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      });
      success('Security Updated', 'Password successfully changed.');
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      error('Password Change Failed', err.message || 'Current password was incorrect.');
    } finally {
      setPassSubmitting(false);
    }
  };

  // Navigation tabs config
  const navTabs: Array<{ id: TabType; label: string; icon: any; count?: number }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, count: bookings.filter((b) => b.status === 'NEW').length },
    { id: 'inquiries', label: 'Inquiries', icon: Inbox, count: inquiries.filter((i) => i.status === 'NEW').length },
    { id: 'portfolio', label: 'Portfolio CMS', icon: Film, count: portfolio.length },
    { id: 'reels', label: 'Reels CMS', icon: Play, count: reels.length },
    { id: 'services', label: 'Services CMS', icon: Layers },
    { id: 'packages', label: 'Packages CMS', icon: Sparkles },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'security', label: 'Security & Auth', icon: KeyRound },
  ];

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchStatus = bookingFilterStatus === 'ALL' || b.status === bookingFilterStatus;
    const query = bookingSearch.trim().toLowerCase();
    const matchSearch =
      !query ||
      b.fullName.toLowerCase().includes(query) ||
      b.phone.includes(query) ||
      b.city.toLowerCase().includes(query) ||
      b.service.toLowerCase().includes(query) ||
      b.venue.toLowerCase().includes(query);
    return matchStatus && matchSearch;
  });

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchStatus = inquiryFilterStatus === 'ALL' || inq.status === inquiryFilterStatus;
    const query = inquirySearch.trim().toLowerCase();
    const matchSearch =
      !query ||
      inq.name.toLowerCase().includes(query) ||
      inq.email.toLowerCase().includes(query) ||
      inq.phone.toLowerCase().includes(query) ||
      inq.message.toLowerCase().includes(query) ||
      (inq.service && inq.service.toLowerCase().includes(query));
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#07080b] flex text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d0e14] border-r border-[#1a1c26] flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-5 space-y-6">
          {/* Brand Header */}
          <div className="space-y-1">
            <Logo size="md" onClick={() => navigate('/')} />
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#E50914] pt-1">
              DIRECTOR CONTROL CMS
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/25'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {Boolean(tab.count) && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isActive ? 'bg-black/40 text-white' : 'bg-[#E50914]/20 text-[#FF4D55]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & quick links footer */}
        <div className="p-4 border-t border-[#1a1c26] space-y-3 bg-[#0a0b10]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E50914]/20 text-[#FF3842] flex items-center justify-center font-bold text-xs border border-[#E50914]/40">
              LX
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{admin?.name || 'LeoX Director'}</div>
              <div className="text-[10px] text-gray-400 truncate">{admin?.email || 'admin@leox'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => navigate('/')}
              className="px-2 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-medium text-gray-300 hover:text-white flex items-center justify-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Public Site</span>
            </button>

            <button
              onClick={logout}
              className="px-2 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-[11px] font-medium text-red-300 hover:text-red-200 flex items-center justify-center gap-1 transition-colors border border-red-800/30"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#1a1c26] bg-[#0a0b10] px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Tab Switcher */}
            <div className="md:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as TabType)}
                className="bg-[#151622] border border-[#27293a] text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                {navTabs.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            <h1 className="text-base sm:text-lg font-heading font-bold text-white uppercase tracking-wider">
              {navTabs.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#E50914]' : ''}`} />
            </button>

            <button
              onClick={() => {
                setEditingProject({
                  title: '',
                  category: 'Reels',
                  city: 'Vijayawada',
                  venue: '',
                  eventDate: new Date().toISOString().split('T')[0],
                  coverImage: '',
                  galleryImages: [],
                  description: '',
                  featured: true,
                  published: true,
                });
                setPortfolioModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          </div>
        </header>

        {/* Dynamic Body based on Active Tab */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          {/* ===================== OVERVIEW TAB ===================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Analytics Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] shadow-xl">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider">Total Bookings</span>
                    <CalendarCheck className="w-4 h-4 text-[#E50914]" />
                  </div>
                  <div className="text-3xl font-heading font-extrabold text-white">
                    {analytics?.totalBookings ?? bookings.length}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Active event pipeline</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] shadow-xl">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider">New Inquiries</span>
                    <Inbox className="w-4 h-4 text-[#E50914]" />
                  </div>
                  <div className="text-3xl font-heading font-extrabold text-white">
                    {inquiries.filter((i) => i.status === 'NEW').length}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2">
                    Awaiting response
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] shadow-xl">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider">Conversion Rate</span>
                    <Award className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-heading font-extrabold text-white">
                    {analytics?.conversionRate ? `${analytics.conversionRate}%` : '78%'}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2">
                    Inquiry to confirmed shoot
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] shadow-xl">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider">Top Category</span>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl font-heading font-bold text-white truncate mt-1">
                    {analytics?.mostRequestedService || 'Instagram Reels'}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2">
                    Most requested in 2026
                  </div>
                </div>
              </div>

              {/* Recent Bookings Queue */}
              <div className="rounded-2xl bg-[#111218] border border-[#20222e] overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#1e202c] flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-heading font-bold text-white">
                      Recent Booking Requests
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Review incoming client events and verify crew scheduling
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold uppercase tracking-wider text-[#E50914] hover:underline"
                  >
                    View All Bookings &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#161722] text-gray-400 uppercase tracking-wider font-semibold border-b border-[#212332]">
                      <tr>
                        <th className="px-6 py-3.5">Client</th>
                        <th className="px-6 py-3.5">Service</th>
                        <th className="px-6 py-3.5">Event Date</th>
                        <th className="px-6 py-3.5">Location</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e202c]">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{b.fullName}</div>
                            <div className="text-gray-400">{b.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-300 font-medium">{b.service}</td>
                          <td className="px-6 py-4 text-gray-300">
                            <div>{formatDisplayDate(b.eventDate) || b.eventDate}</div>
                            {b.eventTime && (
                              <div className="text-[11px] text-gray-400">{formatDisplayTime(b.eventTime)}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {b.city} &bull; {b.venue}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                b.status === 'NEW'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : b.status === 'CONFIRMED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : b.status === 'COMPLETED'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-gray-500/20 text-gray-300'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setActiveBookingModal(b)}
                              className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-[#E50914] text-white text-[11px] font-semibold transition-colors"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== BOOKINGS TAB ===================== */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#111218] border border-[#20222e]">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search client name, phone, city, or venue..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#171824] border border-[#282a3c] text-xs text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Filter Status:</span>
                    <select
                      value={bookingFilterStatus}
                      onChange={(e) => setBookingFilterStatus(e.target.value)}
                      className="bg-[#171824] border border-[#282a3c] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#E50914]"
                    >
                      <option value="ALL">All Statuses ({bookings.length})</option>
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <button
                    id="admin-add-booking-btn"
                    onClick={() => {
                      setEditingBooking({
                        fullName: '',
                        phone: '',
                        email: '',
                        service: services[0]?.serviceName || 'Wedding Photography',
                        package: packages[0]?.packageName || '',
                        eventDate: new Date().toISOString().split('T')[0],
                        city: 'Vijayawada',
                        venue: '',
                        eventDetails: '',
                        status: 'NEW',
                      });
                      setBookingModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-[#E50914]/20 transition-all whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Booking</span>
                  </button>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="rounded-2xl bg-[#111218] border border-[#20222e] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#161722] text-gray-400 uppercase tracking-wider font-semibold border-b border-[#212332]">
                      <tr>
                        <th className="px-6 py-3.5">Ref ID</th>
                        <th className="px-6 py-3.5">Client Details</th>
                        <th className="px-6 py-3.5">Service & Package</th>
                        <th className="px-6 py-3.5">Event Date</th>
                        <th className="px-6 py-3.5">Location</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e202c]">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-mono text-gray-400">#{b.id}</td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{b.fullName}</div>
                            <div className="text-gray-400">{b.phone} &bull; {b.email}</div>
                            {b.instagramHandle && (
                              <div className="text-[11px] text-gray-400">@{b.instagramHandle.replace(/^@/, '')}</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-200 font-medium">{b.service}</div>
                            {b.package ? (
                              <div className="text-[11px] text-[#FF4D55] font-semibold">
                                {b.package} {b.packagePrice ? `(${b.packagePrice})` : ''}
                              </div>
                            ) : (
                              <div className="text-[11px] text-gray-500">Custom / Undecided</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            <div>{b.eventDate}</div>
                            {b.eventTime && <div className="text-[11px] text-gray-400">{b.eventTime}</div>}
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {b.city} &bull; {b.venue}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as Booking['status'])}
                              className="bg-[#161722] border border-[#262837] text-white text-[11px] rounded-md px-2 py-1 font-semibold focus:outline-none"
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => setActiveBookingModal(b)}
                              className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-[#E50914] text-white font-semibold transition-colors"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => {
                                setEditingBooking(b);
                                setBookingModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.15] text-gray-300 hover:text-white transition-colors"
                              title="Edit booking"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
                              title="Delete booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredBookings.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            No bookings matching criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== INQUIRIES TAB ===================== */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#111218] border border-[#20222e]">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    placeholder="Search inquiries by name, email, phone, or message..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#171824] border border-[#282a3c] text-xs text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={inquiryFilterStatus}
                    onChange={(e) => setInquiryFilterStatus(e.target.value)}
                    className="bg-[#171824] border border-[#282a3c] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#E50914]"
                  >
                    <option value="ALL">All Statuses ({inquiries.length})</option>
                    <option value="NEW">NEW</option>
                    <option value="READ">READ</option>
                    <option value="REPLIED">REPLIED</option>
                    <option value="CONVERTED">CONVERTED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>

                  <button
                    id="admin-add-inquiry-btn"
                    onClick={() => {
                      setEditingInquiry({
                        name: '',
                        email: '',
                        phone: '',
                        service: services[0]?.serviceName || 'Photography & Videography',
                        message: '',
                        status: 'NEW',
                      });
                      setInquiryModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-[#E50914]/20 transition-all whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Inquiry</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] hover:border-[#E50914]/50 transition-all flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                            inq.status === 'NEW'
                              ? 'bg-blue-500/20 text-blue-300'
                              : inq.status === 'REPLIED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-gray-500/20 text-gray-300'
                          }`}
                        >
                          {inq.status}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-base font-heading font-bold text-white">{inq.name}</h4>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {inq.email} &bull; {inq.phone}
                      </div>
                      {inq.service && (
                        <div className="text-[11px] text-[#FF4D55] font-semibold mt-1">
                          Service: {inq.service}
                        </div>
                      )}

                      <div className="mt-4 p-3 rounded-xl bg-[#171822] text-xs text-gray-300 leading-relaxed italic line-clamp-4">
                        "{inq.message}"
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#1e202c] flex items-center justify-between">
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as Inquiry['status'])}
                        className="bg-[#171822] border border-[#282a3c] text-xs text-white rounded-lg px-2 py-1"
                      >
                        <option value="NEW">NEW</option>
                        <option value="READ">READ</option>
                        <option value="REPLIED">REPLIED</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingInquiry(inq);
                            setInquiryModalOpen(true);
                          }}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="Edit inquiry"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <a
                          href={`mailto:${inq.email}?subject=Regarding%20your%20LEOX%20Shoot%20Inquiry`}
                          className="px-2.5 py-1 rounded-lg bg-[#E50914]/20 hover:bg-[#E50914] text-[#FF4D55] hover:text-white text-xs font-semibold transition-colors"
                        >
                          Reply
                        </a>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredInquiries.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500">
                    No inquiries recorded in database.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== PORTFOLIO CMS TAB ===================== */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">
                  Manage projects displayed on the public portfolio page and homepage archive.
                </p>
                <button
                  onClick={() => {
                    setEditingProject({
                      title: '',
                      category: 'Reels',
                      city: 'Vijayawada',
                      venue: '',
                      eventDate: new Date().toISOString().split('T')[0],
                      coverImage: '',
                      galleryImages: [],
                      description: '',
                      featured: true,
                      published: true,
                    });
                    setPortfolioModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl bg-[#111218] border border-[#20222e] overflow-hidden flex flex-col justify-between shadow-xl group"
                  >
                    <div className="relative aspect-video bg-[#171822]">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#E50914] text-[10px] font-extrabold uppercase text-white">
                        {p.category}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-base font-heading font-bold text-white mb-1">{p.title}</h4>
                        <div className="text-xs text-gray-400">
                          {p.city} &bull; {p.venue} &bull; {p.eventDate}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#1e202c] flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          {p.featured && <span className="text-[#E50914] font-bold">Featured</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProject(p);
                              setPortfolioModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePortfolioProject(p.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== REELS CMS TAB ===================== */}
          {activeTab === 'reels' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-white">9:16 Vertical Works & Reels</h3>
                  <p className="text-xs text-gray-400">
                    Upload via Cloudinary, manage active/draft status, and publish reels directly to the website.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingReel({
                      title: '',
                      category: 'Wedding Reels',
                      description: '',
                      eventName: '',
                      city: 'Vijayawada',
                      venue: '',
                      eventDate: new Date().toISOString().split('T')[0],
                      thumbnail: '',
                      videoUrl: '',
                      secure_url: '',
                      public_id: '',
                      instagramUrl: 'https://www.instagram.com/leox_shoots/',
                      views: '125K Views',
                      featured: true,
                      published: true,
                    });
                    setReelModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#E50914]/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload New Reel</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {reels.map((r) => {
                  const isLive = r.published !== false;
                  const poster = r.thumbnail || (r.videoUrl && r.videoUrl.replace(/\.(mp4|mov|webm|mkv|avi)($|\?)/i, '.jpg$2')) || '';

                  return (
                    <div
                      key={r.id}
                      className={`relative rounded-2xl overflow-hidden bg-[#111218] border aspect-[9/16] flex flex-col justify-between p-3 group shadow-xl transition-all duration-200 ${
                        isLive ? 'border-[#20222e] hover:border-[#E50914]' : 'border-amber-600/40 opacity-85'
                      }`}
                    >
                      {poster ? (
                        <img src={poster} alt={r.title} className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 bg-[#161722] flex items-center justify-center text-gray-500 text-xs">
                          No Thumbnail
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

                      {/* Top Bar: Status Badge + Actions */}
                      <div className="relative z-10 flex justify-between items-start gap-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider backdrop-blur-md border ${
                            isLive
                              ? 'bg-emerald-500/80 text-white border-emerald-400/40'
                              : 'bg-amber-500/80 text-white border-amber-400/40'
                          }`}
                        >
                          {isLive ? 'Published' : 'Draft'}
                        </span>

                        <div className="flex items-center gap-1">
                          {/* One-click publish / unpublish toggle */}
                          <button
                            type="button"
                            onClick={() => handleTogglePublishReel(r)}
                            title={isLive ? 'Unpublish (hide from website)' : 'Publish (show on website)'}
                            className={`p-1.5 rounded-lg backdrop-blur-md text-white transition-colors ${
                              isLive ? 'bg-black/60 hover:bg-amber-600' : 'bg-amber-600 hover:bg-emerald-600'
                            }`}
                          >
                            {isLive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingReel(r);
                              setReelModalOpen(true);
                            }}
                            title="Edit reel"
                            className="p-1.5 rounded-lg bg-black/60 hover:bg-[#E50914] text-white backdrop-blur-md transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteReel(r.id)}
                            title="Delete reel and remove from Cloudinary"
                            className="p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white backdrop-blur-md transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Center Video Indicator */}
                      <div className="relative z-10 my-auto text-center pointer-events-none">
                        {(r.videoUrl || r.secure_url) && (
                          <div className="w-9 h-9 rounded-full bg-black/50 border border-white/20 text-white mx-auto flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                        )}
                      </div>

                      {/* Bottom Details */}
                      <div className="relative z-10 text-white space-y-0.5">
                        <div className="flex items-center justify-between text-[9px]">
                          <span className="uppercase text-[#FF4D55] font-bold truncate max-w-[70%]">
                            {r.category || r.eventName}
                          </span>
                          {r.views && <span className="text-gray-300 font-semibold">{r.views}</span>}
                        </div>
                        <div className="text-xs font-bold truncate leading-tight">{r.title}</div>
                        <div className="text-[10px] text-gray-300 truncate">{r.city}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================== SERVICES CMS TAB ===================== */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">Manage production service offerings and deliverables.</p>
                <button
                  onClick={() => {
                    setEditingService({
                      serviceName: '',
                      slug: '',
                      description: '',
                      startingPrice: '₹25,000',
                      duration: 'Full Day Coverage',
                      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
                      deliverables: ['Cinematic Color Grading', 'Raw Master Audio', 'Cloud Gallery'],
                      featured: true,
                      published: true,
                    });
                    setServiceModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E50914] text-white text-xs font-bold uppercase"
                >
                  Add Service
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s) => (
                  <div key={s.id} className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-heading font-bold text-white">{s.serviceName}</h4>
                        <span className="text-xs font-bold text-[#E50914]">{s.startingPrice}</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">{s.description}</p>
                    </div>

                    <div className="pt-4 border-t border-[#1e202c] flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingService(s);
                          setServiceModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(s.id!)}
                        className="p-1 text-gray-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== PACKAGES CMS TAB ===================== */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">Manage curated client packages and prices.</p>
                <button
                  onClick={() => {
                    setEditingPackage({
                      packageName: '',
                      slug: '',
                      description: '',
                      price: '₹75,000',
                      duration: '1 Full Day Event',
                      includedServices: ['2 Cinema Cameras', '1 Drone Rig', '2 Instagram Reels'],
                      popular: false,
                      featured: true,
                      published: true,
                    });
                    setPackageModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E50914] text-white text-xs font-bold uppercase"
                >
                  Add Package
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] flex flex-col justify-between shadow-xl">
                    <div>
                      <h4 className="text-lg font-heading font-bold text-white">{pkg.packageName}</h4>
                      <div className="text-2xl font-black text-white mt-1">{pkg.price}</div>
                      <div className="text-xs text-gray-400 mt-1">{pkg.duration}</div>
                      <p className="text-xs text-gray-300 mt-3">{pkg.description}</p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-[#1e202c] flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingPackage(pkg);
                          setPackageModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-white/[0.06] text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id!)}
                        className="p-1 text-gray-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TESTIMONIALS CMS TAB ===================== */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">Manage client reviews and ratings.</p>
                <button
                  onClick={() => {
                    setEditingTestimonial({
                      customerName: '',
                      customerRole: 'Client',
                      eventType: 'Wedding',
                      review: '',
                      rating: 5,
                      published: true,
                    });
                    setTestimonialModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E50914] text-white text-xs font-bold uppercase"
                >
                  Add Review
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                  <div key={t.id} className="p-6 rounded-2xl bg-[#111218] border border-[#20222e] flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="text-sm font-bold text-white">{t.customerName}</div>
                      <div className="text-xs text-gray-400">{t.customerRole} &bull; {t.eventType}</div>
                      <p className="text-xs text-gray-300 mt-3 italic leading-relaxed">"{t.review}"</p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-[#1e202c] flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingTestimonial(t);
                          setTestimonialModalOpen(true);
                        }}
                        className="px-3 py-1 rounded bg-white/[0.06] text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(t.id!)}
                        className="p-1 text-gray-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== SETTINGS TAB ===================== */}
          {activeTab === 'settings' && siteSettings && (
            <div className="max-w-3xl space-y-6">
              <div className="p-8 rounded-2xl bg-[#111218] border border-[#20222e] shadow-xl">
                <h3 className="text-lg font-heading font-bold text-white mb-6">
                  Site & Business Settings
                </h3>

                <form onSubmit={handleSaveSettings} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Business Brand Name
                      </label>
                      <input
                        type="text"
                        value={siteSettings.businessName}
                        onChange={(e) => setSiteSettings({ ...siteSettings, businessName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Director / Owner Name
                      </label>
                      <input
                        type="text"
                        value={siteSettings.ownerName}
                        onChange={(e) => setSiteSettings({ ...siteSettings, ownerName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Studio Notification Email
                      </label>
                      <input
                        type="email"
                        value={siteSettings.email}
                        onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Studio Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={siteSettings.phone}
                        onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        Instagram Profile URL
                      </label>
                      <input
                        type="url"
                        value={siteSettings.instagramUrl}
                        onChange={(e) => setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                        WhatsApp Contact Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 9849012345"
                        value={siteSettings.whatsAppNumber}
                        onChange={(e) => setSiteSettings({ ...siteSettings, whatsAppNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">
                        Business number used for all instant WhatsApp chat buttons & links.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Hero Headline
                    </label>
                    <input
                      type="text"
                      value={siteSettings.heroHeading}
                      onChange={(e) => setSiteSettings({ ...siteSettings, heroHeading: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Hero Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={siteSettings.heroSubheading}
                      onChange={(e) => setSiteSettings({ ...siteSettings, heroSubheading: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Save All Settings
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ===================== SECURITY TAB ===================== */}
          {activeTab === 'security' && (
            <div className="max-w-md space-y-6">
              <div className="p-8 rounded-2xl bg-[#111218] border border-[#20222e] shadow-xl">
                <h3 className="text-lg font-heading font-bold text-white mb-2">
                  Update Admin Password
                </h3>
                <p className="text-xs text-gray-400 mb-6">
                  Ensure strong credentials for production control access.
                </p>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={passData.currentPassword}
                      onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      New Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={passData.newPassword}
                      onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={passData.confirmPassword}
                      onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#171822] border border-[#27293a] text-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passSubmitting}
                    className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {passSubmitting ? 'UPDATING...' : 'CHANGE PASSWORD'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Booking Details Modal */}
      <Modal
        isOpen={Boolean(activeBookingModal)}
        onClose={() => setActiveBookingModal(null)}
        title={`Booking #${activeBookingModal?.id}`}
        maxWidth="2xl"
      >
        {activeBookingModal && (
          <div className="space-y-6 text-xs text-gray-300">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#161722]">
              <div>
                <span className="text-gray-400 block font-bold">Client Name</span>
                <span className="text-sm font-semibold text-white">{activeBookingModal.fullName}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold">Phone Number</span>
                <span className="text-sm font-semibold text-white">{activeBookingModal.phone}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold">Email</span>
                <span className="text-white">{activeBookingModal.email}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold">Instagram</span>
                <span className="text-white">{activeBookingModal.instagramHandle || 'N/A'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#161722] border border-[#27293a] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold">WhatsApp Alert:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    activeBookingModal.whatsappStatus === 'sent'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : activeBookingModal.whatsappStatus === 'failed'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {activeBookingModal.whatsappStatus || 'pending'}
                </span>
              </div>
              {activeBookingModal.whatsappMessageId && (
                <span className="text-[10px] text-gray-400 font-mono">
                  ID: {activeBookingModal.whatsappMessageId}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#161722]">
              <div>
                <span className="text-gray-400 block font-bold">Service Required</span>
                <span className="text-sm font-semibold text-white">{activeBookingModal.service}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold">Package & Price</span>
                <span className="text-white">
                  {activeBookingModal.package || 'Custom / Undecided'}
                  {activeBookingModal.packagePrice ? ` (${activeBookingModal.packagePrice})` : ''}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold">Event Date & Time</span>
                <span className="text-sm font-semibold text-white">
                  {formatDisplayDate(activeBookingModal.eventDate) || activeBookingModal.eventDate}
                  {activeBookingModal.eventTime ? ` at ${formatDisplayTime(activeBookingModal.eventTime)}` : ''}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold">Location & Venue</span>
                <span className="text-white">{activeBookingModal.city} &bull; {activeBookingModal.venue}</span>
              </div>
            </div>

            {activeBookingModal.eventDetails && (
              <div>
                <span className="text-gray-400 block font-bold mb-1">Event Vision / Notes:</span>
                <div className="p-3 rounded-lg bg-[#161722] text-white leading-relaxed">
                  {activeBookingModal.eventDetails}
                </div>
              </div>
            )}

            <div>
              <span className="text-gray-400 block font-bold mb-1">Internal Producer Notes:</span>
              <textarea
                rows={3}
                defaultValue={activeBookingModal.internalNotes || ''}
                onBlur={(e) => handleUpdateBookingNotes(activeBookingModal.id, e.target.value)}
                placeholder="Add private crew assignments, deposit status, or gear reservations..."
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div className="pt-4 border-t border-[#20222f] flex justify-between items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold">Status:</span>
                <select
                  value={activeBookingModal.status}
                  onChange={(e) => handleUpdateBookingStatus(activeBookingModal.id, e.target.value as Booking['status'])}
                  className="bg-[#161722] border border-[#27293a] text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBooking(activeBookingModal);
                    setActiveBookingModal(null);
                    setBookingModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-white font-bold transition-colors"
                >
                  Edit Booking
                </button>

                <button
                  onClick={() => handleDeleteBooking(activeBookingModal.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-900/40 text-red-300 hover:bg-red-900/80 font-bold transition-colors"
                >
                  Delete Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Booking Add/Edit Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setEditingBooking(null);
        }}
        title={editingBooking?.id ? `Edit Booking #${editingBooking.id}` : 'Create New Booking'}
        maxWidth="2xl"
      >
        {editingBooking && (
          <form onSubmit={handleSaveBooking} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingBooking.fullName || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, fullName: e.target.value })}
                  placeholder="Client full name"
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Phone / WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={editingBooking.phone || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, phone: e.target.value })}
                  placeholder="+91..."
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editingBooking.email || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, email: e.target.value })}
                  placeholder="client@email.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Instagram Handle</label>
                <input
                  type="text"
                  value={editingBooking.instagramHandle || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, instagramHandle: e.target.value })}
                  placeholder="@handle"
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Service Required *</label>
                <select
                  value={editingBooking.service || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, service: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
                >
                  <option value="">Select a service...</option>
                  {EXACT_9_SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Package Selection (Optional)</label>
                <select
                  value={editingBooking.package || ''}
                  onChange={(e) => {
                    const selPkg = e.target.value;
                    const matched = EXACT_PACKAGES.find((p) => p.name === selPkg);
                    setEditingBooking({
                      ...editingBooking,
                      package: selPkg,
                      packagePrice: matched ? matched.price : (selPkg === 'Custom / Undecided' ? 'Custom Quote' : editingBooking.packagePrice),
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
                >
                  <option value="">Select package (optional)</option>
                  {EXACT_PACKAGES.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Package Price</label>
                <input
                  type="text"
                  value={editingBooking.packagePrice || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, packagePrice: e.target.value })}
                  placeholder="e.g. ₹2,999 or Custom"
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Status</label>
                <select
                  value={editingBooking.status || 'NEW'}
                  onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value as Booking['status'] })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Event Date *</label>
                <input
                  type="date"
                  required
                  value={toIsoDate(editingBooking.eventDate) || editingBooking.eventDate || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, eventDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Event Time</label>
                <input
                  type="time"
                  value={editingBooking.eventTime || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, eventTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">City / Location *</label>
                <input
                  type="text"
                  required
                  value={editingBooking.city || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, city: e.target.value })}
                  placeholder="e.g. Hyderabad, Vijayawada"
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Venue Name / Address *</label>
                <input
                  type="text"
                  required
                  value={editingBooking.venue || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, venue: e.target.value })}
                  placeholder="Venue or address"
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Event Details / Client Brief</label>
                <textarea
                  rows={2}
                  value={editingBooking.eventDetails || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, eventDetails: e.target.value })}
                  placeholder="Client notes or vision..."
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={editingBooking.internalNotes || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, internalNotes: e.target.value })}
                  placeholder="Internal crew notes..."
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#E50914]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#20222f] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setBookingModalOpen(false);
                  setEditingBooking(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold shadow-lg shadow-[#E50914]/20"
              >
                {editingBooking.id ? 'Save Changes' : 'Create Booking'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Portfolio Edit Modal */}
      <Modal
        isOpen={portfolioModalOpen}
        onClose={() => setPortfolioModalOpen(false)}
        title={editingProject?.id ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
        maxWidth="2xl"
      >
        {editingProject && (
          <form onSubmit={handleSavePortfolioProject} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Category *</label>
                <select
                  value={editingProject.category || 'Reels'}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                >
                  <option value="Reels">Reels</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Festival">Festival</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Creative">Creative</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={editingProject.city || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Venue *</label>
                <input
                  type="text"
                  required
                  value={editingProject.venue || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, venue: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Event Date</label>
                <input
                  type="date"
                  value={editingProject.eventDate || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, eventDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>

              <div className="col-span-2 space-y-4">
                <CloudinaryMediaUploader
                  label="Cover Image"
                  value={editingProject.coverImage}
                  required
                  aspectRatio="video"
                  accept="image"
                  onChange={(url) => setEditingProject({ ...editingProject, coverImage: url })}
                  helpText="Directly upload cover image to Cloudinary from your computer."
                />

                <CloudinaryMediaUploader
                  label="Project Highlight Video (Optional)"
                  value={editingProject.videoUrl}
                  aspectRatio="video"
                  accept="video"
                  onChange={(url) => setEditingProject({ ...editingProject, videoUrl: url })}
                  helpText="Directly upload video (MP4, WebM) to Cloudinary from your computer."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Instagram Project URL (Optional)</label>
                <input
                  type="url"
                  value={editingProject.instagramUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, instagramUrl: e.target.value })}
                  placeholder="https://www.instagram.com/p/..."
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Project Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#20222f] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPortfolioModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/[0.06] text-white font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold"
              >
                Save Project
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Reels Edit Modal */}
      <Modal
        isOpen={reelModalOpen}
        onClose={() => setReelModalOpen(false)}
        title={editingReel?.id ? 'Edit Reel' : 'Add 9:16 Reel'}
        maxWidth="lg"
      >
        {editingReel && (
          <form onSubmit={handleSaveReel} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Reel / Work Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Romantic Sunset Vows or Apex GT Reveal"
                value={editingReel.title || ''}
                onChange={(e) => setEditingReel({ ...editingReel, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white focus:border-[#E50914] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Category / Event Type</label>
                <input
                  type="text"
                  placeholder="e.g. Wedding Reels, Brand Shoot, Delivery"
                  value={editingReel.category || ''}
                  onChange={(e) => setEditingReel({ ...editingReel, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white focus:border-[#E50914] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Event / Client Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul & Priya or Sneha Reddy"
                  value={editingReel.eventName || ''}
                  onChange={(e) => setEditingReel({ ...editingReel, eventName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white focus:border-[#E50914] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-bold mb-1">City / Region</label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, Vijayawada, Goa"
                  value={editingReel.city || ''}
                  onChange={(e) => setEditingReel({ ...editingReel, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white focus:border-[#E50914] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Views Count (Display Tag)</label>
                <input
                  type="text"
                  placeholder="e.g. 145K Views"
                  value={editingReel.views || ''}
                  onChange={(e) => setEditingReel({ ...editingReel, views: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white focus:border-[#E50914] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Description (Optional)</label>
              <textarea
                rows={2}
                placeholder="Cinematic pacing, color graded 4K edit with customized audio..."
                value={editingReel.description || ''}
                onChange={(e) => setEditingReel({ ...editingReel, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white focus:border-[#E50914] focus:outline-none"
              />
            </div>

            {/* Cloudinary Video Upload & URL */}
            <div className="space-y-3 p-3 bg-[#11121c] rounded-2xl border border-[#232535]">
              <CloudinaryMediaUploader
                label="Reel Video (Upload to Cloudinary)"
                value={editingReel.videoUrl || editingReel.secure_url}
                aspectRatio="reel"
                accept="video"
                onChange={(url, meta) => {
                  setEditingReel({
                    ...editingReel,
                    videoUrl: url,
                    secure_url: url,
                    public_id: meta?.publicId || editingReel.public_id,
                    mediaType: 'video',
                    // If no thumbnail yet, auto-set video url or derive poster
                    thumbnail: editingReel.thumbnail || url.replace(/\.(mp4|mov|webm|mkv|avi)($|\?)/i, '.jpg$2'),
                  });
                }}
                helpText="Directly upload 9:16 MP4 video to Cloudinary. Large video files are chunked automatically."
              />

              <div>
                <label className="block text-gray-400 text-[11px] font-semibold mb-1">Or Direct Video URL (Cloudinary / CDN)</label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/... or https://..."
                  value={editingReel.videoUrl || editingReel.secure_url || ''}
                  onChange={(e) => {
                    const url = e.target.value;
                    setEditingReel({
                      ...editingReel,
                      videoUrl: url,
                      secure_url: url,
                      thumbnail: editingReel.thumbnail || (url.includes('.mp4') ? url.replace(/\.mp4($|\?)/i, '.jpg$1') : editingReel.thumbnail),
                    });
                  }}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#161722] border border-[#27293a] text-white text-xs"
                />
              </div>

              {/* Live Preview Before Publishing */}
              {(editingReel.videoUrl || editingReel.secure_url) && (
                <div className="pt-2 border-t border-[#1d1f2d] flex flex-col items-center">
                  <div className="text-[11px] font-bold text-gray-300 mb-1 flex items-center gap-1.5">
                    <Play className="w-3 h-3 text-[#E50914]" />
                    <span>Live 9:16 Video Player Preview</span>
                  </div>
                  <div className="w-32 sm:w-40 aspect-[9/16] rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg">
                    <video
                      src={editingReel.videoUrl || editingReel.secure_url}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail */}
            <div className="space-y-3 p-3 bg-[#11121c] rounded-2xl border border-[#232535]">
              <CloudinaryMediaUploader
                label="Vertical Thumbnail / Poster (9:16)"
                value={editingReel.thumbnail}
                aspectRatio="reel"
                accept="image"
                onChange={(url, meta) =>
                  setEditingReel({
                    ...editingReel,
                    thumbnail: url,
                    publicId: meta?.publicId || editingReel.publicId,
                  })
                }
                helpText="Optional: Upload custom 9:16 cover image. If omitted, Cloudinary generates a frame poster automatically."
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Instagram Reel URL (Optional)</label>
              <input
                type="url"
                value={editingReel.instagramUrl || ''}
                onChange={(e) => setEditingReel({ ...editingReel, instagramUrl: e.target.value })}
                placeholder="https://www.instagram.com/reel/..."
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>

            {/* Publish Status Toggle */}
            <div className="flex items-center gap-3 p-3.5 bg-[#13141f] rounded-xl border border-[#27293a]">
              <input
                type="checkbox"
                id="reel-published-checkbox"
                checked={editingReel.published !== false}
                onChange={(e) => setEditingReel({ ...editingReel, published: e.target.checked })}
                className="w-4 h-4 rounded text-[#E50914] bg-black/40 border-[#3a3c50] focus:ring-[#E50914] cursor-pointer"
              />
              <label htmlFor="reel-published-checkbox" className="text-xs font-bold text-white cursor-pointer select-none">
                Publish Reel (Active & immediately visible on the LEOX website)
              </label>
            </div>

            <div className="pt-4 border-t border-[#20222f] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReelModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/[0.06] text-white font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold shadow-lg shadow-[#E50914]/30"
              >
                {editingReel.published !== false ? 'Publish Reel' : 'Save Draft'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Services Edit Modal */}
      <Modal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        title={editingService?.id ? 'Edit Service' : 'Add Service'}
        maxWidth="md"
      >
        {editingService && (
          <form onSubmit={handleSaveService} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Service Name *</label>
              <input
                type="text"
                required
                value={editingService.serviceName || ''}
                onChange={(e) => setEditingService({ ...editingService, serviceName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Starting Price *</label>
              <input
                type="text"
                required
                value={editingService.startingPrice || ''}
                onChange={(e) => setEditingService({ ...editingService, startingPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <CloudinaryMediaUploader
                label="Service Image"
                value={editingService.image}
                aspectRatio="video"
                accept="image"
                onChange={(url) => setEditingService({ ...editingService, image: url })}
                helpText="Upload service showcase photo to Cloudinary."
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Description</label>
              <textarea
                rows={3}
                value={editingService.description || ''}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div className="pt-4 border-t border-[#20222f] flex justify-end gap-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#E50914] text-white font-bold"
              >
                Save Service
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Package Edit Modal */}
      <Modal
        isOpen={packageModalOpen}
        onClose={() => setPackageModalOpen(false)}
        title={editingPackage?.id ? 'Edit Package' : 'Add Package'}
        maxWidth="md"
      >
        {editingPackage && (
          <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Package Name *</label>
              <input
                type="text"
                required
                value={editingPackage.packageName || ''}
                onChange={(e) => setEditingPackage({ ...editingPackage, packageName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Price *</label>
              <input
                type="text"
                required
                value={editingPackage.price || ''}
                onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Duration</label>
              <input
                type="text"
                value={editingPackage.duration || ''}
                onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Short Description</label>
              <textarea
                rows={2}
                value={editingPackage.description || ''}
                onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div className="pt-4 border-t border-[#20222f] flex justify-end gap-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#E50914] text-white font-bold"
              >
                Save Package
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Testimonial Edit Modal */}
      <Modal
        isOpen={testimonialModalOpen}
        onClose={() => setTestimonialModalOpen(false)}
        title={editingTestimonial?.id ? 'Edit Review' : 'Add Review'}
        maxWidth="md"
      >
        {editingTestimonial && (
          <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={editingTestimonial.customerName || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, customerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Role / Event Type</label>
              <input
                type="text"
                value={editingTestimonial.eventType || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, eventType: e.target.value })}
                placeholder="e.g. Hyderabad Wedding"
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Client Review *</label>
              <textarea
                rows={3}
                required
                value={editingTestimonial.review || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, review: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#161722] border border-[#27293a] text-white"
              />
            </div>
            <div className="pt-4 border-t border-[#20222f] flex justify-end gap-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#E50914] text-white font-bold"
              >
                Save Review
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
