import React, { useEffect, useState } from 'react';
import { Booking } from '../types';
import confetti from 'canvas-confetti';
import { CheckCircle2, Calendar, MapPin, MessageCircle, ArrowRight, Home, Sparkles } from 'lucide-react';
import { getWhatsAppUrl } from '../config/whatsapp';

interface BookingSuccessPageProps {
  navigate: (path: string) => void;
}

export const BookingSuccessPage: React.FC<BookingSuccessPageProps> = ({ navigate }) => {
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    // Read from session storage
    const raw = sessionStorage.getItem('last_booking');
    if (raw) {
      try {
        setBooking(JSON.parse(raw));
      } catch (err) {
        console.error(err);
      }
    }

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E50914', '#ffffff', '#22c55e', '#f59e0b'],
      });
    } catch {
      // ignore
    }
  }, []);

  const waRawMessage = booking
    ? `Hi LEOX, I just submitted booking request #${booking.id} for "${booking.service}" on ${booking.eventDate} in ${booking.city}. Looking forward to discussing coverage!`
    : 'Hi LEOX, I just submitted a booking request with LEOX!';
  const whatsappUrl = getWhatsAppUrl({ message: waRawMessage });

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#08080a] flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#111218] border border-[#262837] p-8 sm:p-12 text-center shadow-2xl space-y-8">
          {/* Animated Success Badge */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-950/50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>REQUEST RECORDED IN PRODUCTION DATABASE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white">
              YOU'RE IN THE CALENDAR QUEUE!
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
              LEOX has received your booking brief. We are reviewing schedule availability and will reach out promptly.
            </p>
          </div>

          {/* Booking Summary Card */}
          {booking && (
            <div className="p-6 rounded-2xl bg-[#171822] border border-[#292b3a] text-left space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#262837] text-xs">
                <span className="text-gray-400 font-medium">Reference Code</span>
                <span className="font-mono font-bold text-[#E50914] bg-[#E50914]/10 px-2.5 py-0.5 rounded border border-[#E50914]/30">
                  {booking.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Client Name</span>
                  <span className="text-white font-semibold">{booking.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Service</span>
                  <span className="text-white font-semibold">{booking.service}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Event Date</span>
                  <span className="text-white font-semibold">{booking.eventDate}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Location</span>
                  <span className="text-white font-semibold">{booking.city} &bull; {booking.venue}</span>
                </div>
              </div>
            </div>
          )}

          {/* What happens next roadmap */}
          <div className="text-left max-w-xl mx-auto pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
              NEXT STEPS IN OUR WORKFLOW:
            </h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white/[0.08] text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                <span>LEOX verifies production availability and prepares your customized package shot list.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white/[0.08] text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                <span>You will receive a consultation or WhatsApp message to confirm timeline and requirements.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white/[0.08] text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                <span>Official calendar lock is completed with zero hassle.</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-[#20222f] flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              id="booking-success-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect Instantly On WhatsApp</span>
            </a>

            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back To Homepage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
