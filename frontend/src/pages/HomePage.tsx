import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { IntroSection } from '../components/home/IntroSection';
import { WhyLeoxSection } from '../components/home/WhyLeoxSection';
import { CtaSection } from '../components/home/CtaSection';
import { BookNowSection } from '../components/home/BookNowSection';
import { Packages } from '../components/home/Packages';
import { ReviewsSection } from '../components/home/ReviewsSection';

import {
  Service,
  PortfolioProject,
  Reel,
  Testimonial,
  SiteSettings,
} from '../types';

interface HomePageProps {
  services: Service[];
  projects: PortfolioProject[];
  reels: Reel[];
  testimonials: Testimonial[];
  settings?: SiteSettings | null;
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  services: _services,
  projects: _projects,
  reels: _reels,
  testimonials: _testimonials,
  settings,
  navigate,
}) => {
  return (
    <div className="w-full">
      <section id="home">
        <HeroSection
          navigate={navigate}
          settings={settings}
        />
      </section>

      {/* Featured Works & Reels */}
      <IntroSection navigate={navigate} />

      <section id="book-now">
        <BookNowSection navigate={navigate} />
      </section>

      <section id="packages">
        <Packages navigate={navigate} />
      </section>

      <section id="reviews" className="scroll-mt-24">
        <ReviewsSection testimonials={_testimonials} />
      </section>

      <section id="why-leox">
        <WhyLeoxSection />
      </section>

      <section id="cta">
        <CtaSection navigate={navigate} />
      </section>
    </div>
  );
};
