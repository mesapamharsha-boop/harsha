import React from 'react';
import {
  Eye,
  Zap,
  Smartphone,
  UserCheck,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const WhyLeoxSection: React.FC = () => {
  const pillars = [
    {
      icon: Eye,
      title: 'CINEMATIC QUALITY',
      desc: 'We turn real moments into cinematic visuals with creative framing, smooth transitions, and professional editing.',
    },
    {
      icon: Zap,
      title: 'FAST DELIVERY',
      desc: 'From shooting to final edit, we focus on an efficient workflow so you can receive your content without unnecessary delays.',
    },
    {
      icon: Smartphone,
      title: 'SOCIAL-FIRST CONTENT',
      desc: 'Content created with Instagram and social media in mind — engaging visuals, vertical formats, and edits designed to stand out.',
    },
    {
      icon: UserCheck,
      title: 'PERSONALIZED SERVICE',
      desc: 'Every project is different. We work closely with you to understand your vision, event, and style.',
    },
    {
      icon: Sparkles,
      title: 'ATTENTION TO DETAIL',
      desc: 'From the first frame to the final cut, we focus on the small details that make your video feel special.',
    },
    {
      icon: ShieldCheck,
      title: 'AGILE & RELIABLE EXECUTION',
      desc: 'Dedicated creators committed to delivering prompt, high-quality visual content from shoot to final export.',
    },
  ];

  return (
    <section id="why-leox" className="py-24 bg-[#0a0b0f] border-t border-[#181922] relative overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span>THE LEOX ADVANTAGE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white">
            WHY CHOOSE LEOX.
          </h2>

          <p className="mt-4 text-gray-400 text-sm sm:text-base">
            More than just shooting. We create visuals that tell your story.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;

            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-[#111218] border border-[#212330] hover:border-[#E50914]/50 transition-all duration-300 group hover:-translate-y-1 shadow-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center mb-6 group-hover:bg-[#E50914] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-heading font-bold text-white mb-3 tracking-wide group-hover:text-[#FF3842] transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};