import React from 'react';
import { Package } from '../types';
import { Check, Star, ArrowRight, ShieldCheck, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../config/whatsapp';

interface PackagesPageProps {
  packages: Package[];
  navigate: (path: string) => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({ packages, navigate }) => {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span>TRANSPARENT PRICING</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white leading-tight">
            CURATED PACKAGES.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
            Choose from our pre-configured production tiers or request a customized setup tailored to your event scale.
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-20 items-stretch">
          {packages.map((pkg) => {
            const isPopular = pkg.popular;
            return (
              <div
                key={pkg.id || pkg._id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-2xl ${
                  isPopular
                    ? 'bg-[#141520] border-2 border-[#E50914] shadow-[#E50914]/15 -translate-y-2'
                    : 'bg-[#101117] border border-[#20222f] hover:border-[#E50914]/50'
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E50914] text-white text-[10px] font-extrabold tracking-widest uppercase shadow-lg shadow-[#E50914]/40 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    <span>MOST POPULAR</span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-heading font-bold text-white mb-2">
                    {pkg.packageName}
                  </h3>
                  <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-[#212332]">
                    <div className="text-2xl sm:text-3xl font-heading font-black text-white">
                      {pkg.price}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Duration: <span className="text-gray-200">{pkg.duration}</span>
                    </div>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-3 mb-8">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      What's Included:
                    </div>
                    {pkg.includedServices.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-normal">
                        <Check className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA */}
                <div>
                  <button
                    onClick={() => navigate(`/book?package=${encodeURIComponent(pkg.packageName)}`)}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-[#E50914] hover:bg-[#FF2E36] text-white shadow-lg shadow-[#E50914]/30'
                        : 'bg-white/[0.06] hover:bg-[#E50914] text-white'
                    }`}
                  >
                    <span>Book This Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom requirements note */}
        <div className="p-8 rounded-2xl bg-[#111218] border border-[#212330] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-heading font-bold text-white">
                Require Multi-Day or Custom Destination Coverage?
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                We accommodate multi-city travel, dedicated iPhone cinematography creators, and custom editing deliverables.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <a
              id="packages-whatsapp-quote-btn"
              href={getWhatsAppUrl({ message: 'Hi, I would like to inquire about a custom package and quote for an upcoming event.' })}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-[#102418] hover:bg-[#153020] border border-emerald-500/40 text-emerald-400 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Quote</span>
            </a>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors"
            >
              Contact Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
