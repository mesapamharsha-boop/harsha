import React from 'react';
import { Mail, MapPin, Instagram, MessageCircle, ArrowRight, ShieldCheck, Clock, Camera } from 'lucide-react';
import { getWhatsAppUrl } from '../config/whatsapp';
import { SiteSettings } from '../types';

interface ContactPageProps {
  navigate: (path: string) => void;
  settings?: SiteSettings | null;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate, settings }) => {
  const email = settings?.email || 'leoxshoots@gmail.com';
  const whatsappUrl = settings?.whatsAppNumber
    ? `https://wa.me/${settings.whatsAppNumber.replace(/\D/g, '')}`
    : getWhatsAppUrl();
  const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/leox_shoots/';
  const address = settings?.address || 'Vijayawada • Hyderabad • Pan-India';

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span>CONNECT WITH LEOX</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white leading-tight">
            DIRECT CONTACT.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
            Connect directly with the LEOX production crew. Whether you have upcoming event dates, need customized coverage, or have questions about equipment and crew dispatch, we are here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct Channels Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-3xl bg-[#111218] border border-[#222432] space-y-6 shadow-2xl">
              <div>
                <h3 className="text-xl font-heading font-bold text-white">
                  Official Communication Desks
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Fastest response times via direct WhatsApp and official channels.
                </p>
              </div>

              <div className="space-y-4">
                {/* WhatsApp Direct */}
                <a
                  id="contact-whatsapp-link"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#0f1d14] hover:bg-[#14291c] border border-emerald-500/40 text-gray-200 transition-all duration-200 group shadow-lg shadow-emerald-950/40"
                  aria-label="Chat with LEOX on WhatsApp"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 fill-current text-[#25D366]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                      <span>WhatsApp Direct Desk</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-xs text-emerald-400 mt-1 font-medium">
                      Tap to start instant WhatsApp chat &bull; Typical reply in minutes
                    </div>
                  </div>
                </a>

                {/* Email Direct */}
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#171822] hover:bg-[#1d1f2b] border border-[#25283a] text-gray-300 hover:text-white transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Official Production Email</div>
                    <div className="text-base font-semibold text-white mt-0.5">{email}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Booking confirmations, brand briefs, invoices</div>
                  </div>
                </a>

                {/* Instagram Direct */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#171822] hover:bg-[#1d1f2b] border border-[#25283a] text-gray-300 hover:text-white transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Official Instagram</div>
                    <div className="text-base font-semibold text-white mt-0.5">@leox_shoots</div>
                    <div className="text-xs text-gray-400 mt-0.5">Follow for daily reels, event highlights, and BTS</div>
                  </div>
                </a>

                {/* Base Studios */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#171822] border border-[#25283a] text-gray-300">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Studio Hubs & Coverage</div>
                    <div className="text-base font-semibold text-white mt-0.5">{address}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Available for shoots across all Indian states & overseas destinations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Booking Portal Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#151722] via-[#111218] to-[#0d0e14] border border-[#27293a] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E50914]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF4D55] text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Main Booking System</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white leading-tight">
                    Ready to Book Your Shoot?
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Submit your event date, service, and location through our unified booking portal. Our production team checks crew availability and confirms your shoot within 24 hours.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0a0b10] border border-[#1f212f] space-y-3">
                  <div className="flex items-center gap-3 text-xs text-gray-300">
                    <Clock className="w-4 h-4 text-[#E50914] shrink-0" />
                    <span>Instant submission with same-day confirmation notice</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-300">
                    <Camera className="w-4 h-4 text-[#E50914] shrink-0" />
                    <span>9 Specialized services including Cinematic Reels, Weddings & Events</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-300">
                    <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0" />
                    <span>Verified crew assignment with dedicated gear backup</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/book')}
                  className="w-full py-4 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-xl shadow-[#E50914]/30 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
                >
                  <span>Go to Booking Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-xs text-gray-400">
                  Prefer chatting first?{' '}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2"
                  >
                    Chat with us on WhatsApp
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
