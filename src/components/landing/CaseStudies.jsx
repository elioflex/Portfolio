import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function CaseStudies() {
  return (
    <section id="cas-clients" className="py-20 lg:py-32 bg-surface-elevated border-y border-border" aria-label="Cas clients">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealWrapper>
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Résultats concrets, pas des promesses
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Chaque projet commence par un diagnostic précis et se mesure en résultats.
            </p>
          </div>
        </RevealWrapper>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {CASES.map((c, i) => (
            <RevealWrapper key={c.title} delay={i * 0.1}>
              <div className="flex flex-col h-full p-8 rounded-2xl border border-border bg-background">
                <span className="text-xs font-mono font-medium text-primary uppercase tracking-wider">
                  {c.sector}
                </span>
                <h3 className="mt-3 text-xl font-bold text-foreground">{c.title}</h3>

                <div className="mt-6 space-y-4 flex-1">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Avant</p>
                    <p className="text-sm text-muted-foreground">{c.before}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Après</p>
                    <p className="text-sm text-foreground">{c.after}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-3">
                  {c.kpis.map(kpi => (
                    <div key={kpi.label} className="text-center">
                      <p className="text-xl font-extrabold text-primary">{kpi.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>

        <RevealWrapper delay={0.4}>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="rounded-full px-8 font-semibold">
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