import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import SocialProof from '../components/landing/SocialProof';
import Services from '../components/landing/Services';
import CaseStudies from '../components/landing/CaseStudies';
import Process from '../components/landing/Process';
import Trust from '../components/landing/Trust';
import Team from '../components/landing/Team';
import FAQ from '../components/landing/FAQ';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <Services />
        <CaseStudies />
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