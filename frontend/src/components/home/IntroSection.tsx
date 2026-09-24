import React from 'react';
import { Instagram, ArrowRight } from 'lucide-react';

interface IntroSectionProps {
  navigate?: (path: string) => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ navigate }) => {
  return (
    <section
      id="works"
      className="w-full bg-[#0a0b0f] py-14 sm:py-16 border-t border-[#171822] scroll-mt-20 relative overflow-hidden"
    >
      <div id="reels" className="relative -top-24 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          {/* Section Titles */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
              <span>VERTICAL REEL SHOWCASE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
              FEATURED WORKS & REELS
            </h2>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="https://www.instagram.com/leox_shoots/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-gray-200 hover:text-white transition-all duration-200 shadow-md hover:-translate-y-0.5"
            >
              <Instagram className="w-4 h-4 text-[#E50914]" />
              <span>@leox_shoots</span>
            </a>

            {navigate && (
              <button
                type="button"
                onClick={() => navigate('/reels')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-[#E50914] border border-white/10 hover:border-[#E50914] text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 shadow-md hover:-translate-y-0.5 group cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
