import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle2, Home, Mail, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import { applySeo } from '@/lib/seo';

export default function ServicePageTemplate({
  slug,
  metaTitle,
  metaDescription,
  eyebrow,
  title,
  subtitle,
  outcomes,
  stack,
  painPoints,
  deliverables,
  timeline,
}) {
  useEffect(() => {
    applySeo({
      title: metaTitle,
      description: metaDescription,
      path: `/${slug}`,
    });
  }, [metaDescription, metaTitle, slug]);

  return (
    <div className="min-h-screen bg-[#081018] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#081018]/85 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2" aria-label="IdeaToAutomation accueil">
            <img src="/assets/logo/logo-primary-light.svg" alt="IdeaToAutomation" className="h-8 w-auto" />
          </a>
          <Button asChild size="sm" variant="outline" className="rounded-full border-white/20 text-slate-200 hover:bg-white/10">
            <a href="/">
              <Home className="w-4 h-4" />
              Accueil
            </a>
          </Button>
        </div>
      </header>

      <main className="py-10 lg:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e1b25] via-[#0e1720] to-[#123027] p-8 lg:p-10">
            <div className="inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-200">
              {eyebrow}
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-base sm:text-lg text-slate-300">
              {subtitle}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {outcomes.map((outcome) => (
                <div key={outcome} className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 px-4 py-3 text-sm text-emerald-100">
                  {outcome}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#05211b] font-semibold">
                <a
                  href="/#contact"
                  onClick={() =>
                    trackEvent('cta_click', {
                      placement: `seo_${slug}`,
                      cta_text: 'book_diagnostic',
                    })
                  }
                >
                  Réserver un diagnostic
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/20 text-slate-200 hover:bg-white/10">
                <a href="/projects">
                  <Workflow className="w-4 h-4" />
                  Voir les démos
                </a>
              </Button>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-[#0f1a25] p-6">
              <h2 className="text-xl font-bold text-white">Problèmes traités</h2>
              <ul className="mt-4 space-y-3">
                {painPoints.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-300 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-white/10 bg-[#0f1a25] p-6">
              <h2 className="text-xl font-bold text-white">Ce qu'on déploie</h2>
              <ul className="mt-4 space-y-3">
                {deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-300 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <article className="rounded-2xl border border-white/10 bg-[#0f1a25] p-6">
              <h2 className="text-xl font-bold text-white">Stack intégrée</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {stack.map((tool) => (
                  <span key={tool} className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                    {tool}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-300">
                Intégration orientée ROI: flux testés, monitoring, handover et documentation opérationnelle.
              </p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-[#0f1a25] p-6">
              <h2 className="text-xl font-bold text-white">Timeline</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {timeline.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-300 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#0f1a25] to-[#123027] p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white">Besoin d'un plan clair en 72h ?</h2>
            <p className="mt-2 text-slate-300 max-w-2xl">
              Envoyez votre stack actuelle et votre principal blocage. Vous recevez une proposition concrète: architecture,
              quick wins et feuille de route de déploiement.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#05211b] font-semibold">
                <a href="/#contact">
                  Réserver un diagnostic
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/20 text-slate-200 hover:bg-white/10">
                <a href="mailto:contact@ideatoautomation.com">
                  <Mail className="w-4 h-4" />
                  contact@ideatoautomation.com
                </a>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
