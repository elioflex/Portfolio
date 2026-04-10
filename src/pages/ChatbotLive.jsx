import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  ChevronLeft,
  Check,
  CheckCheck,
  Circle,
  Home,
  Mail,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video,
  Workflow,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';

const CHAT_THREADS = [
  {
    id: 'new-lead',
    name: 'Nouveau lead - Shopify',
    avatar: '/assets/chatbot-profiles/new-lead.jpg',
    preview: 'Bonjour, est-ce que vous integrez HubSpot ?',
    time: '09:14',
    unread: 2,
    online: true,
  },
  {
    id: 'camille',
    name: 'Camille Martin',
    avatar: '/assets/chatbot-profiles/camille.jpg',
    preview: 'Merci !',
    time: 'Maintenant',
    unread: 1,
    online: true,
  },
  {
    id: 'sav-return',
    name: 'SAV Retours',
    avatar: '/assets/chatbot-profiles/sav-return.jpg',
    preview: 'Le ticket #2914 a ete route vers Support A',
    time: '08:57',
    unread: 0,
    online: false,
  },
  {
    id: 'vip-client',
    name: 'Client VIP - Julie B.',
    avatar: '/assets/chatbot-profiles/vip-client.jpg',
    preview: 'Pouvez-vous prioriser ma demande ?',
    time: 'Hier',
    unread: 0,
    online: false,
  },
  {
    id: 'crm-sync',
    name: 'CRM Automations',
    avatar: '/assets/chatbot-profiles/crm-sync.jpg',
    preview: 'Deal stage updated: Qualified',
    time: 'Hier',
    unread: 0,
    online: false,
  },
];

const THREAD_SCENARIOS = {
  'new-lead': {
    caseLabel: 'Cas 1 - Qualification lead',
    status: 'Prospect actif - qualification IA',
    script: [
      {
        role: 'customer',
        text: 'Bonjour, je veux automatiser mes leads Shopify vers HubSpot. Vous faites ca ?',
        time: '09:14',
        delay: 1100,
      },
      {
        role: 'assistant',
        text: 'Oui. On peut capter, qualifier, scorer et router vos leads automatiquement.',
        time: '09:14',
        delay: 1300,
      },
      {
        role: 'assistant',
        text: 'Quel volume de leads par semaine et votre objectif principal ?',
        time: '09:14',
        delay: 1200,
      },
      {
        role: 'customer',
        text: 'Environ 220 leads/semaine. Je veux repondre plus vite et augmenter les calls bookes.',
        time: '09:15',
        delay: 1300,
      },
      {
        role: 'assistant',
        text: 'Parfait. Votre lead est score "High Intent". Je vous propose un diagnostic de 30 min.',
        time: '09:15',
        delay: 1200,
      },
      {
        role: 'system',
        text: 'CRM sync: source=shopify_form | score=88 | owner=sales | next_action=book_call',
        time: '09:15',
        delay: 1000,
      },
      {
        role: 'assistant',
        text: 'Je peux vous envoyer 2 creneaux pour lancer votre plan en 72h. Vous preferez mardi ou mercredi ?',
        time: '09:15',
        delay: 1200,
      },
    ],
    metrics: {
      idle: { response: '6m 18s', resolved: '0%', score: '--' },
      progress: { response: '19s', resolved: '58%', score: '78/100' },
      done: { response: '3.1s', resolved: '81%', score: '88/100' },
    },
  },
  camille: {
    caseLabel: 'Cas 2 - Suivi commande + retour',
    status: 'Client e-commerce - support actif',
    script: [
      {
        role: 'customer',
        text: 'Bonjour, je veux savoir ou en est ma commande BR-4921 et si vous avez le meme produit en M.',
        time: '10:21',
        delay: 1200,
      },
      {
        role: 'assistant',
        text: 'Bonjour Camille. Votre commande BR-4921 est en transit et livree demain avant 18h.',
        time: '10:21',
        delay: 1300,
      },
      {
        role: 'assistant',
        text: 'Pour la taille M: disponible en stock. Je peux vous reserver le panier en 1 clic.',
        time: '10:21',
        delay: 1200,
      },
      {
        role: 'customer',
        text: 'Parfait. Et je veux aussi prioriser un retour sur un autre article.',
        time: '10:22',
        delay: 1300,
      },
      {
        role: 'assistant',
        text: 'Demande retour recue. Je la classe en priorite haute et je notifie le support.',
        time: '10:22',
        delay: 1200,
      },
      {
        role: 'system',
        text: 'CRM sync: intent=returns | priority=high | owner=support-team-a | SLA=4h',
        time: '10:22',
        delay: 1000,
      },
      {
        role: 'assistant',
        text: 'Souhaitez-vous parler a un agent humain maintenant ou continuer ici ?',
        time: '10:22',
        delay: 1200,
      },
    ],
    metrics: {
      idle: { response: '8m 42s', resolved: '0%', score: '--' },
      progress: { response: '14s', resolved: '62%', score: '74/100' },
      done: { response: '2.6s', resolved: '79%', score: '88/100' },
    },
  },
  'sav-return': {
    caseLabel: 'Cas 3 - SAV remboursement',
    status: 'Support back-office automatise',
    script: [
      {
        role: 'customer',
        text: 'Je veux un remboursement, ma commande est arrivee abimee.',
        time: '08:57',
        delay: 1100,
      },
      {
        role: 'assistant',
        text: 'Je suis desole pour cela. Je cree votre dossier SAV prioritaire tout de suite.',
        time: '08:57',
        delay: 1300,
      },
      {
        role: 'assistant',
        text: 'Pouvez-vous envoyer une photo du produit pour valider instantanement le retour ?',
        time: '08:57',
        delay: 1200,
      },
      {
        role: 'customer',
        text: 'Oui, photo envoyee. Merci de confirmer le delai de remboursement.',
        time: '08:58',
        delay: 1300,
      },
      {
        role: 'assistant',
        text: 'Photo validee. Votre remboursement est declenche, confirmation sous 24h.',
        time: '08:58',
        delay: 1100,
      },
      {
        role: 'system',
        text: 'Ticket #2914 -> status=validated_return | refund=queued | owner=finance_ops',
        time: '08:58',
        delay: 1000,
      },
      {
        role: 'assistant',
        text: 'Je vous envoie aussi le lien de suivi SAV dans cette conversation.',
        time: '08:58',
        delay: 1200,
      },
    ],
    metrics: {
      idle: { response: '11m 03s', resolved: '0%', score: '--' },
      progress: { response: '17s', resolved: '54%', score: '69/100' },
      done: { response: '3.8s', resolved: '76%', score: '84/100' },
    },
  },
  'vip-client': {
    caseLabel: 'Cas 4 - Client VIP',
    status: 'Escalade premium active',
    script: [
      {
        role: 'customer',
        text: 'Je suis cliente VIP. J ai besoin d un traitement prioritaire pour ma commande cadeau.',
        time: '11:06',
        delay: 1100,
      },
      {
        role: 'assistant',
        text: 'Bien recu Julie. Votre statut VIP est reconnu, je passe votre demande en priorite maximale.',
        time: '11:06',
        delay: 1300,
      },
      {
        role: 'assistant',
        text: 'Souhaitez-vous une livraison express ou un retrait boutique ?',
        time: '11:06',
        delay: 1200,
      },
      {
        role: 'customer',
        text: 'Livraison express, avant vendredi idealement.',
        time: '11:07',
        delay: 1300,
      },
      {
        role: 'assistant',
        text: 'Cest note. Je reserve un slot express et je notifie un agent senior.',
        time: '11:07',
        delay: 1100,
      },
      {
        role: 'system',
        text: 'VIP route: priority=critical | owner=senior_support | sla=1h | shipping=express',
        time: '11:07',
        delay: 1000,
      },
      {
        role: 'assistant',
        text: 'Votre prise en charge est confirmee. Je reste disponible si vous souhaitez un suivi proactif.',
        time: '11:07',
        delay: 1200,
      },
    ],
    metrics: {
      idle: { response: '7m 55s', resolved: '0%', score: '--' },
      progress: { response: '11s', resolved: '65%', score: '82/100' },
      done: { response: '2.1s', resolved: '86%', score: '93/100' },
    },
  },
  'crm-sync': {
    caseLabel: 'Cas 5 - Sync CRM & sales',
    status: 'Automatisation sales operationnelle',
    script: [
      {
        role: 'customer',
        text: 'On perd des leads entre WhatsApp et HubSpot. Vous pouvez automatiser ca ?',
        time: '15:44',
        delay: 1100,
      },
      {
        role: 'assistant',
        text: 'Oui. On peut synchroniser les messages, le score IA et le statut des deals en temps reel.',
        time: '15:44',
        delay: 1300,
      },
      {
        role: 'assistant',
        text: 'Je peux aussi declencher automatiquement les relances et reminders commerciaux.',
        time: '15:44',
        delay: 1200,
      },
      {
        role: 'customer',
        text: 'Top. Aujourd hui on traite 180 leads/semaine et notre equipe oublie des follow-ups.',
        time: '15:45',
        delay: 1300,
      },
      {
        role: 'assistant',
        text: 'Dans ce cas, je recommande une sequence en 3 etapes + scoring prioritaire des leads chauds.',
        time: '15:45',
        delay: 1200,
      },
      {
        role: 'system',
        text: 'HubSpot sync: lead_score=high | stage=qualified | follow_up=J+1 | owner=sales_ae_2',
        time: '15:45',
        delay: 1000,
      },
      {
        role: 'assistant',
        text: 'Je peux vous montrer un plan executable en 72h, puis un pilote complet en 2-6 semaines.',
        time: '15:45',
        delay: 1200,
      },
    ],
    metrics: {
      idle: { response: '9m 11s', resolved: '0%', score: '--' },
      progress: { response: '16s', resolved: '57%', score: '76/100' },
      done: { response: '2.9s', resolved: '82%', score: '90/100' },
    },
  },
};

const PIPELINE_STEPS = [
  'Message client recu',
  'Analyse intention + sentiment',
  'Scoring et priorite',
  'Routage + CRM sync',
];

function getPipelineStage(visibleCount) {
  if (visibleCount <= 0) return -1;
  if (visibleCount <= 2) return 0;
  if (visibleCount <= 4) return 1;
  if (visibleCount <= 6) return 2;
  return 3;
}

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function ProfileAvatar({ avatar, name, className }) {
  const [hasError, setHasError] = useState(false);

  if (!avatar || hasError) {
    return (
      <div className={`${className} rounded-full bg-[#2a3942] text-slate-100 text-xs font-semibold grid place-items-center`}>
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={avatar}
      alt={`Photo de profil ${name}`}
      loading="lazy"
      onError={() => setHasError(true)}
      className={`${className} rounded-full object-cover`}
    />
  );
}

export default function ChatbotLive() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isRestarting, setIsRestarting] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState('camille');
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const chatBodyRef = useRef(null);

  const activeThread = useMemo(
    () => CHAT_THREADS.find((thread) => thread.id === activeThreadId) || CHAT_THREADS[0],
    [activeThreadId],
  );

  const activeScenario = THREAD_SCENARIOS[activeThreadId] || THREAD_SCENARIOS.camille;
  const activeScript = activeScenario.script;

  useEffect(() => {
    const oldTitle = document.title;
    document.title = 'WhatsApp AI Demo - IdeaToAutomation';
    return () => {
      document.title = oldTitle;
    };
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [visibleCount, activeThreadId]);

  useEffect(() => {
    let timeout;

    if (visibleCount < activeScript.length) {
      const delay = activeScript[visibleCount]?.delay || 1200;
      timeout = window.setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, delay);
      return () => window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(() => {
      setVisibleCount(0);
      setLoopCount((prev) => prev + 1);
      setIsRestarting(false);
    }, 2400);

    return () => window.clearTimeout(timeout);
  }, [visibleCount, activeScript]);

  const displayedMessages = activeScript.slice(0, visibleCount);
  const activeStage = getPipelineStage(visibleCount);
  const cycleCompleted = visibleCount >= activeScript.length;

  const activeThreadPreview = useMemo(() => {
    const latest = [...displayedMessages].reverse().find((message) => message.role !== 'system');
    if (!latest) return activeThread.preview;
    return latest.text;
  }, [displayedMessages, activeThread.preview]);

  const metrics = useMemo(() => {
    if (activeStage < 0) return activeScenario.metrics.idle;
    if (!cycleCompleted) return activeScenario.metrics.progress;
    return activeScenario.metrics.done;
  }, [activeScenario.metrics, activeStage, cycleCompleted]);

  const restartAnimation = () => {
    setIsRestarting(true);
    setVisibleCount(0);
    trackEvent('chatbot_live_restart', { page: 'chatbot-live', loop_count: loopCount, case_id: activeThreadId });
  };

  const handleThreadSwitch = (threadId) => {
    if (threadId === activeThreadId) {
      setIsMobileChatOpen(true);
      return;
    }
    setActiveThreadId(threadId);
    setIsMobileChatOpen(true);
    setVisibleCount(0);
    setIsRestarting(false);
    trackEvent('chatbot_live_thread_switch', { page: 'chatbot-live', case_id: threadId });
  };

  const closeMobileChat = () => {
    setIsMobileChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a1014] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a1014]/85 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2 font-semibold" aria-label="IdeaToAutomation accueil">
            <img src="/assets/logo/logo-primary-light.svg" alt="IdeaToAutomation" className="h-8 w-auto" />
          </a>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-full border-white/20 text-slate-200 hover:bg-white/10">
              <a href="/">
                <Home className="w-4 h-4" />
                Accueil
              </a>
            </Button>
            <Button asChild size="sm" className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#062115]">
              <a href="mailto:contact@ideatoautomation.com">
                <Mail className="w-4 h-4" />
                Contact
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e1b25] via-[#0e1720] to-[#13271f] p-7 lg:p-9">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-200">
                <Bot className="w-4 h-4" />
                WhatsApp-Style AI Demo
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                UI realiste: liste des chats cliquables + scenarios IA multi-cas.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl">
                Chaque conversation correspond a un cas concret: qualification lead, suivi commande, SAV, VIP, sync CRM.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  onClick={restartAnimation}
                  disabled={isRestarting && visibleCount === 0}
                  className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#062115] font-semibold"
                >
                  Relancer animation
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/20 text-slate-200 hover:bg-white/10">
                  <a href="/projects">
                    <Workflow className="w-4 h-4" />
                    Voir toutes les demos
                  </a>
                </Button>
              </div>
            </div>
          </section>

          <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111b21] shadow-[0_30px_80px_rgba(0,0,0,.45)]">
            <div className="min-h-[640px] lg:grid lg:grid-cols-[330px_1fr]">
              <aside className={`${isMobileChatOpen ? 'hidden' : 'block'} lg:block border-r border-white/10 bg-[#111b21]`}>
                <div className="h-16 px-4 border-b border-white/10 bg-[#075e54] lg:bg-[#202c33] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-[#022014] text-xs font-bold grid place-items-center">
                      IA
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-100">IdeaToAutomation Bot</p>
                      <p className="text-xs text-slate-400">Production simulation</p>
                    </div>
                  </div>
                  <MoreVertical className="w-4 h-4 text-slate-300" />
                </div>

                <div className="p-3 border-b border-white/10 bg-[#111b21]">
                  <div className="flex items-center gap-2 rounded-lg bg-[#202c33] px-3 py-2 text-slate-300">
                    <Search className="w-4 h-4" />
                    <span className="text-sm">Rechercher ou demarrer un chat</span>
                  </div>
                </div>

                <div className="overflow-auto max-h-[560px]">
                  {CHAT_THREADS.map((thread) => {
                    const isActive = thread.id === activeThreadId;
                    const preview = isActive ? activeThreadPreview : thread.preview;
                    return (
                      <button
                        key={thread.id}
                        type="button"
                        onClick={() => handleThreadSwitch(thread.id)}
                        className={`w-full px-3 py-3 border-b border-white/5 text-left transition-colors ${
                          isActive ? 'bg-[#2a3942]' : 'bg-transparent hover:bg-[#202c33]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative shrink-0">
                            <ProfileAvatar avatar={thread.avatar} name={thread.name} className="w-11 h-11" />
                            {thread.online ? (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#2a3942]" />
                            ) : null}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-slate-100 truncate">{thread.name}</p>
                              <span className="text-[11px] text-slate-400 shrink-0">{thread.time}</span>
                            </div>
                            <div className="mt-0.5 flex items-center gap-2">
                              <p className="text-xs text-slate-400 truncate">{preview}</p>
                              {thread.unread > 0 ? (
                                <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1.5 text-[11px] font-bold text-[#062115]">
                                  {thread.unread}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <div className={`${isMobileChatOpen ? 'flex' : 'hidden'} lg:flex flex-col min-h-[640px] bg-[#0b141a]`}>
                <div className="h-16 px-4 border-b border-white/10 bg-[#075e54] lg:bg-[#202c33] flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={closeMobileChat}
                      aria-label="Retour conversations"
                      className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-100/90 hover:bg-white/10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <ProfileAvatar avatar={activeThread.avatar} name={activeThread.name} className="w-10 h-10" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-100 truncate">{activeThread.name}</p>
                      <p className="text-xs text-emerald-300 inline-flex items-center gap-1">
                        <Circle className="w-2 h-2 fill-current" />
                        {activeScenario.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <Video className="w-4 h-4" />
                    <Phone className="w-4 h-4" />
                    <MoreVertical className="w-4 h-4" />
                  </div>
                </div>

                <div
                  ref={chatBodyRef}
                  className="flex-1 overflow-auto px-4 py-5 space-y-2"
                  style={{
                    backgroundColor: '#0b141a',
                    backgroundImage:
                      'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)',
                    backgroundPosition: '0 0, 10px 10px',
                    backgroundSize: '20px 20px',
                  }}
                >
                  <div className="flex justify-center">
                    <div className="rounded-md bg-[#1f2c34] border border-white/10 px-3 py-1 text-[11px] text-slate-300">
                      {activeScenario.caseLabel}
                    </div>
                  </div>

                  {displayedMessages.map((message, index) => {
                    if (message.role === 'system') {
                      return (
                        <div key={`sys-${index}`} className="flex justify-center">
                          <div className="rounded-md bg-[#1f2c34] border border-emerald-300/20 px-3 py-1.5 text-[11px] text-emerald-200 font-mono">
                            {message.text}
                          </div>
                        </div>
                      );
                    }

                    const outgoing = message.role === 'assistant';

                    return (
                      <div key={`${message.role}-${index}`} className={`flex ${outgoing ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 shadow-sm ${
                            outgoing ? 'bg-[#005c4b] text-white' : 'bg-[#202c33] text-slate-100'
                          }`}
                        >
                          <p className="text-[14px] leading-relaxed">{message.text}</p>
                          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-white/70">
                            <span>{message.time}</span>
                            {outgoing ? <CheckCheck className="w-3 h-3 text-[#53bdeb]" /> : <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {!cycleCompleted && visibleCount > 0 ? (
                    <div className="flex justify-end">
                      <div className="rounded-lg bg-[#005c4b] text-white px-3 py-2 inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse [animation-delay:180ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse [animation-delay:360ms]" />
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="border-t border-white/10 bg-[#202c33] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Smile className="w-5 h-5 text-slate-300" />
                    <Paperclip className="w-5 h-5 text-slate-300" />
                    <div className="flex-1 rounded-lg bg-[#2a3942] px-3 py-2 text-sm text-slate-400">
                      Ecrire un message...
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500 text-[#062115]"
                      aria-label="Envoyer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                    <Mic className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {PIPELINE_STEPS.map((step, idx) => {
              const done = activeStage > idx;
              const active = activeStage === idx;
              return (
                <div
                  key={step}
                  className={`rounded-xl border px-3 py-2 text-xs transition-colors ${
                    active
                      ? 'border-emerald-300/50 bg-emerald-300/10 text-emerald-200'
                      : done
                      ? 'border-emerald-300/30 bg-emerald-300/5 text-slate-100'
                      : 'border-white/10 bg-[#111b21] text-slate-400'
                  }`}
                >
                  {step}
                </div>
              );
            })}

            <div className="rounded-xl border border-white/10 bg-[#111b21] px-3 py-2 text-xs text-slate-300 sm:col-span-3 lg:col-span-2">
              <p className="font-semibold text-slate-100">KPI live</p>
              <p className="mt-1">
                Temps reponse: <span className="text-emerald-300 font-semibold">{metrics.response}</span>
              </p>
              <p>
                Auto-resolution: <span className="text-emerald-300 font-semibold">{metrics.resolved}</span>
              </p>
              <p>
                Lead score: <span className="text-emerald-300 font-semibold">{metrics.score}</span>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
