import React from 'react';
import { ArrowRight, MessageSquare, Calendar, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../../config/whatsapp';

interface CtaSectionProps {
  navigate: (path: string) => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ navigate }) => {
  return (
    <section id="get-started" className="py-28 bg-[#08080a] border-t border-[#181922] relative overflow-hidden text-center scroll-mt-24">
      <span id="cta" className="absolute top-0 -mt-24" />
      {/* Red ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#E50914]/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 text-xs font-bold uppercase tracking-widest text-[#FF4D55] mb-6">
          <span>NOW BOOKING ARE OPEN</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white tracking-tight mb-6 leading-tight">
          READY TO CREATE SOMETHING
          <br />
          <span className="text-[#E50914]">UNFORGETTABLE?</span>
        </h2>

        <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Dates fill up rapidly across peak wedding and festival seasons. Connect directly with LEOX and reserve your shoot today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/book')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold tracking-widest uppercase transition-all duration-200 shadow-2xl shadow-[#E50914]/40 hover:-translate-y-1 flex items-center justify-center gap-2.5"
          >
            <Calendar className="w-4 h-4" />
            <span>BOOK A SHOOT</span>
          </button>

          <a
            id="cta-whatsapp-btn"
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#102418] hover:bg-[#153020] border border-emerald-500/40 text-emerald-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/40"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>CHAT ON WHATSAPP</span>
          </a>

          <button
            onClick={() => navigate('/contact')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold tracking-widest uppercase border border-white/15 hover:border-white/30 transition-all flex items-center justify-center gap-2.5"
          >
            <MessageSquare className="w-4 h-4 text-[#E50914]" />
            <span>CONTACT LEOX</span>
          </button>
        </div>
      </div>
    </section>
  );
};
