import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import RevealWrapper from './RevealWrapper';

const FOUNDERS = [
  {
    name: 'Amine',
    role: 'Co-fondateur — Software Team Leader R&D',
    bio: 'Architecture logicielle, structuration R&D et pilotage de la qualité technique sur des systèmes critiques.',
    image: '/assets/team/amine.jpeg',
  },
  {
    name: 'Yassine',
    role: 'Co-fondateur — Spécialiste automation',
    bio: 'Conception et industrialisation de workflows métier avec focus ROI, fiabilité opérationnelle et vitesse de mise en production.',
    image: '/assets/team/yassine.png',
  },
];

export default function Team() {
  return (
    <section className="py-20 lg:py-32" aria-label="Équipe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealWrapper>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              L'équipe derrière vos systèmes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Des profils seniors, opérationnels, qui comprennent vos enjeux business.
            </p>
          </div>
        </RevealWrapper>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {FOUNDERS.map((f, i) => (
            <RevealWrapper key={f.name} delay={i * 0.15}>
              <div className="p-8 rounded-2xl border border-border bg-background text-center">
                <img
                  src={f.image}
                  alt={f.name}
                  className="w-20 h-20 mx-auto rounded-full object-cover mb-4 border border-border"
                />
                <h3 className="text-xl font-bold text-foreground">{f.name}</h3>
                <p className="text-sm font-medium text-primary mt-1">{f.role}</p>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{f.bio}</p>
                <div className="mt-6">
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <a
                      href="#contact"
                      onClick={() => trackEvent('cta_click', { placement: 'team_section', cta_text: 'contact_founder' })}
                    >
                      Prendre contact
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
