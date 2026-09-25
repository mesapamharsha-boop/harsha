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

import {
  Service,
  PortfolioProject,
  Reel,
  Package,
  Testimonial,
  SiteSettings,
} from './types';

export default function App() {
  /* =========================================================
     ROUTER STATE
  ========================================================= */

  const [currentPath, setCurrentPath] = useState<string>(
    () => window.location.pathname || '/'
  );

  const [urlParams, setUrlParams] = useState<URLSearchParams>(
    () => new URLSearchParams(window.location.search)
  );

  /* =========================================================
     DATA STATES
  ========================================================= */

  const [services, setServices] = useState<Service[]>([]);

  const [projects, setProjects] = useState<PortfolioProject[]>([]);

  // Existing database reels
  const [reels, setReels] = useState<Reel[]>([]);

  // Reels automatically fetched from Cloudinary
  const [cloudinaryReels, setCloudinaryReels] = useState<Reel[]>([]);

  const [packages, setPackages] = useState<Package[]>([]);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  /* =========================================================
     ROUTER NAVIGATION
  ========================================================= */

  const navigate = useCallback((to: string) => {
    const [path, queryString] = to.split('?');

    window.history.pushState({}, '', to);

    setCurrentPath(path || '/');

    setUrlParams(
      new URLSearchParams(queryString || '')
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  /* =========================================================
     BROWSER BACK / FORWARD
  ========================================================= */

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(
        window.location.pathname || '/'
      );

      setUrlParams(
        new URLSearchParams(
          window.location.search
        )
      );
    };

    window.addEventListener(
      'popstate',
      handlePopState
    );

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState
      );
    };
  }, []);

  /* =========================================================
     FETCH WEBSITE DATA
  ========================================================= */

  const loadData = useCallback(async () => {
    try {
      const [
        servRes,
        portRes,
        reelRes,
        cloudinaryReelRes,
        pkgRes,
        testRes,
        setRes,
      ] = await Promise.all([
        /* SERVICES */
        api
          .getServices()
          .catch(() => ({
            services: [],
          })),

        /* PORTFOLIO */
        api
          .getPortfolio()
          .catch(() => ({
            projects: [],
          })),

        /* EXISTING DATABASE REELS */
        api
          .getReels()
          .catch(() => ({
            reels: [],
          })),

        /* CLOUDINARY REELS */
        api
          .getCloudinaryReels()
          .catch(() => ({
            success: false,
            reels: [],
            count: 0,
          })),

        /* PACKAGES */
        api
          .getPackages()
          .catch(() => ({
            packages: [],
          })),

        /* TESTIMONIALS */
        api
          .getTestimonials()
          .catch(() => ({
            testimonials: [],
          })),

        /* SETTINGS */
        api
          .getSettings()
          .catch(() => ({
            settings: null as any,
          })),
      ]);

      /* =====================================================
         SAVE SERVICES
      ===================================================== */

      if (servRes.services) {
        setServices(servRes.services);
      }

      /* =====================================================
         SAVE PORTFOLIO
      ===================================================== */

      if (portRes.projects) {
        setProjects(portRes.projects);
      }

      /* =====================================================
         SAVE EXISTING DATABASE REELS
      ===================================================== */

      if (reelRes.reels) {
        setReels(reelRes.reels);
      }

      /* =====================================================
         SAVE CLOUDINARY REELS
      ===================================================== */

      if (cloudinaryReelRes.reels) {
        setCloudinaryReels(
          cloudinaryReelRes.reels
        );
      }

      /* =====================================================
         SAVE PACKAGES
      ===================================================== */

      if (pkgRes.packages) {
        setPackages(pkgRes.packages);
      }

      /* =====================================================
         SAVE TESTIMONIALS
      ===================================================== */

      if (testRes.testimonials) {
        setTestimonials(
          testRes.testimonials
        );
      }

      /* =====================================================
         SAVE SETTINGS
      ===================================================== */

      if (setRes.settings) {
        setSettings(setRes.settings);
      }
    } catch (err) {
      console.warn(
        '[App] Error fetching initial data:',
        err
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================================================
     INITIAL DATA LOAD
     + ADMIN UPDATE LISTENER
  ========================================================= */

  useEffect(() => {
    loadData();

    const handleDataUpdated = () => {
      loadData();
    };

    window.addEventListener(
      'leox:data-updated',
      handleDataUpdated
    );

    return () => {
      window.removeEventListener(
        'leox:data-updated',
        handleDataUpdated
      );
    };
  }, [loadData]);

  /* =========================================================
     ADMIN DASHBOARD CHECK
  ========================================================= */

  const isAdminDashboard =
    currentPath.startsWith(
      '/admin/dashboard'
    );

  /* =========================================================
     RENDER CURRENT PAGE
  ========================================================= */

  const renderContent = () => {
    switch (currentPath) {
      /* =====================================================
         HOME
      ===================================================== */

      case '/':
        return (
          <HomePage
            services={services}
            projects={projects}

            /*
             * IMPORTANT:
             * Homepage ReelsShowcase now receives
             * videos fetched directly from Cloudinary.
             */
            reels={cloudinaryReels}

            testimonials={testimonials}
            settings={settings}
            navigate={navigate}
          />
        );

      /* =====================================================
         LEGACY ROUTES
      ===================================================== */

      case '/about':
      case '/portfolio':
        navigate('/');
        return null;

      /* =====================================================
         SERVICES
      ===================================================== */

      case '/services':
        return (
          <ServicesPage
            services={services}
            navigate={navigate}
          />
        );

      /* =====================================================
         REELS
      ===================================================== */

      case '/reels':
        return (
          <ReelsPage
            reels={reels}
            navigate={navigate}
          />
        );

      /* =====================================================
         PACKAGES
      ===================================================== */

      case '/packages':
        return (
          <PackagesPage
            packages={packages}
            navigate={navigate}
          />
        );

      /* =====================================================
         CONTACT
      ===================================================== */

      case '/contact':
        return (
          <ContactPage
            navigate={navigate}
            settings={settings}
          />
        );

      /* =====================================================
         BOOKING
      ===================================================== */

      case '/book':
        return (
          <BookingPage
            services={services}
            packages={packages}
            navigate={navigate}
            urlParams={urlParams}
          />
        );

      /* =====================================================
         BOOKING SUCCESS
      ===================================================== */

      case '/booking-success':
        return (
          <BookingSuccessPage
            navigate={navigate}
          />
        );

      /* =====================================================
         PRIVACY
      ===================================================== */

      case '/privacy':
        return <PrivacyPage />;

      /* =====================================================
         TERMS
      ===================================================== */

      case '/terms':
        return <TermsPage />;

      /* =====================================================
         ADMIN LOGIN
      ===================================================== */

      case '/admin':
      case '/admin/login':
        return (
          <AdminLoginPage
            navigate={navigate}
          />
        );

      /* =====================================================
         ADMIN DASHBOARD
      ===================================================== */

      case '/admin/dashboard':
        return (
          <AdminDashboardPage
            navigate={navigate}
            onDataUpdated={loadData}
          />
        );

      /* =====================================================
         404
      ===================================================== */

      default:
        return (
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 bg-[#08080a]">

            <div className="text-[#E50914] text-6xl font-heading font-black mb-4">
              404
            </div>

            <h1 className="text-2xl font-heading font-bold text-white mb-2">
              Page Not Found
            </h1>

            <p className="text-gray-400 text-sm max-w-md mb-6">
              The frame you are looking for does not exist in our production archives.
            </p>

            <button
              onClick={() => navigate('/')}
              className="
                px-6
                py-3
                rounded-xl
                bg-[#E50914]
                hover:bg-[#FF2E36]
                text-white
                text-xs
                font-bold
                uppercase
                tracking-wider
                transition-colors
              "
            >
              Return To Homepage
            </button>

          </div>
        );
    }
  };

  /* =========================================================
     APP UI
  ========================================================= */

  return (
    <AuthProvider>
      <ToastProvider>

        <div
          className="
            min-h-screen
            bg-[#08080a]
            text-[#f2f2f4]
            flex
            flex-col
            selection:bg-[#E50914]
            selection:text-white
          "
        >

          {/* =================================================
              PUBLIC NAVBAR
          ================================================= */}

          {!isAdminDashboard && (
            <Navbar
              currentPath={currentPath}
              navigate={navigate}
              settings={settings}
            />
          )}

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <main className="flex-1 w-full">
            {renderContent()}
          </main>

          {/* =================================================
              FLOATING WHATSAPP
          ================================================= */}

          {!isAdminDashboard && (
            <FloatingWhatsApp
              settings={settings}
            />
          )}

          {/* =================================================
              PUBLIC FOOTER
          ================================================= */}

          {!isAdminDashboard && (
            <Footer
              navigate={navigate}
              settings={settings}
            />
          )}

        </div>

      </ToastProvider>
    </AuthProvider>
  );
}