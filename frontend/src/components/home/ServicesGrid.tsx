import React from 'react';
import { Service } from '../../types';
import { ArrowRight } from 'lucide-react';

interface ServicesGridProps {
  services: Service[];
  navigate: (path: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  services,
  navigate,
}) => {
  return (
    <section className="py-24 bg-[#08080a] border-t border-[#181922]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />

              <span>WHAT WE DELIVER</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white">
              CRAFTED FOR IMPACT.
            </h2>
          </div>

          <p className="text-gray-400 text-sm max-w-md">
            Every production is engineered with cinema lenses, color-managed
            workflows, and tailored turnaround speeds to ensure your moments
            look iconic.
          </p>
        </div>


        {/* =========================================
            SERVICES - 3 CARDS HORIZONTAL
        ========================================= */}

        <div
          className="
            flex
            flex-row
            flex-nowrap
            gap-6
            w-full
            overflow-hidden
          "
        >

          {services.slice(0, 3).map((service) => (

            <div
              key={service.id || service._id}
              className="
                group
                relative
                flex
                flex-col
                flex-shrink-0
                w-[calc(33.333%-16px)]
                rounded-2xl
                overflow-hidden
                bg-[#111218]
                border
                border-[#20222e]
                hover:border-[#E50914]/60
                transition-all
                duration-300
                shadow-xl
                hover:-translate-y-1.5
              "
            >

              {/* =========================================
                  SERVICE IMAGE
              ========================================= */}

              <div className="relative w-full h-60 overflow-hidden bg-[#181a24]">

                <img
                  src={service.image}
                  alt={service.serviceName}
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-110
                    brightness-90
                    group-hover:brightness-100
                  "
                  loading="lazy"
                />

                {/* Image Gradient */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#111218]
                    via-transparent
                    to-black/30
                  "
                />

                {/* Starting Price */}
                <div
                  className="
                    absolute
                    top-4
                    right-4
                    px-3
                    py-1
                    rounded-full
                    bg-black/70
                    backdrop-blur-md
                    border
                    border-white/15
                    text-[11px]
                    font-bold
                    tracking-wider
                    text-white
                  "
                >
                  From {service.startingPrice}
                </div>

              </div>


              {/* =========================================
                  CARD BODY
              ========================================= */}

              <div className="p-6 flex-1 flex flex-col justify-between">

                <div>

                  {/* Service Name */}
                  <h3
                    className="
                      text-xl
                      font-heading
                      font-bold
                      text-white
                      mb-2.5
                      group-hover:text-[#FF3842]
                      transition-colors
                    "
                  >
                    {service.serviceName}
                  </h3>


                  {/* Description */}
                  <p
                    className="
                      text-xs
                      sm:text-sm
                      text-gray-400
                      leading-relaxed
                      line-clamp-3
                      mb-6
                    "
                  >
                    {service.description}
                  </p>

                </div>


                {/* =========================================
                    BUTTONS
                ========================================= */}

                <div
                  className="
                    pt-4
                    border-t
                    border-[#1f202c]
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  {/* View Details */}
                  <button
                    type="button"
                    onClick={() => navigate('/services')}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-white
                      group-hover:text-[#E50914]
                      transition-colors
                    "
                  >
                    <span>View Details</span>

                    <ArrowRight
                      className="
                        w-3.5
                        h-3.5
                        transition-transform
                        duration-200
                        group-hover:translate-x-1
                      "
                    />
                  </button>


                  {/* Book Shoot */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/book?service=${encodeURIComponent(
                          service.serviceName
                        )}`
                      )
                    }
                    className="
                      shrink-0
                      px-3
                      py-1.5
                      rounded-lg
                      bg-[#E50914]/15
                      hover:bg-[#E50914]
                      text-[#FF4D55]
                      hover:text-white
                      text-xs
                      font-semibold
                      transition-colors
                    "
                  >
                    Book Shoot
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
};