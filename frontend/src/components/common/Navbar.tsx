import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import {
  Instagram,
  Calendar,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import {
  getWhatsAppUrl,
} from '../../config/whatsapp';
import { SiteSettings } from '../../types';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  settings?: SiteSettings | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  navigate,
  settings,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const instagramUrl =
    settings?.instagramUrl ||
    'https://www.instagram.com/leox_shoots/';

  const whatsAppNumber = settings?.whatsAppNumber;

  const whatsappUrl = whatsAppNumber
    ? `https://wa.me/${whatsAppNumber.replace(/\D/g, '')}`
    : getWhatsAppUrl();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (path: string) => {
    navigate(path);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/[0.06] transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-[#08080a]/35 shadow-2xl shadow-black/20'
          : 'py-4 bg-[#08080a]/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Brand Logo */}
        <Logo
          size="md"
          onClick={() => handleNav('/')}
          className="transition-opacity hover:opacity-90"
        />

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">

          {/* Instagram */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#FF3842] transition-colors p-2 rounded-lg hover:bg-white/[0.04]"
            aria-label="LEOX Instagram"
            id="nav-instagram-btn"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#25D366] transition-colors p-2 rounded-lg hover:bg-emerald-500/10"
            aria-label="Chat on WhatsApp"
            title="Chat on WhatsApp"
            id="nav-whatsapp-btn"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
          </a>

          {/* Book A Shoot */}
          <button
            id="nav-book-shoot-cta"
            onClick={() => handleNav('/book')}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#E50914]/25 hover:shadow-[#E50914]/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Calendar className="w-3.5 h-3.5 text-white/90" />

            <span>Book A Shoot</span>

            <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">

          {/* Book */}
          <button
            id="mobile-book-cta-pill"
            onClick={() => handleNav('/book')}
            className="px-3 py-1.5 rounded-md bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider"
          >
            Book
          </button>

          {/* Instagram */}
          <a
            id="mobile-instagram-btn"
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md text-gray-300 hover:text-[#FF3842] hover:bg-white/[0.06] transition-colors"
            aria-label="LEOX Instagram"
          >
            <Instagram className="w-7 h-7" />
          </a>

        </div>
      </div>
    </header>
  );
};