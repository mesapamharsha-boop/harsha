import React from 'react';
import { Service } from '../types';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface ServicesPageProps {
  services: Service[];
  navigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ services, navigate }) => {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span>PRODUCTION CAPABILITIES</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white leading-tight">
            SERVICES & EXPERTISE.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
            From high-octane viral Instagram reel production to theatrical full-day wedding and festival cinema films, discover the tailored disciplines offered by LEOX.
          </p>
        </div>

        {/* Detailed Service Cards List */}
        <div className="space-y-12">
          {services.map((service, index) => (
            <div
              key={service.id || service._id}
              className={`rounded-3xl overflow-hidden bg-[#111218] border border-[#212330] hover:border-[#E50914]/60 transition-all duration-300 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Service Visual */}
              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#181a24]">
                <img
                  src={service.image}
                  alt={service.serviceName}
                  className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111218] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-xs font-bold text-white">
                  Starting at {service.startingPrice}
                </div>
              </div>

              {/* Service Content */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E50914]">
                    SERVICE {index < 9 ? `0${index + 1}` : index + 1}
                  </span>
                  {service.duration && (
                    <span className="text-xs text-gray-400 bg-white/[0.04] px-2.5 py-1 rounded-md">
                      {service.duration}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  {service.serviceName}
                </h2>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {service.description}
                </p>

                {/* Key Deliverables */}
                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                      Included Deliverables:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-200">
                      {service.deliverables.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action CTA */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => navigate(`/book?service=${encodeURIComponent(service.serviceName)}`)}
                    className="px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#E50914]/30 flex items-center gap-2"
                  >
                    <span>Book This Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => navigate('/packages')}
                    className="px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors"
                  >
                    Compare Packages
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
