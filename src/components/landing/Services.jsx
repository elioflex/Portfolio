import React from 'react';
import { ArrowRight, BarChart3, Headphones, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import RevealWrapper from './RevealWrapper';

const SERVICES = [
  {
    icon: BarChart3,
    title: 'Sales Automation',
    href: '/automatisation-crm-hubspot',
    description: 'Qualifiez, relancez et convertissez automatiquement. CRM enrichi, scoring intelligent, séquences personnalisées.',
    results: ['Lead response time ÷ 5', 'Taux de conversion +35%', 'Pipeline toujours à jour'],
  },
  {
    icon: Headphones,
    title: 'Support Automation',
    href: '/automatisation-service-client-shopify',
    description: 'Routage intelligent, réponses assistées par IA, escalades automatiques. Vos clients obtiennent des réponses plus vite.',
    results: ['Temps de résolution ÷ 3', 'Satisfaction client +40%', 'Volume traité × 2'],
  },
  {
    icon: Settings,
    title: 'Back-Office Automation',
    href: '/chatbot-whatsapp-service-client',
    description: 'Éliminez la saisie manuelle, les copier-coller entre outils et les erreurs humaines récurrentes.',
    results: ['12h+ gagnées / semaine', 'Erreurs réduites de 90%', 'Onboarding 2× plus rapide'],
  },
];

export default function Services() {
  return (
    <section id="offres" className="py-20 lg:py-32" aria-label="Nos services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealWrapper>
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Ce qu'on automatise pour nos clients
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Chaque système est conçu sur mesure pour votre stack, vos processus et vos objectifs.
            </p>
          </div>
        </RevealWrapper>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((service, i) => (
            <RevealWrapper key={service.title} delay={i * 0.1}>
              <div className="group relative flex flex-col h-full p-8 rounded-2xl border border-border bg-background hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-6">
                  <service.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-2">
                  {service.results.map(r => (
                    <li key={r} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
                <a
                  href={service.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  onClick={() => trackEvent('service_page_click', { from: 'home_services', service: service.title, href: service.href })}
                >
                  Voir la page dédiée
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </RevealWrapper>
          ))}
        </div>

        <RevealWrapper delay={0.4}>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">
              <span className="font-semibold text-foreground">Notre méthode :</span>{' '}
              Diagnostic 30 min → plan d'exécution 72h → pilote en 2 à 6 semaines.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 font-semibold">
              <a
                href="#contact"
                onClick={() => trackEvent('cta_click', { placement: 'services_section', cta_text: 'book_diagnostic' })}
              >
                Réserver un diagnostic
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
}
