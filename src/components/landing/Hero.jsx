import React, { useEffect, useState } from 'react';
import { ArrowRight, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import RevealWrapper from './RevealWrapper';

export default function Hero() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    setSaveData(Boolean(connection?.saveData));
  }, []);

  const showVideo = !reduceMotion && !saveData && !videoFailed;

  return (
    <section
      className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 overflow-hidden min-h-screen flex items-center"
      aria-label="Introduction"
      style={{
        background: '#ffffff',
      }}
    >
      {/* Video background */}
      {showVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/media/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={() => setVideoFailed(true)}
          onStalled={() => setVideoFailed(true)}
          style={{
            WebkitMaskImage: 'linear-gradient(90deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.85) 46%, rgba(0,0,0,1) 100%)',
            maskImage: 'linear-gradient(90deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.85) 46%, rgba(0,0,0,1) 100%)',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        >
          <source src="/media/hero-bg.mp4" type="video/mp4" />
        </video>
      )}

      <div
        className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-500 ${showVideo ? 'opacity-15' : 'opacity-45'}`}
        style={{ backgroundImage: "url('/media/hero-poster.jpg')" }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/92 via-white/78 to-white/24" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/18 via-transparent to-white/44" />

      {/* Blue glow accent */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-primary/12 rounded-full blur-3xl z-10 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-3xl relative text-left">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-4 -inset-y-6 sm:-inset-x-6 sm:-inset-y-8 rounded-3xl bg-background/8 backdrop-blur-[2px] border border-white/10"
          />

          <div className="relative z-10">
            <RevealWrapper>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm">
                <Rocket className="w-3.5 h-3.5" />
                Agence IA & n8n pour PME B2B
              </div>
            </RevealWrapper>

            <RevealWrapper delay={0.1}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.02em] leading-[1.05] text-foreground max-w-[20ch]">
                Automatisez vos opérations sans agrandir vos équipes.
              </h1>
            </RevealWrapper>

            <RevealWrapper delay={0.2}>
              <p className="mt-6 text-lg lg:text-[1.22rem] text-foreground/78 leading-[1.55] max-w-[62ch]">
                Nous concevons et déployons des workflows IA sur mesure pour réduire le travail manuel,
                accélérer l&apos;exécution commerciale et améliorer la productivité de vos équipes.
              </p>
            </RevealWrapper>

            <RevealWrapper delay={0.4}>
              <div className="mt-9 flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-start">
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
                <a
                  href="/#methode"
                  className="inline-flex items-center text-sm font-semibold text-foreground/80 hover:text-primary transition-colors"
                  onClick={() => trackEvent('cta_click', { placement: 'hero_secondary', cta_text: 'discover_method' })}
                >
                  Voir la méthode complète
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Diagnostic 30 min offert • Plan en 72h • Pilote en 2 à 6 semaines
              </p>
            </RevealWrapper>

            <RevealWrapper delay={0.5}>
              <div className="mt-10 flex flex-wrap items-center justify-start gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span>+50 projets livrés</span>
                <span className="hidden sm:inline text-border">|</span>
                <span>Intégrations n8n, CRM et Slack</span>
                <span className="hidden sm:inline text-border">|</span>
                <span>Accompagnement en français</span>
              </div>
            </RevealWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}
