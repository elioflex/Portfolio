import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Cpu,
  Gauge,
  Home,
  Mail,
  MessageSquare,
  Workflow,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';

const SCRIPT = [
  {
    role: 'user',
    text: "Bonjour, je veux savoir ou en est ma commande et si vous avez le meme produit en M.",
  },
  {
    role: 'bot',
    text: 'Bonjour Camille. Je retrouve votre commande BR-4921. Elle est en transit et livree demain.',
  },
  {
    role: 'bot',
    text: 'Pour la taille M: disponible en stock. Je peux vous reserver le panier en 1 clic.',
  },
  {
    role: 'user',
    text: 'Oui, et pouvez-vous prioriser ma demande retour pour un autre article ?',
  },
  {
    role: 'bot',
    text: 'Cest fait. Votre demande retour est classee priorite haute et transmise au support.',
  },
  {
    role: 'system',
    text: 'CRM mis a jour: intent=returns, sentiment=neutral, priority=high, owner=support-team-a',
  },
  {
    role: 'bot',
    text: 'Souhaitez-vous parler a un agent humain maintenant ou continuer ici ?',
  },
];

const PIPELINE_STEPS = [
  {
    title: 'Message recu',
    detail: 'Ingestion du message client multicanal',
  },
  {
    title: 'Analyse IA',
    detail: 'Intent, sentiment et contexte commande',
  },
  {
    title: 'Scoring et priorite',
    detail: 'Urgence + routage vers la bonne equipe',
  },
  {
    title: 'Action ops',
    detail: 'Sync CRM + notification + reponse',
  },
];

function getPipelineIndex(visibleCount) {
  if (visibleCount <= 0) return -1;
  if (visibleCount <= 2) return 0;
  if (visibleCount <= 4) return 1;
  if (visibleCount <= 6) return 2;
  return 3;
}

export default function ChatbotLive() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isRestarting, setIsRestarting] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const oldTitle = document.title;
    document.title = 'AI Chatbot Live - IdeaToAutomation';
    return () => {
      document.title = oldTitle;
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleCount]);

  useEffect(() => {
    let timeout;

    if (visibleCount < SCRIPT.length) {
      timeout = window.setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, 1200);
      return () => window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(() => {
      setVisibleCount(0);
      setIsRestarting(false);
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [visibleCount]);

  const displayedMessages = SCRIPT.slice(0, visibleCount);
  const activePipeline = getPipelineIndex(visibleCount);
  const cycleCompleted = visibleCount >= SCRIPT.length;

  const metrics = useMemo(() => {
    if (activePipeline < 0) {
      return {
        responseTime: '8m 42s',
        autoResolution: '0%',
        leadScore: '--',
      };
    }

    if (!cycleCompleted) {
      return {
        responseTime: '12s',
        autoResolution: '61%',
        leadScore: '74/100',
      };
    }

    return {
      responseTime: '2.3s',
      autoResolution: '78%',
      leadScore: '86/100',
    };
  }, [activePipeline, cycleCompleted]);

  const restartAnimation = () => {
    setIsRestarting(true);
    setVisibleCount(0);
    trackEvent('chatbot_live_restart', { page: 'chatbot-live' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2 font-semibold" aria-label="IdeaToAutomation accueil">
            <img src="/assets/logo/logo-primary-light.svg" alt="IdeaToAutomation" className="h-8 w-auto" />
          </a>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <a href="/">
                <Home className="w-4 h-4" />
                Accueil
              </a>
            </Button>
            <Button asChild size="sm" className="rounded-full">
              <a href="mailto:contact@ideatoautomation.com">
                <Mail className="w-4 h-4" />
                Contact
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-3xl border border-border bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,.12),transparent_40%),radial-gradient(circle_at_left,rgba(16,185,129,.08),transparent_35%)] p-8 lg:p-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium">
                <Bot className="w-4 h-4" />
                Live AI Chatbot Simulation
              </div>
              <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Montrez en direct comment votre chatbot IA prend une decision business.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl">
                Cette page simule un flux reel: message client, analyse IA, priorisation, puis action operationnelle et sync CRM.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button onClick={restartAnimation} className="rounded-full" disabled={isRestarting && visibleCount === 0}>
                  Relancer animation
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <a href="/projects">
                    <Workflow className="w-4 h-4" />
                    Voir toutes les demos
                  </a>
                </Button>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-5">
            <Card className="xl:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Conversation en temps reel
                </CardTitle>
                <CardDescription>
                  Simulation bouclee d'une interaction client ecommerce avec qualification et actions automatiques.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  ref={containerRef}
                  className="h-[420px] overflow-auto rounded-xl border border-border bg-surface-elevated/70 p-4 space-y-3"
                >
                  {displayedMessages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : message.role === 'system'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs'
                            : 'bg-background text-foreground border border-border'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}

                  {!cycleCompleted && visibleCount > 0 ? (
                    <div className="flex justify-start">
                      <div className="rounded-2xl border border-border bg-background px-3 py-2 inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-pulse [animation-delay:180ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-pulse [animation-delay:360ms]" />
                      </div>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  Pipeline de decision
                </CardTitle>
                <CardDescription>
                  Chaque etape se met a jour automatiquement pendant la simulation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {PIPELINE_STEPS.map((step, index) => {
                    const isDone = activePipeline > index;
                    const isActive = activePipeline === index;
                    return (
                      <div
                        key={step.title}
                        className={`rounded-lg border p-3 transition-all ${
                          isActive
                            ? 'border-primary bg-primary/5'
                            : isDone
                            ? 'border-emerald-300 bg-emerald-50/60'
                            : 'border-border bg-background'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold">{step.title}</p>
                          {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : null}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{step.detail}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-xl border border-border bg-surface-elevated p-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">KPI simulation</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-background border border-border p-2 text-center">
                      <p className="text-xs text-muted-foreground">Temps reponse</p>
                      <p className="text-sm font-bold">{metrics.responseTime}</p>
                    </div>
                    <div className="rounded-lg bg-background border border-border p-2 text-center">
                      <p className="text-xs text-muted-foreground">Auto-resolu</p>
                      <p className="text-sm font-bold">{metrics.autoResolution}</p>
                    </div>
                    <div className="rounded-lg bg-background border border-border p-2 text-center">
                      <p className="text-xs text-muted-foreground">Lead score</p>
                      <p className="text-sm font-bold">{metrics.leadScore}</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 border border-primary/25 bg-primary/10 text-primary text-xs font-medium">
                    <Gauge className="w-3.5 h-3.5" />
                    Production-ready visual demo
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
