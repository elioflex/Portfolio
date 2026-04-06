import React from 'react';
import Header from '../components/landing/Header';
import HeroPreview2 from '../components/landing/HeroPreview2';
import SocialProof from '../components/landing/SocialProof';
import Services from '../components/landing/Services';
import Process from '../components/landing/Process';
import Trust from '../components/landing/Trust';
import Team from '../components/landing/Team';
import FAQ from '../components/landing/FAQ';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';

export default function Preview2() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroPreview2 />
        <SocialProof />
        <Services />
        <Process />
        <Trust />
        <Team />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
