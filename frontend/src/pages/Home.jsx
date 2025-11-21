import React from 'react';
import HeroBanner from '../components/HeroBanner';
import FeaturedPets from '../components/FeaturedPets';
import HowItWorks from '../components/HowItWorks';
import AIMatchmaking from '../components/AIMatchmaking';
import TestimonialStack from '../components/TestimonialStack';

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <FeaturedPets />
      <HowItWorks />
      <AIMatchmaking />
      <TestimonialStack />
    </div>
  );
}
