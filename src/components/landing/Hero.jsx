import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import RevealWrapper from './RevealWrapper';

export default function Hero() {
  const videoRef = useRef(null);

  const applyPlaybackRate = () => {
    if (!videoRef.current) return;
    // Slower background motion for a calmer, more premium hero.
    videoRef.current.playbackRate = 0.78;
  };

  return (
    <section
      className="relative pt-24 pb-14 lg:pt-32 lg:pb-20 overflow-hidden min-h-[88vh] flex items-center"
      aria-label="Introduction"
      style={{
        background: '#ffffff',
      }}
    >
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        defaultMuted
        playsInline
        preload="metadata"
        poster="/media/hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover z-0"
        onLoadedMetadata={applyPlaybackRate}
        onCanPlay={applyPlaybackRate}
        style={{
          // Transparency gradient requested:
          // left = 100% transparent, middle = 80% transparent, right = 0% transparent.
          WebkitMaskImage: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,1) 100%)',
          maskImage: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,1) 100%)',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        <source src="/media/hero-bg.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-500 opacity-0"
        style={{ backgroundImage: "url('/media/hero-poster.jpg')" }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/80 via-white/46 to-white/10" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/8 via-transparent to-white/16" />

      {/* Blue glow accent */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-primary/12 rounded-full blur-3xl z-10 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-3xl relative text-left">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-4 -inset-y-6 sm:-inset-x-6 sm:-inset-y-8 rounded-3xl bg-background/12 backdrop-blur-[4px] border border-white/20"
          />

          <div className="relative z-10">
            <RevealWrapper>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm">
                Agence IA & Automatisation
              </div>
            </RevealWrapper>

            <RevealWrapper delay={0.1}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.02em] leading-[1.05] text-foreground max-w-[20ch]">
                Automatisez vos opérations sans agrandir vos équipes
              </h1>
            </RevealWrapper>

            <RevealWrapper delay={0.2}>
              <p className="mt-5 text-lg lg:text-[1.18rem] text-foreground/78 leading-[1.55] max-w-[62ch]">
                Nous concevons et déployons des workflows IA sur mesure pour réduire le travail manuel,
                accélérer l&apos;exécution commerciale et améliorer la productivité de vos équipes.
              </p>
            </RevealWrapper>

            <RevealWrapper delay={0.4}>
              <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-start">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.03] transition-all duration-300"
                >
                  <a
                    href="/#contact"
                    onClick={() => trackEvent('cta_click', { placement: 'hero_primary', cta_text: 'book_diagnostic' })}
                  >
                    Réserver un diagnostic gratuitement
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-6 font-semibold text-sm text-foreground hover:text-foreground border-border/70 bg-white/55 hover:bg-white/75 hover:border-primary/35"
                >
                  <a
                    href="/#methode"
                    onClick={() => trackEvent('cta_click', { placement: 'hero_secondary', cta_text: 'discover_method' })}
                  >
                    Découvrir la méthode
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="rounded-full border border-border/70 bg-white/60 px-3 py-1">Diagnostic 30 min offert</span>
                <span className="rounded-full border border-border/70 bg-white/60 px-3 py-1">Plan d&apos;exécution en 72h</span>
                <span className="rounded-full border border-border/70 bg-white/60 px-3 py-1">Déploiement en 2 à 6 semaines</span>
              </div>
            </RevealWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}
