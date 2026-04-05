import React from 'react';
import { ArrowRight, Calendar, Clock, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RevealWrapper from './RevealWrapper';

export default function HeroPreview2() {
  return (
    <section
      className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 overflow-hidden min-h-screen flex items-center"
      aria-label="Introduction"
      style={{
        background: 'linear-gradient(135deg, hsl(220,20%,5%) 0%, hsl(225,40%,12%) 50%, hsl(220,20%,7%) 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 10s ease infinite',
      }}
    >
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://www.pexels.com/video/abstract-white-triangles-geometric-background-29460403/download/" type="video/mp4" />
        <source src="https://www.pexels.com/video/29460403/download/" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/52 z-10 pointer-events-none" />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-transparent to-background/85 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/42 via-transparent to-transparent z-10 pointer-events-none" />
      {/* Blue glow accent */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-3xl relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-4 -inset-y-6 sm:-inset-x-6 sm:-inset-y-8 rounded-3xl bg-background/8 backdrop-blur-[2px] border border-white/10"
          />

          <div className="relative z-10">
            <RevealWrapper>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm">
                <Rocket className="w-3.5 h-3.5" />
                IA & Automatisation sur mesure
              </div>
            </RevealWrapper>

            <RevealWrapper delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-foreground">
                Réduisez 80% du travail manuel de vos équipes{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, hsl(225,80%,65%) 0%, hsl(200,90%,70%) 100%)' }}
                >
                  en 6 semaines.
                </span>
              </h1>
            </RevealWrapper>

            <RevealWrapper delay={0.2}>
              <p className="mt-6 text-lg lg:text-xl text-foreground/72 leading-relaxed max-w-2xl">
                Nous concevons et déployons des systèmes d'automatisation sur mesure pour les équipes en croissance.
                Moins d'erreurs, une exécution plus rapide, des résultats mesurables.
              </p>
            </RevealWrapper>

            <RevealWrapper delay={0.3}>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-3 text-sm text-foreground/90">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <span>Diagnostic 30 min offert</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/90">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <span>Plan d'exécution en 72h</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/90">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20">
                    <Rocket className="w-4 h-4 text-primary" />
                  </div>
                  <span>Pilote en 2 à 6 semaines</span>
                </div>
              </div>
            </RevealWrapper>

            <RevealWrapper delay={0.4}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.03] transition-all duration-300"
                >
                  <a href="#contact">
                    Réserver un diagnostic
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 font-semibold text-base border-border/50 backdrop-blur-sm hover:bg-white/10 hover:border-primary/40 hover:scale-[1.03] transition-all duration-300"
                >
                  <a href="#methode">Découvrir la méthode</a>
                </Button>
              </div>
            </RevealWrapper>

            <RevealWrapper delay={0.5}>
              <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span>✓ +50 projets livrés</span>
                <span className="hidden sm:inline text-border">|</span>
                <span>✓ NDA disponible</span>
                <span className="hidden sm:inline text-border">|</span>
                <span>✓ ROI visible en 30 à 90 jours</span>
              </div>
            </RevealWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}
