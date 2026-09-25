import React from 'react';
import { ArrowUpRight, Quote } from 'lucide-react';
import { Testimonial } from '../../types';

interface ReviewsSectionProps {
  testimonials?: Testimonial[];
}

interface ClientTestimonial {
  name: string;
  event: string;
  quote: string;
}

const EXACT_4_TESTIMONIALS: ClientTestimonial[] = [
  {
    name: 'Rahul & Priya',
    event: 'Wedding Reels',
    quote:
      'LEOX captured our special moments beautifully. The editing was smooth, cinematic, and perfectly matched the mood of our wedding. We loved how every important moment was turned into a memorable reel.',
  },
  {
    name: 'Arjun',
    event: 'Birthday Celebration',
    quote:
      'The LEOX team made our birthday celebration look truly special. They were creative, professional, and captured all the best moments. The final reel was stylish, energetic, and better than we expected.',
  },
  {
    name: 'Sneha Reddy',
    event: 'Brand Promotional Shoot',
    quote:
      'LEOX understood our brand vision and created content that looked clean, modern, and professional. The video was perfect for Instagram and helped us present our brand in a much better way.',
  },
  {
    name: 'Kiran Kumar',
    event: 'Bike Delivery Reel',
    quote:
      'I booked LEOX for my bike delivery video, and the final result was amazing. They captured every important moment and turned it into a cinematic reel. The editing, music, and overall presentation were excellent.',
  },
];

export const ReviewsSection: React.FC<ReviewsSectionProps> = () => {
  return (
    <div className="relative overflow-hidden bg-[#08080a] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.3em] text-[#E50914] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
              <span>Client Experiences</span>
            </p>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-white">
              What Our <span className="text-[#E50914]">Clients Say</span>
            </h2>

            <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-gray-400">
              Real experiences from couples, creators, and brands who chose LEOX to capture their most significant moments.
            </p>
          </div>
        </div>

        {/* 4 Responsive Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXACT_4_TESTIMONIALS.map((item, index) => (
            <div
              key={index}
              className="group relative bg-[#0e0f14] border border-[#1e202b] rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:border-[#E50914]/50 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-[#E50914]/5 flex flex-col justify-between"
            >
              <div>
                {/* Header with Quote Icon & Event Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center border border-[#E50914]/20 group-hover:bg-[#E50914]/20 transition-colors">
                    <Quote className="w-5 h-5 text-[#E50914]" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-300 bg-[#161722] px-2.5 py-1 rounded-full border border-[#232535]">
                    {item.event}
                  </span>
                </div>

                {/* Testimonial Quote */}
                <p className="text-sm leading-relaxed text-gray-300 italic">
                  “{item.quote}”
                </p>
              </div>

              {/* Client Name & Event Info */}
              <div className="mt-6 pt-5 border-t border-[#1c1e28] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    <span className="text-gray-500 font-medium">Event:</span> {item.event}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#161722] border border-[#232535] text-gray-300 flex items-center justify-center text-xs font-bold group-hover:border-[#E50914]/50 group-hover:text-[#E50914] transition-colors">
                  {item.name.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Social / Instagram Follow Link */}
        <div className="mt-14 text-center">
          <p className="text-sm text-gray-400">
            Want to see live client reactions and reel drops?
          </p>

          <a
            href="https://www.instagram.com/leox_shoots/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#E50914] transition-colors hover:text-[#FF2E36]"
          >
            <span>Follow @leox_shoots on Instagram</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};
