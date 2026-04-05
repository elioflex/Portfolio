import React from 'react';
import { Shield, Lock, Eye, CheckCircle } from 'lucide-react';
import RevealWrapper from './RevealWrapper';

const GUARANTEES = [
  {
    icon: Lock,
    title: 'NDA systématique',
    description: 'Chaque projet est couvert par un accord de confidentialité. Vos données et processus restent protégés.',
  },
  {
    icon: Shield,
    title: 'Sécurité & conformité',
    description: 'Infrastructure sécurisée, bonnes pratiques RGPD, audit de sécurité sur chaque intégration.',
  },
  {
    icon: Eye,
    title: 'Gouvernance transparente',
    description: 'Accès complet à la documentation, aux workflows et au code. Aucune dépendance cachée.',
  },
  {
    icon: CheckCircle,
    title: 'Engagement de résultat',
    description: 'ROI mesurable en 30 à 90 jours. Si les objectifs ne sont pas atteints, nous ajustons sans surcoût.',
  },
];

export default function Trust() {
  return (
    <section className="py-20 lg:py-32 bg-surface-dark text-surface-dark-foreground" aria-label="Garanties">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealWrapper>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              Vos garanties
            </h2>
            <p className="mt-4 text-lg opacity-70">
              Nous ne demandons pas de confiance aveugle. Chaque engagement est concret et vérifiable.
            </p>
          </div>
        </RevealWrapper>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GUARANTEES.map((g, i) => (
            <RevealWrapper key={g.title} delay={i * 0.1}>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 mb-4">
                  <g.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold">{g.title}</h3>
                <p className="mt-2 text-sm opacity-70 leading-relaxed">{g.description}</p>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}