import React from 'react';
import { Phone, FileSearch, Rocket } from 'lucide-react';
import RevealWrapper from './RevealWrapper';

const STEPS = [
  {
    icon: Phone,
    step: '01',
    title: 'Appel diagnostic',
    description: '30 minutes pour comprendre vos processus, identifier les goulots d\'étranglement et valider le potentiel d\'automatisation.',
  },
  {
    icon: FileSearch,
    step: '02',
    title: 'Audit + plan d\'exécution',
    description: 'En 72h, vous recevez un plan détaillé : processus ciblés, outils recommandés, timeline, ROI estimé.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Lancement du pilote',
    description: 'En 2 à 6 semaines, le premier système est déployé, testé et optimisé. Résultats mesurables dès le jour 1.',
  },
];

export default function Process() {
  return (
    <section id="methode" className="py-20 lg:py-32" aria-label="Notre méthode">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealWrapper>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Une méthode éprouvée, des résultats rapides
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Du diagnostic au déploiement, chaque étape est conçue pour minimiser le risque et maximiser l'impact.
            </p>
          </div>
        </RevealWrapper>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {STEPS.map((s, i) => (
            <RevealWrapper key={s.step} delay={i * 0.15}>
              <div className="relative text-center">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-border" />
                )}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 relative">
                  <s.icon className="w-7 h-7 text-primary" />
                  <span className="absolute -top-2 -right-2 text-xs font-mono font-bold text-primary bg-background border border-border rounded-full w-7 h-7 flex items-center justify-center">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {s.description}
                </p>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}