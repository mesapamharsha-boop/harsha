import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ReelsPage } from './pages/ReelsPage';
import { PackagesPage } from './pages/PackagesPage';
import { ContactPage } from './pages/ContactPage';
import { BookingPage } from './pages/BookingPage';
import { BookingSuccessPage } from './pages/BookingSuccessPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// API & Types
import { api } from './services/api';
import { Service, PortfolioProject, Reel, Package, Testimonial, SiteSettings } from './types';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [urlParams, setUrlParams] = useState<URLSearchParams>(() => new URLSearchParams(window.location.search));

  // Data states
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Router navigation helper
  const navigate = useCallback((to: string) => {
    const [path, queryString] = to.split('?');
    window.history.pushState({}, '', to);
    setCurrentPath(path || '/');
    setUrlParams(new URLSearchParams(queryString || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setUrlParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch public content and keep synced with Admin updates
  const loadData = useCallback(async () => {
    try {
      const [servRes, portRes, reelRes, pkgRes, testRes, setRes] = await Promise.all([
        api.getServices().catch(() => ({ services: [] })),
        api.getPortfolio().catch(() => ({ projects: [] })),
        api.getReels().catch(() => ({ reels: [] })),
        api.getPackages().catch(() => ({ packages: [] })),
        api.getTestimonials().catch(() => ({ testimonials: [] })),
        api.getSettings().catch(() => ({ settings: null as any })),
      ]);

      if (servRes.services) setServices(servRes.services);
      if (portRes.projects) setProjects(portRes.projects);
      if (reelRes.reels) setReels(reelRes.reels);
      if (pkgRes.packages) setPackages(pkgRes.packages);
      if (testRes.testimonials) setTestimonials(testRes.testimonials);
      if (setRes.settings) setSettings(setRes.settings);
    } catch (err) {
      console.warn('[App] Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Listen for real-time data update events triggered from Admin Panel
    const handleDataUpdated = () => {
      loadData();
    };

    window.addEventListener('leox:data-updated', handleDataUpdated);
    return () => window.removeEventListener('leox:data-updated', handleDataUpdated);
  }, [loadData]);

  // Determine whether to display the public navbar and footer
  const isAdminDashboard = currentPath.startsWith('/admin/dashboard');

  // Render current view
  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return (
          <HomePage
            services={services}
            projects={projects}
            reels={reels}
            testimonials={testimonials}
            settings={settings}
            navigate={navigate}
          />
        );
      case '/about':
      case '/portfolio':
        // Legacy routes removed from public website - redirect to home
        navigate('/');
        return null;
      case '/services':
        return <ServicesPage services={services} navigate={navigate} />;
      case '/reels':
        return <ReelsPage reels={reels} navigate={navigate} />;
      case '/packages':
        return <PackagesPage packages={packages} navigate={navigate} />;
      case '/contact':
        return <ContactPage navigate={navigate} settings={settings} />;
      case '/book':
        return (
          <BookingPage
            services={services}
            packages={packages}
            navigate={navigate}
            urlParams={urlParams}
          />
        );
      case '/booking-success':
        return <BookingSuccessPage navigate={navigate} />;
      case '/privacy':
        return <PrivacyPage />;
      case '/terms':
        return <TermsPage />;
      case '/admin':
      case '/admin/login':
        return <AdminLoginPage navigate={navigate} />;
      case '/admin/dashboard':
        return <AdminDashboardPage navigate={navigate} onDataUpdated={loadData} />;
      default:
        return (
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 bg-[#08080a]">
            <div className="text-[#E50914] text-6xl font-heading font-black mb-4">404</div>
            <h1 className="text-2xl font-heading font-bold text-white mb-2">Page Not Found</h1>
            <p className="text-gray-400 text-sm max-w-md mb-6">
              The frame you are looking for does not exist in our production archives.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Return To Homepage
            </button>
          </div>
        );
    }
  };

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-[#08080a] text-[#f2f2f4] flex flex-col selection:bg-[#E50914] selection:text-white">
          {/* Public Navbar (hidden on admin dashboard) */}
          {!isAdminDashboard && <Navbar currentPath={currentPath} navigate={navigate} settings={settings} />}

          {/* Main Content Area */}
          <main className="flex-1 w-full">
            {renderContent()}
          </main>

          {/* Floating WhatsApp Quick Action (Public pages) */}
          {!isAdminDashboard && <FloatingWhatsApp settings={settings} />}

          {/* Public Footer (hidden on admin dashboard) */}
          {!isAdminDashboard && <Footer navigate={navigate} settings={settings} />}
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
