import React from 'react';

export const IntroSection: React.FC = () => {
  const boxes = Array.from({ length: 10 });

  return (
    <section className="w-full overflow-hidden bg-[#0a0b0f] py-10">
      <div className="overflow-hidden">
        <div className="reel-track">
          {[...boxes, ...boxes].map((_, index) => (
            <div
              key={index}
              className="
                flex-none
                w-[160px]
                sm:w-[190px]
                md:w-[220px]
                aspect-[9/16]
                rounded-2xl
                bg-[#15161d]
                border border-[#252733]
              "
            />
          ))}
        </div>
      </div>
    </section>
  );
};
