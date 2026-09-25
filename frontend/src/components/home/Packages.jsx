import React from 'react';
import { ArrowUpRight, Check } from 'lucide-react';

export const Packages = ({ navigate }) => {
  const packages = [
    {
      name: 'LEOX Elite',
      price: '₹1,599',
      originalPrice: '₹2,499',
      discount: '36% OFF',
      duration: 'Up to 1 Hour',
      reels: '1 Edited Reel',
      popular: false,
      included: [
        'Up to 1 Hour On-Site Coverage',
        '1 High-Impact Edited Reel',
        'Same-Day Reel Delivery',
        'LEOX Branding Included',
        'Basic Color Grading & Audio Edit',
      ],
    },
    {
      name: 'LEOX Pro',
      price: '₹2,999',
      originalPrice: '₹3,999',
      discount: '25% OFF',
      duration: 'Up to 2.5 Hours',
      reels: '2 Edited Reels',
      popular: false,
      included: [
        'Up to 2.5 Hours On-Site Coverage',
        '2 High-Impact Edited Reels',
        'Same-Day Reel Delivery',
        'LEOX Branding Included',
        'Trending Music Sync & Color Grading',
      ],
    },
    {
      name: 'LEOX Pro+',
      price: '₹4,499',
      originalPrice: '₹5,999',
      discount: '25% OFF',
      duration: 'Up to 3.5 Hours',
      reels: '3 Edited Reels',
      popular: true,
      included: [
        'Up to 3.5 Hours On-Site Coverage',
        '3 High-Impact Edited Reels',
        'Same-Day Reel Delivery',
        'LEOX Branding Included',
        'Priority On-Site Edit & Sync',
        'Dedicated iPhone Creator Kit',
      ],
    },
    {
      name: 'LEOX Max',
      price: '₹5,999',
      originalPrice: '₹7,999',
      discount: '25% OFF',
      duration: 'Up to 4.5 Hours',
      reels: '4 Edited Reels',
      popular: false,
      included: [
        'Up to 4.5 Hours On-Site Coverage',
        '4 High-Impact Edited Reels',
        'Same-Day Reel Delivery',
        'RAW Video Footage Included',
        'LEOX Branding Included',
        'VIP Creator & Rush Edit Queue',
      ],
    },
  ];

  // Same navigation behavior as Navbar, passing selected package
  const handleBookNow = (pkgName) => {
    if (pkgName) {
      navigate(`/book?package=${encodeURIComponent(pkgName)}`);
    } else {
      navigate('/book');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen bg-[#08080a] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mb-14">
          <p className="mb-4 text-xs font-bold tracking-[0.3em] text-[#E50914] uppercase">
            LEOX Packages
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Choose Your
            <span className="text-[#E50914]"> Package.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/50 leading-relaxed">
            Professional shoot coverage, high-impact reels and fast delivery —
            built for events, brands and creators.
          </p>
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative flex flex-col rounded-2xl p-6 transition-all duration-300 ${
                pkg.popular
                  ? 'bg-[#111217] border border-[#E50914]/60'
                  : 'bg-[#0d0e12] border border-white/[0.07]'
              }`}
            >

              {/* Popular */}
              {pkg.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="rounded-full bg-[#E50914] px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                    ★ Most Popular
                  </span>
                </div>
              )}

              {/* Package Name */}
              <div className="mb-7">
                <h2 className="text-xl font-bold text-white">
                  {pkg.name}
                </h2>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">
                    {pkg.price}
                  </span>

                  <span className="mb-1 text-sm text-white/30 line-through">
                    {pkg.originalPrice}
                  </span>

                  <span className="mb-1 text-xs font-bold text-[#E50914]">
                    {pkg.discount}
                  </span>
                </div>
              </div>

              {/* Main Features */}
              <div className="mb-7 space-y-2">
                <p className="text-sm font-semibold text-white">
                  {pkg.duration}
                </p>

                <p className="text-sm text-white/50">
                  {pkg.reels}
                </p>
              </div>

              {/* Divider */}
              <div className="mb-6 h-px bg-white/[0.07]" />

              {/* Included */}
              <div className="flex-1">
                <p className="mb-4 text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase">
                  What's Included
                </p>

                <ul className="space-y-3">
                  {pkg.included.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-white/65"
                    >
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-[#E50914]"
                      />

                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Book Button */}
              <button
                onClick={() => handleBookNow(pkg.name)}
                className={`group mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
                  pkg.popular
                    ? 'bg-[#E50914] text-white hover:bg-[#FF2E36] shadow-lg shadow-[#E50914]/20'
                    : 'bg-white text-black hover:bg-[#E50914] hover:text-white'
                }`}
              >
                <span>Book {pkg.name}</span>

                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </button>

            </div>
          ))}

        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/35">
            Need a custom package for your event?

            <button
              onClick={() => handleBookNow('Custom / Undecided')}
              className="ml-2 font-semibold text-[#E50914] hover:text-[#FF2E36]"
            >
              Talk to us →
            </button>
          </p>
        </div>

      </div>
    </section>
  );
};