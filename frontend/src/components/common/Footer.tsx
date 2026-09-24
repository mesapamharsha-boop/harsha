import React from 'react';
import { Logo } from './Logo';
import {
  Instagram,
  Mail,
  MapPin,
  Shield,
  MessageCircle,
} from 'lucide-react';
import {
  getWhatsAppUrl,
} from '../../config/whatsapp';
import { SiteSettings } from '../../types';

interface FooterProps {
  navigate: (path: string) => void;
  settings?: SiteSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ navigate, settings }) => {
  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSectionNav = (id: string) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      navigate(`/#${id}`);
    }
  };

  const handleGetStarted = () => {
    const ctaSection = document.getElementById('get-started') || document.getElementById('cta') || document.getElementById('book-now');
    if (ctaSection) {
      ctaSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      navigate('/book');
    }
  };

  const email = settings?.email || 'leoxshoots@gmail.com';

  const whatsAppNumber = settings?.whatsAppNumber;

  const whatsappUrl = whatsAppNumber
    ? `https://wa.me/${whatsAppNumber.replace(/\D/g, '')}`
    : getWhatsAppUrl();

  const instagramUrl =
    settings?.instagramUrl ||
    'https://www.instagram.com/leox_shoots/';

  const address =
    settings?.address ||
    'Vijayawada • Hyderabad • Available Pan-India';

  const businessName =
    settings?.businessName || 'LEOX';

  return (
    <footer
      id="main-footer"
      className="bg-[#050507] border-t border-[#181920] text-gray-400 pt-16 pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">

          {/* Brand & Creator Bio */}
          <div className="lg:col-span-5 space-y-5">

            <Logo
              size="lg"
              onClick={() => handleNav('/')}
            />

            <p className="text-sm leading-relaxed text-gray-400 max-w-md">
              {businessName} is a visual production studio focused on
              cinematic photography, videography, and social-first content.
              We capture real moments and transform them into engaging visual
              stories for events, brands, and special occasions.
            </p>

            <p className="text-sm font-bold tracking-widest text-white">
              WE SHOOT. WE EDIT. WE DELIVER.
            </p>

            <div className="pt-2 flex flex-col gap-2.5 text-xs">

              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#E50914]" />
                <span>{email}</span>
              </a>

              <a
                id="footer-whatsapp-link"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-300 hover:text-[#25D366] transition-colors group"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#E50914]" />
                <span>Official Instagram</span>
              </a>

              <div className="flex items-center gap-2.5 text-gray-400">
                <MapPin className="w-4 h-4 text-[#E50914]" />
                <span>{address}</span>
              </div>

            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-3 space-y-4">

            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
              EXPLORE LEOX
            </h4>

            <ul className="space-y-2.5 text-sm">

              {/* Home */}
              <li>
                <button
                  onClick={() => handleNav('/')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#E50914] transition-all" />
                  <span>Home</span>
                </button>
              </li>

              {/* Packages */}
              <li>
                <button
                  onClick={() => handleSectionNav('packages')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#E50914] transition-all" />
                  <span>Packages</span>
                </button>
              </li>

              {/* Book Now */}
              <li>
                <button
                  id="footer-book-now"
                  onClick={() => handleNav('/book')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#E50914] transition-all" />
                  <span>Book Now</span>
                </button>
              </li>


              {/* Contact */}
              <li>
                <button
                  onClick={() => handleNav('/contact')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#E50914] transition-all" />
                  <span>Contact LEOX</span>
                </button>
              </li>

              {/* Reviews */}
              <li>
                <button
                  onClick={() => handleSectionNav('reviews')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#E50914] transition-all" />
                  <span>Reviews</span>
                </button>
              </li>

              {/* Why Choose LEOX */}
              <li>
                <button
                  onClick={() => handleSectionNav('why-leox')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#E50914] transition-all" />
                  <span>Why Choose LEOX</span>
                </button>
              </li>

              {/* Get Started */}
              <li>
                <button
                  onClick={handleGetStarted}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#E50914] transition-all" />
                  <span>Get Started</span>
                </button>
              </li>

            </ul>
          </div>

          {/* Our Creative Services */}
          <div className="lg:col-span-4 space-y-4">

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
                OUR CREATIVE SERVICES
              </h4>

              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                From a single reel to complete event coverage — we create
                visuals that make your moments stand out.
              </p>
            </div>

            <div className="space-y-2 text-sm">

              {/* Instagram Reels */}
              <div className="p-3 rounded-lg bg-[#0e0f14] border border-[#1c1d25]">
                <div className="font-semibold text-white text-xs">
                  Instagram Reels & Short-Form Content
                </div>

                <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  Cinematic, engaging reels designed for Instagram, brands,
                  events, and personal moments.
                </div>
              </div>

              {/* Event & Wedding Films */}
              <div className="p-3 rounded-lg bg-[#0e0f14] border border-[#1c1d25]">
                <div className="font-semibold text-white text-xs">
                  Event & Wedding Films
                </div>

                <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  Capture the energy, emotions, and unforgettable moments of
                  your special day with cinematic visuals.
                </div>
              </div>

              {/* Brand & Commercial Content */}
              <div className="p-3 rounded-lg bg-[#0e0f14] border border-[#1c1d25]">
                <div className="font-semibold text-white text-xs">
                  Brand & Commercial Content
                </div>

                <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  Professional visual content for businesses, products,
                  launches, and promotional campaigns.
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#181920] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">

          <div>
            &copy; {new Date().getFullYear()}{' '}
            <strong className="text-white">LEOX</strong>.
            {' '}All Rights Reserved.
          </div>

          <div className="flex items-center gap-5">

            <button
              onClick={() => handleNav('/privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>

            <span>&bull;</span>

            <button
              onClick={() => handleNav('/terms')}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>

            <span>&bull;</span>

            <button
              id="footer-admin-link"
              onClick={() => handleNav('/admin/login')}
              className="flex items-center gap-1 hover:text-[#E50914] transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>

          </div>
        </div>

      </div>
    </footer>
  );
};