import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import RevealWrapper from './RevealWrapper';

const CASES = [
  {
    sector: 'SaaS B2B — Série A',
    title: 'Onboarding client automatisé',
    before: 'Onboarding manuel, 3h par client, erreurs fréquentes dans la configuration.',
    after: 'Workflow automatisé de bout en bout : création compte, configuration, email de bienvenue, suivi.',
    kpis: [
      { value: '÷ 6', label: 'Temps d\'onboarding' },
      { value: '-90%', label: 'Erreurs' },
      { value: '+35%', label: 'Satisfaction client' },
    ],
  },
  {
    sector: 'E-commerce D2C — 80 employés',
    title: 'Support client IA + routage intelligent',
    before: '600+ tickets/jour, temps de réponse moyen 8h, agents surchargés.',
    after: 'IA qui trie, répond aux questions fréquentes et escalade intelligemment.',
    kpis: [
      { value: '÷ 4', label: 'Temps de réponse' },
      { value: '45%', label: 'Tickets résolus par IA' },
      { value: '× 2', label: 'Capacité support' },
    ],
  },
  {
    sector: 'Agence marketing — 30 employés',
    title: 'Pipeline commercial automatisé',
    before: 'Leads manuellement qualifiés, relances oubliées, CRM jamais à jour.',
    after: 'Scoring automatique, séquences personnalisées, CRM synchronisé en temps réel.',
    kpis: [
      { value: '+60%', label: 'Leads qualifiés' },
      { value: '÷ 5', label: 'Temps de réponse lead' },
      { value: '+28%', label: 'Taux de conversion' },
    ],
  },
];

function CaseCard({ c }) {
  return (
    <div className="flex flex-col h-full p-5 rounded-xl border border-border bg-background transition-all duration-300">
      <span className="text-xs font-mono font-medium text-primary uppercase tracking-wider">
        {c.sector}
      </span>
      <h3 className="mt-2 text-lg font-bold text-foreground">{c.title}</h3>

      <div className="mt-4 space-y-3 flex-1">
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Avant</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{c.before}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">Après</p>
          <p className="text-xs text-foreground leading-relaxed">{c.after}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2">
        {c.kpis.map((kpi) => (
          <div key={kpi.label} className="text-center">
            <p className="text-lg font-extrabold text-primary leading-none">{kpi.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1 leading-tight">{kpi.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CaseStudies() {
  const [api, setApi] = useState();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  return (
    <section id="cas-clients" className="py-14 lg:py-20 bg-surface-elevated border-y border-border" aria-label="Cas clients">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealWrapper>
          <div className="max-w-xl">
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
              Résultats concrets, pas des promesses
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Chaque projet commence par un diagnostic précis et se mesure en résultats.
            </p>
          </div>
        </RevealWrapper>

        <RevealWrapper delay={0.05}>
          <div className="mt-8 lg:hidden">
            <Carousel
              setApi={setApi}
              opts={{ align: 'start', loop: true }}
              className="w-full"
            >
              <CarouselContent className="-ml-0">
                {CASES.map((c) => (
                  <CarouselItem key={c.title} className="pl-0">
                    <CaseCard c={c} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {CASES.map((c, index) => (
                  <button
                    key={c.title}
                    type="button"
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Aller au cas ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIndex === index ? 'w-6 bg-primary' : 'w-2 bg-border'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => api?.scrollPrev()}
                  aria-label="Précédent"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border bg-background text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => api?.scrollNext()}
                  aria-label="Suivant"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border bg-background text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </RevealWrapper>

        <div className="hidden lg:grid mt-8 grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
          {CASES.map((c, i) => (
            <RevealWrapper key={c.title} delay={i * 0.1}>
              <CaseCard c={c} />
            </RevealWrapper>
          ))}
        </div>

        <RevealWrapper delay={0.4}>
          <div className="mt-8 text-center">
            <Button asChild className="rounded-full px-7 font-semibold">
              <a href="#contact">
                Discuter de votre projet
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
}
