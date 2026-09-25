import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const BookNowSection = ({ navigate }) => {
  const cities = [
    'Hyderabad',
    'Warangal',
    'Visakhapatnam',
    'Chennai',
    'vijayawada',
    'Guntur',
    'Kadapa',
    'Kakinada',
    'khammam',
    'Tirupati',
    'Nellore',
  ];

  const dividerClass =
    'border-0 h-px bg-gradient-to-r from-transparent via-[#E50914]/60 to-transparent';

  return (
    <section className="relative overflow-hidden bg-[#08080a] pt-1 pb-10">

      {/* Top Divider */}
      <div className="px-4 sm:px-6 lg:px-8">
        <hr className={dividerClass} />
      </div>

      {/* Book Now */}
      <div className="max-w-6xl mx-auto mt-4 px-4 sm:px-6 lg:px-8 text-center">

        <button
          onClick={() => {
            if (navigate) {
              navigate('/book');
            } else {
              window.location.href = '/book';
            }
          }}
          className="group inline-flex items-center gap-3 mt-2 rounded-full bg-[#E50914] px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#FF2E36] hover:scale-105 cursor-pointer"
        >
          Book Now

          <ArrowUpRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </button>

      </div>

      {/* Cities */}
      <div className="mt-10 overflow-hidden">

        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.25em] text-white/40">
          We are live across
        </p>

        <div className="relative w-full overflow-hidden">

          <div className="city-marquee">

            {/* First set */}
            {cities.map((city, index) => (
              <span
                key={`first-${index}`}
                className="city-name"
              >
                {city}
              </span>
            ))}

            {/* Duplicate set for seamless loop */}
            {cities.map((city, index) => (
              <span
                key={`second-${index}`}
                className="city-name"
              >
                {city}
              </span>
            ))}

          </div>

        </div>

        {/* Bottom Divider */}
        <div className="mt-10 px-4 sm:px-6 lg:px-8">
          <hr className={dividerClass} />
        </div>

      </div>

      {/* Animation */}
      <style>{`
        .city-marquee {
          display: flex;
          width: max-content;
          gap: 55px;
          animation: cityScroll 30s linear infinite;
        }

        .city-name {
          flex-shrink: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.65);
          white-space: nowrap;
          transition: color 0.3s ease;
        }

        .city-name:hover {
          color: #E50914;
        }

        @keyframes cityScroll {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0);
          }
        }

        @media (max-width: 640px) {
          .city-marquee {
            gap: 35px;
            animation-duration: 24s;
          }

          .city-name {
            font-size: 1.05rem;
          }
        }
      `}</style>

    </section>
  );
};