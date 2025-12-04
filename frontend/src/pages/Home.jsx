import React from 'react';
import HeroBanner from '../components/HeroBanner';
import FeaturedPets from '../components/FeaturedPets';
import HowItWorks from '../components/HowItWorks';
import AIMatchmaking from '../components/AIMatchmaking';
import TestimonialStack from '../components/TestimonialStack';
import CtaBanner from '../components/CtaBanner';

export default function Home() {
  return (
    <div>
      <div className="reveal-block" data-anim="fade-up" style={{ '--reveal-delay': '0s' }}>
        <HeroBanner />
      </div>
      <div className="reveal-block" data-anim="fade-up" style={{ '--reveal-delay': '0.1s' }}>
        <FeaturedPets />
      </div>
      <div className="reveal-block" data-anim="fade-up" style={{ '--reveal-delay': '0.2s' }}>
        <HowItWorks />
      </div>
      <div className="reveal-block" data-anim="fade-up" style={{ '--reveal-delay': '0.3s' }}>
        <AIMatchmaking />
      </div>
      <div className="reveal-block" data-anim="fade-up" style={{ '--reveal-delay': '0.35s' }}>
        <TestimonialStack />
      </div>
    </div>
  );
}
