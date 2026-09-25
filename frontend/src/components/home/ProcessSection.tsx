import React from 'react';
import { MessageSquare, Layers, CalendarCheck, Smartphone, Sparkles } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'TELL US ABOUT YOUR EVENT',
      desc: 'Submit your dates, venue, guest count, and creative vision through our fast booking portal or WhatsApp.',
      icon: MessageSquare,
    },
    {
      num: '02',
      title: 'CHOOSE YOUR SERVICE',
      desc: 'Select from our tailored LEOX reel & event coverage packages — or craft a bespoke plan.',
      icon: Layers,
    },
    {
      num: '03',
      title: 'CONFIRM YOUR DATE',
      desc: 'Lock in your schedule with our production calendar. We pre-plan creative angles, shot lists, and lighting setups.',
      icon: CalendarCheck,
    },
    {
      num: '04',
      title: 'WE CAPTURE IT',
      desc: 'Shot unobtrusively on the latest iPhones, capturing organic laughter, grand celebrations, and real energy.',
      icon: Smartphone,
    },
    {
      num: '05',
      title: 'RECEIVE YOUR CONTENT',
      desc: 'Receive polished, high-bitrate vertical reels in 24 hours, followed by your complete private master gallery.',
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-24 bg-[#08080a] border-t border-[#181922]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span>HOW WE COLLABORATE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white">
            THE PRODUCTION PROCESS.
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col items-start p-6 rounded-2xl bg-[#101117] border border-[#20222f] hover:border-[#E50914]/60 transition-all duration-300 group shadow-lg"
              >
                {/* Step Number with Red Accent */}
                <div className="flex items-center justify-between w-full mb-5">
                  <span className="text-3xl font-heading font-black text-white/20 group-hover:text-[#E50914] transition-colors">
                    {step.num}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] text-gray-400 group-hover:text-[#E50914] flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-white mb-2 leading-snug group-hover:text-[#FF3842] transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
