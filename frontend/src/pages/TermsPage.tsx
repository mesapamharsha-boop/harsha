import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#08080a] text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#20222f] pb-6">
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            TERMS & CONDITIONS
          </h1>
          <p className="text-xs text-gray-400 mt-2">Effective Date: January 1, 2026 &bull; LEOX Media Productions</p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">1. Booking & Retainer</h2>
          <p>
            An inquiry submitted via our website does not guarantee calendar reservation until confirmed by LEOX. Once a date is verified, the specified advance retainer must be transferred to confirm the production schedule.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">2. Delivery Timelines</h2>
          <p>
            Standard Instagram reel deliverables are finalized and dispatched within 24 to 48 hours following event wrap. Extended visual edits and high-resolution galleries are delivered within 1 to 2 weeks depending on the selected package.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">3. Cancellation & Rescheduling</h2>
          <p>
            Should an event date shift due to unforeseen circumstances, LEOX will make every reasonable effort to accommodate the new schedule subject to calendar availability.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">4. Copyright & Artistic License</h2>
          <p>
            LEOX maintains artistic freedom regarding color grading, musical scoring, and sequence pacing. Clients receive personal reproduction rights for all delivered assets.
          </p>
        </section>
      </div>
    </div>
  );
};
