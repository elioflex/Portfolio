import React, { useState } from 'react';
import { TrendingUp, Clock, Users } from 'lucide-react';
import RevealWrapper from './RevealWrapper';

const KPIS = [
  { icon: TrendingUp, value: '3x', label: 'plus rapide en exécution opérationnelle' },
  { icon: Clock, value: '80%', label: 'de tâches manuelles éliminées' },
  { icon: Users, value: '50+', label: 'équipes accompagnées' },
];

const TOOLS = [
  { name: 'Make', logo: 'https://cdn.simpleicons.org/make' },
  { name: 'Zapier', logo: 'https://cdn.simpleicons.org/zapier' },
  { name: 'n8n', logo: 'https://cdn.simpleicons.org/n8n' },
  { name: 'OpenAI', logo: 'https://cdn.simpleicons.org/openai' },
  { name: 'Notion', logo: 'https://cdn.simpleicons.org/notion' },
  { name: 'Airtable', logo: 'https://cdn.simpleicons.org/airtable' },
  { name: 'HubSpot', logo: 'https://cdn.simpleicons.org/hubspot' },
  { name: 'Slack', logo: 'https://cdn.simpleicons.org/slack' },
  { name: 'Pipedrive', logo: 'https://www.google.com/s2/favicons?domain=pipedrive.com&sz=64' },
  { name: 'Typeform', logo: 'https://cdn.simpleicons.org/typeform' },
  { name: 'Monday', logo: 'https://www.google.com/s2/favicons?domain=monday.com&sz=64' },
  { name: 'ActiveCampaign', logo: 'https://www.google.com/s2/favicons?domain=activecampaign.com&sz=64' },
];

export default function SocialProof() {
  const [failedLogos, setFailedLogos] = useState({});
  // Duplicate the tools list for seamless infinite scroll
  const allTools = [...TOOLS, ...TOOLS];

  return (
    <section className="py-20 lg:py-32 border-y border-border bg-surface-elevated" aria-label="Preuves sociales">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {KPIS.map((kpi, i) => (
            <RevealWrapper key={kpi.value} delay={i * 0.1}>
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                  <kpi.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-foreground">{kpi.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>

        {/* Testimonial */}
        <RevealWrapper delay={0.3}>
          <blockquote className="mt-12 max-w-2xl mx-auto text-center">
            <p className="text-lg lg:text-xl text-foreground italic leading-relaxed">
              "En 4 semaines, IdeaToAutomation a automatisé notre onboarding client. On a gagné 12h par semaine et réduit les erreurs de 90%."
            </p>
            <footer className="mt-4 text-sm text-muted-foreground">
              — Directeur Opérations, Casanovalabs
            </footer>
          </blockquote>
        </RevealWrapper>

        {/* Infinite scrolling tools marquee */}
        <RevealWrapper delay={0.4}>
          <div className="mt-12 pt-8 border-t border-border overflow-hidden">
            <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-6">
              Outils que nous intégrons
            </p>
            <div className="relative">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-surface-elevated to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-surface-elevated to-transparent z-10 pointer-events-none" />

              <div
                className="flex gap-12 marquee-track"
                style={{ animation: 'marquee 25s linear infinite', width: 'max-content' }}
              >
                {allTools.map((tool, i) => (
                  <span
                    key={`${tool.name}-${i}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground/70 hover:text-primary transition-colors duration-300 cursor-default whitespace-nowrap"
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-background border border-border/70 p-1">
                      {failedLogos[tool.name] ? (
                        <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none">
                          {tool.name.slice(0, 2)}
                        </span>
                      ) : (
                        <img
                          src={tool.logo}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          decoding="async"
                          onError={() => setFailedLogos((prev) => ({ ...prev, [tool.name]: true }))}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </span>
                    {tool.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
}
