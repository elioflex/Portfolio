import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Cpu,
  Home,
  Mail,
  Send,
  ShoppingCart,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';

const PROJECTS = [
  {
    id: 'chatbot',
    title: 'AI Website Chatbot',
    status: 'Live Demo',
    stack: 'React, n8n Webhook, CRM',
    outcome: 'Conversation live, qualification lead, payload webhook pret production.',
  },
  {
    id: 'support',
    title: 'Support Triage Agent',
    status: 'Live Demo',
    stack: 'React, n8n Webhook, Support Ops',
    outcome: 'Analyse ticket, priorisation, routage et reponse suggeree en temps reel.',
  },
  {
    id: 'recovery',
    title: 'Revenue Recovery Agent',
    status: 'Live Demo',
    stack: 'React, n8n Webhook, Ecommerce Logic',
    outcome: 'Scoring panier abandonne, sequence relance et estimation revenu recupere.',
  },
];

const CHATBOT_FAQ = [
  {
    keywords: ['prix', 'tarif', 'cost', 'rate', 'budget'],
    answer:
      'Nos missions commencent en general par un diagnostic puis un sprint implementation. Je peux te qualifier ici et te proposer une fourchette selon ton use case.',
  },
  {
    keywords: ['delai', 'timeline', 'combien de temps', 'semaine', 'rapidement'],
    answer: 'En moyenne: 72h pour audit + plan, puis 2 a 6 semaines pour un pilote fonctionnel.',
  },
  {
    keywords: ['n8n', 'zapier', 'make', 'hubspot', 'shopify', 'gorgias', 'crm', 'api'],
    answer: 'Oui, on integre n8n/Zapier/Make avec vos outils ecommerce/CRM et documentation handover.',
  },
  {
    keywords: ['demo', 'exemple', 'proof', 'cas'],
    answer: 'Tu peux lancer les demos live ci-dessous pour voir la logique d execution et les payloads webhook.',
  },
];

const QUALIFY_FIELDS = [
  {
    key: 'name',
    question: 'Quel est ton nom ?',
    validate: (value) => value.trim().length >= 2,
    error: 'Nom invalide. Reessaie.',
    transform: (value) => value.trim(),
  },
  {
    key: 'email',
    question: 'Ton email pro ?',
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    error: 'Email invalide. Format: nom@entreprise.com',
    transform: (value) => value.trim().toLowerCase(),
  },
  {
    key: 'company',
    question: 'Nom de ton entreprise ?',
    validate: (value) => value.trim().length >= 2,
    error: 'Entreprise invalide.',
    transform: (value) => value.trim(),
  },
  {
    key: 'useCase',
    question: 'Quel process veux-tu automatiser en priorite ?',
    validate: (value) => value.trim().length >= 8,
    error: 'Decris un peu plus ton besoin (min 8 caracteres).',
    transform: (value) => value.trim(),
  },
  {
    key: 'teamSize',
    question: 'Taille equipe (nombre de personnes) ?',
    validate: (value) => {
      const n = Number(String(value).replace(/\D/g, ''));
      return Number.isFinite(n) && n > 0 && n <= 5000;
    },
    error: 'Donne juste un nombre (ex: 25).',
    transform: (value) => Number(String(value).replace(/\D/g, '')),
  },
  {
    key: 'budget',
    question: 'Budget mensuel cible (EUR) ?',
    validate: (value) => value.trim().length > 0,
    error: 'Donne une estimation (ex: 1500 ou 3000).',
    transform: (value) => value.trim(),
  },
];

const SUPPORT_STEPS = [
  'Reception du ticket',
  'Detection de l intention',
  'Scoring urgence + sentiment',
  'Decision de routage',
  'Generation reponse suggeree',
];

const RECOVERY_STEPS = [
  'Reception evenement panier abandonne',
  'Scoring valeur client et timing',
  'Selection de la strategie incentive',
  'Generation sequence recovery 3 etapes',
  'Projection revenu recupere',
];

const PROJECT_METRICS = [
  { label: 'Demos activables', value: '3' },
  { label: 'Temps moyen de test', value: '< 2 min' },
  { label: 'Payload webhook visible', value: '100%' },
];

const SIMULATE_WEBHOOK_SEND = true;

const CHATBOT_EXAMPLES = [
  {
    id: 'saas-sales',
    label: 'SaaS Sales',
    description: 'Qualification lead B2B pipeline',
    lead: {
      name: 'Nadia Martin',
      email: 'nadia.martin@ecommerceco.fr',
      company: 'EcommerceCo',
      useCase: 'Automatiser support client et qualification lead CRM',
      teamSize: 42,
      budget: '3000',
    },
    userMessage: 'Je veux automatiser support + CRM pour reduire la charge manuelle.',
  },
  {
    id: 'agency-ops',
    label: 'Agence Ops',
    description: 'Automatisation production + reporting',
    lead: {
      name: 'Karim El Idrissi',
      email: 'karim@creativeflow.fr',
      company: 'CreativeFlow',
      useCase: 'Automatiser reporting client, relances et synchronisation Notion vers HubSpot',
      teamSize: 18,
      budget: '1800',
    },
    userMessage: 'On perd du temps sur le reporting hebdo et les relances clients.',
  },
  {
    id: 'ecom-support',
    label: 'Ecommerce CX',
    description: 'Support + escalation intelligente',
    lead: {
      name: 'Julie Bernard',
      email: 'julie@beauty-market.fr',
      company: 'Beauty Market',
      useCase: 'Triage intelligent des tickets support avec escalade VIP et reponses automatiques',
      teamSize: 85,
      budget: '5500',
    },
    userMessage: 'Nos tickets explosent et on veut prioriser les clients VIP.',
  },
];

const SUPPORT_EXAMPLES = [
  {
    id: 'late-delivery',
    label: 'Livraison en retard',
    description: 'VIP + demande rapide',
    form: {
      customerName: 'Claire Martin',
      customerEmail: 'claire@client.com',
      orderId: 'MC-10293',
      language: 'fr',
      channel: 'email',
      vip: true,
      ticketText:
        'Bonjour, ma commande MC-10293 est en retard depuis 7 jours. Je veux une solution aujourd hui sinon je demande un remboursement.',
    },
  },
  {
    id: 'billing-issue',
    label: 'Erreur paiement',
    description: 'Double debit carte bancaire',
    form: {
      customerName: 'Thomas Leroy',
      customerEmail: 'thomas@client.com',
      orderId: 'BL-22871',
      language: 'fr',
      channel: 'chat',
      vip: false,
      ticketText:
        'J ai ete debite deux fois pour la commande BL-22871. Merci de corriger la facture et de confirmer le remboursement.',
    },
  },
  {
    id: 'product-defect',
    label: 'Produit defectueux',
    description: 'Escalade produit',
    form: {
      customerName: 'Emily Carter',
      customerEmail: 'emily@client.com',
      orderId: 'UK-99012',
      language: 'en',
      channel: 'social',
      vip: false,
      ticketText:
        'My order arrived broken and the device does not work at all. I need an urgent replacement today.',
    },
  },
];

const RECOVERY_EXAMPLES = [
  {
    id: 'high-value-returning',
    label: 'Panier eleve',
    description: 'Client fidele a forte valeur',
    form: {
      customerEmail: 'julie@shopclient.com',
      cartValue: '149',
      itemsCount: '3',
      hoursSinceAbandonment: '2',
      previousOrders: '2',
      customerType: 'returning',
      topProduct: 'Starter Gel Kit',
      region: 'fr',
    },
  },
  {
    id: 'new-customer-first-order',
    label: 'Nouveau client',
    description: 'Premier achat abandonne',
    form: {
      customerEmail: 'newbuyer@shopclient.com',
      cartValue: '72',
      itemsCount: '2',
      hoursSinceAbandonment: '6',
      previousOrders: '0',
      customerType: 'new',
      topProduct: 'Hydrating Serum',
      region: 'fr',
    },
  },
  {
    id: 'cold-cart-reactivation',
    label: 'Panier froid',
    description: 'Abandon > 48h',
    form: {
      customerEmail: 'reactivation@shopclient.com',
      cartValue: '210',
      itemsCount: '4',
      hoursSinceAbandonment: '52',
      previousOrders: '5',
      customerType: 'returning',
      topProduct: 'Premium Care Bundle',
      region: 'en',
    },
  },
];

function computeQualification(useCase, teamSize, budget) {
  const text = (useCase || '').toLowerCase();
  let score = 46;
  let monthlyHoursSaved = 8;
  let confidence = 'medium';

  if (text.includes('support') || text.includes('ticket') || text.includes('service client')) {
    score += 16;
    monthlyHoursSaved += 12;
  }
  if (text.includes('lead') || text.includes('sales') || text.includes('vente') || text.includes('crm')) {
    score += 14;
    monthlyHoursSaved += 9;
  }
  if (text.includes('ops') || text.includes('operation') || text.includes('report') || text.includes('back-office')) {
    score += 12;
    monthlyHoursSaved += 10;
  }
  if (teamSize >= 50) {
    score += 8;
    monthlyHoursSaved += 8;
  }
  if (teamSize >= 120) score += 6;

  const budgetValue = Number(String(budget || '').replace(/\D/g, ''));
  if (budgetValue >= 2500) score += 6;
  if (budgetValue >= 5000) {
    score += 4;
    confidence = 'high';
  }

  const finalScore = Math.min(99, Math.max(40, score));
  const priority = finalScore >= 80 ? 'High' : finalScore >= 65 ? 'Medium' : 'Normal';
  const routeTo = finalScore >= 75 ? 'Sales Owner + Ops Lead' : 'Automation Backlog';
  const nextAction =
    priority === 'High' ? 'Book diagnostic call within 24h' : 'Send proposal sequence + follow-up J+2';

  return { finalScore, priority, routeTo, monthlyHoursSaved, confidence, nextAction };
}

function analyzeSupportTicket({ ticketText, orderId, language, vip }) {
  const text = (ticketText || '').toLowerCase();
  const hasOrderId = (orderId || '').trim().length > 0;

  let intent = 'General Inquiry';
  if (/refund|return|remboursement|retour|exchange|echange/.test(text)) intent = 'Returns';
  else if (/shipping|delivery|where is|expedition|livraison|colis|tracking/.test(text)) intent = 'Shipping';
  else if (/payment|invoice|billing|facture|paiement|carte/.test(text)) intent = 'Billing';
  else if (/broken|defect|doesn.t work|bug|casse|defaut|ne marche pas/.test(text)) intent = 'Product Issue';
  else if (/cancel|annuler|resiliation/.test(text)) intent = 'Cancellation';

  let sentiment = 'Neutral';
  if (/thanks|merci|great|super|parfait/.test(text)) sentiment = 'Positive';
  if (/angry|furious|urgent|asap|arnaque|scam|chargeback|plainte|colere/.test(text)) sentiment = 'Negative';

  let score = 48;
  if (intent === 'Billing' || intent === 'Returns') score += 15;
  if (intent === 'Product Issue' || intent === 'Cancellation') score += 12;
  if (sentiment === 'Negative') score += 14;
  if (hasOrderId) score += 6;
  if (vip) score += 8;
  if (/urgent|asap|today|aujourd'hui|maintenant/.test(text)) score += 10;

  const priority = score >= 80 ? 'High' : score >= 65 ? 'Medium' : 'Normal';

  let routeTo = 'Support Queue';
  if (priority === 'High' && (intent === 'Billing' || intent === 'Returns')) routeTo = 'Senior Support + Ops';
  else if (intent === 'Product Issue') routeTo = 'Support + Product Specialist';
  else if (intent === 'Shipping') routeTo = 'Support + Logistics';

  const tags = [
    `intent:${intent.toLowerCase().replace(/\s+/g, '_')}`,
    `priority:${priority.toLowerCase()}`,
    `sentiment:${sentiment.toLowerCase()}`,
    hasOrderId ? 'has_order_id:true' : 'has_order_id:false',
    vip ? 'customer:vip' : 'customer:standard',
  ];

  const suggestedReply =
    language === 'fr'
      ? `Bonjour, merci pour votre message. Nous avons bien pris en compte votre demande (${intent.toLowerCase()}). Notre equipe traite votre dossier en priorite ${priority.toLowerCase()} et revient vers vous rapidement.`
      : `Hi, thanks for your message. We have received your request (${intent.toLowerCase()}). Our team is handling it with ${priority.toLowerCase()} priority and will get back to you quickly.`;

  return {
    score: Math.min(99, Math.max(40, score)),
    intent,
    sentiment,
    priority,
    routeTo,
    tags,
    suggestedReply,
  };
}

function analyzeRecoveryFlow({
  cartValue,
  itemsCount,
  hoursSinceAbandonment,
  previousOrders,
  customerType,
  topProduct,
  region,
}) {
  const value = Number(cartValue) || 0;
  const items = Number(itemsCount) || 1;
  const hours = Number(hoursSinceAbandonment) || 1;
  const orders = Number(previousOrders) || 0;
  const isReturning = customerType === 'returning' || orders > 0;

  let score = 52;
  if (value >= 80) score += 10;
  if (value >= 150) score += 8;
  if (items >= 3) score += 6;
  if (hours <= 3) score += 10;
  if (hours <= 24) score += 6;
  if (isReturning) score += 7;
  if (orders >= 3) score += 4;

  const recoveryScore = Math.min(99, Math.max(45, score));
  const urgency = hours <= 3 ? 'Immediate' : hours <= 24 ? 'High' : 'Normal';
  const recommendedIncentive =
    value >= 120 ? 'Free shipping + soft urgency' : isReturning ? 'Loyalty points bonus' : '10% first-order code';
  const priority = recoveryScore >= 80 ? 'High' : recoveryScore >= 65 ? 'Medium' : 'Normal';
  const expectedRecoveryRate = Math.min(42, Math.max(12, Math.round(recoveryScore / 2.3)));
  const estimatedRecoveredRevenue = Math.round((value * expectedRecoveryRate) / 100);

  const sequence = [
    {
      timing: 'T+30min',
      channel: 'Email',
      message:
        region === 'fr'
          ? `Bonjour, votre panier (${topProduct || 'vos articles'}) vous attend. Besoin d aide pour finaliser ?`
          : `Hi, your cart (${topProduct || 'your items'}) is still waiting. Need help checking out?`,
    },
    {
      timing: 'T+24h',
      channel: 'Email/SMS',
      message:
        region === 'fr'
          ? `Rappel rapide: finalisez votre commande aujourd hui. Offre: ${recommendedIncentive}.`
          : `Quick reminder: complete your order today. Offer: ${recommendedIncentive}.`,
    },
    {
      timing: 'T+72h',
      channel: 'Email',
      message:
        region === 'fr'
          ? 'Dernier rappel avec preuve sociale + FAQ livraison/retours.'
          : 'Final reminder with social proof + shipping/returns FAQ.',
    },
  ];

  return {
    recoveryScore,
    priority,
    urgency,
    expectedRecoveryRate,
    estimatedRecoveredRevenue,
    recommendedIncentive,
    sequence,
  };
}

function getFaqAnswer(query) {
  const q = (query || '').toLowerCase();
  const matched = CHATBOT_FAQ.find((item) => item.keywords.some((k) => q.includes(k)));
  return matched ? matched.answer : null;
}

function ProjectCard({ project, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left rounded-xl border p-4 transition-all duration-200 ${
        active
          ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.35)]'
          : 'border-border bg-background hover:border-primary/40'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold text-foreground">{project.title}</h3>
        <span className="text-[11px] px-2 py-1 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700">
          {project.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{project.stack}</p>
      <p className="mt-2 text-sm text-muted-foreground">{project.outcome}</p>
      <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
        Ouvrir la demo
        <ArrowRight className="w-3 h-3" />
      </div>
    </button>
  );
}

export default function Projects() {
  const [activeDemo, setActiveDemo] = useState('chatbot');

  // Chatbot demo state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Bonjour, je suis le chatbot demo IdeaToAutomation. Je peux repondre a tes questions ou qualifier ton besoin.',
    },
  ]);
  const [qualificationStarted, setQualificationStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    company: '',
    useCase: '',
    teamSize: '',
    budget: '',
  });
  const [result, setResult] = useState(null);
  const [sending, setSending] = useState(false);
  const [webhookState, setWebhookState] = useState('');
  const [activeChatbotExample, setActiveChatbotExample] = useState(CHATBOT_EXAMPLES[0].id);

  // Support demo state
  const [supportForm, setSupportForm] = useState({
    customerName: '',
    customerEmail: '',
    orderId: '',
    language: 'fr',
    channel: 'email',
    vip: false,
    ticketText: '',
  });
  const [supportStepsDone, setSupportStepsDone] = useState([]);
  const [supportResult, setSupportResult] = useState(null);
  const [supportSending, setSupportSending] = useState(false);
  const [supportWebhookState, setSupportWebhookState] = useState('');
  const [activeSupportExample, setActiveSupportExample] = useState(SUPPORT_EXAMPLES[0].id);

  // Recovery demo state
  const [recoveryForm, setRecoveryForm] = useState({
    customerEmail: '',
    cartValue: '',
    itemsCount: '1',
    hoursSinceAbandonment: '2',
    previousOrders: '0',
    customerType: 'new',
    topProduct: '',
    region: 'fr',
  });
  const [recoveryStepsDone, setRecoveryStepsDone] = useState([]);
  const [recoveryResult, setRecoveryResult] = useState(null);
  const [recoverySending, setRecoverySending] = useState(false);
  const [recoveryWebhookState, setRecoveryWebhookState] = useState('');
  const [activeRecoveryExample, setActiveRecoveryExample] = useState(RECOVERY_EXAMPLES[0].id);

  const chatContainerRef = useRef(null);
  const demoSectionRef = useRef(null);

  useEffect(() => {
    const old = document.title;
    document.title = 'Projects Live - IdeaToAutomation';
    return () => {
      document.title = old;
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!demoSectionRef.current) return;
    demoSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeDemo]);

  const webhookUrl = (import.meta.env.VITE_CHATBOT_WEBHOOK_URL || import.meta.env.VITE_LEAD_WEBHOOK_URL || '').trim();
  const supportWebhookUrl = (import.meta.env.VITE_SUPPORT_WEBHOOK_URL || import.meta.env.VITE_LEAD_WEBHOOK_URL || '').trim();
  const recoveryWebhookUrl = (import.meta.env.VITE_RECOVERY_WEBHOOK_URL || import.meta.env.VITE_LEAD_WEBHOOK_URL || '').trim();
  const selectedChatbotExample = CHATBOT_EXAMPLES.find((example) => example.id === activeChatbotExample) || CHATBOT_EXAMPLES[0];
  const selectedSupportExample = SUPPORT_EXAMPLES.find((example) => example.id === activeSupportExample) || SUPPORT_EXAMPLES[0];
  const selectedRecoveryExample = RECOVERY_EXAMPLES.find((example) => example.id === activeRecoveryExample) || RECOVERY_EXAMPLES[0];

  // Chatbot actions
  const startQualification = () => {
    if (qualificationStarted) return;
    setQualificationStarted(true);
    setActiveStep(0);
    setMessages((prev) => [...prev, { role: 'bot', text: QUALIFY_FIELDS[0].question }]);
    trackEvent('chatbot_qualification_start', { page: 'projects' });
  };

  const pushMessage = (role, text) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const handleUserMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput('');
    pushMessage('user', text);

    if (qualificationStarted && activeStep >= 0 && activeStep < QUALIFY_FIELDS.length) {
      const step = QUALIFY_FIELDS[activeStep];
      if (!step.validate(text)) {
        pushMessage('bot', step.error);
        return;
      }

      const value = step.transform(text);
      const updatedLead = { ...leadData, [step.key]: value };
      setLeadData(updatedLead);

      if (activeStep < QUALIFY_FIELDS.length - 1) {
        const nextStep = activeStep + 1;
        setActiveStep(nextStep);
        pushMessage('bot', QUALIFY_FIELDS[nextStep].question);
        return;
      }

      const qual = computeQualification(updatedLead.useCase, Number(updatedLead.teamSize), updatedLead.budget);
      setResult(qual);
      setActiveStep(-1);
      pushMessage(
        'bot',
        `Qualification terminee. Score ${qual.finalScore}/100, priorite ${qual.priority}. Action recommandee: ${qual.nextAction}.`,
      );
      trackEvent('chatbot_qualification_completed', {
        page: 'projects',
        score: qual.finalScore,
        priority: qual.priority,
      });
      return;
    }

    const faq = getFaqAnswer(text);
    if (faq) {
      pushMessage('bot', faq);
      return;
    }

    pushMessage(
      'bot',
      'Je peux te repondre sur delai, pricing, stack technique, ou lancer la qualification. Clique Demarrer qualification.',
    );
  };

  const sendQuickUserMessage = (text) => {
    setChatInput(text);
    setTimeout(() => {
      setChatInput('');
      pushMessage('user', text);
      const faq = getFaqAnswer(text);
      pushMessage('bot', faq || 'Bonne question. Je peux aussi te qualifier en live si tu veux.');
    }, 50);
  };

  const resetConversation = () => {
    setMessages([
      {
        role: 'bot',
        text: 'Conversation reinitialisee. Je peux repondre a tes questions ou relancer une qualification complete.',
      },
    ]);
    setQualificationStarted(false);
    setActiveStep(-1);
    setLeadData({ name: '', email: '', company: '', useCase: '', teamSize: '', budget: '' });
    setResult(null);
    setWebhookState('');
  };

  const loadChatbotSample = (example) => {
    const qual = computeQualification(example.lead.useCase, Number(example.lead.teamSize), example.lead.budget);
    setLeadData(example.lead);
    setResult(qual);
    setQualificationStarted(false);
    setActiveStep(-1);
    setActiveChatbotExample(example.id);
    setWebhookState(`Exemple "${example.label}" charge. Tu peux envoyer le payload webhook directement.`);
    setMessages([
      { role: 'bot', text: 'Exemple de qualification charge pour une simulation rapide.' },
      { role: 'user', text: example.userMessage },
      {
        role: 'bot',
        text: `Score ${qual.finalScore}/100, priorite ${qual.priority}. Action recommandee: ${qual.nextAction}.`,
      },
    ]);
    trackEvent('chatbot_sample_loaded', { page: 'projects', example_id: example.id });
  };

  const payloadPreview = useMemo(
    () =>
      JSON.stringify(
        {
          name: leadData.name || 'Prospect Name',
          email: leadData.email || 'prospect@company.com',
          company: leadData.company || 'Company',
          objective: leadData.useCase || 'Automate support and lead routing',
          team_size: leadData.teamSize || 15,
          budget: leadData.budget || 'N/A',
          score: result?.finalScore || null,
          priority: result?.priority || null,
          source: 'projects-chatbot-live',
          created_at: new Date().toISOString(),
        },
        null,
        2,
      ),
    [leadData, result],
  );

  const sendToWebhook = async () => {
    if (!leadData.name || !leadData.email || !leadData.useCase || !result) {
      setWebhookState('Complete la qualification avant envoi.');
      return;
    }

    setSending(true);
    setWebhookState('');

    const payload = {
      name: leadData.name,
      email: leadData.email,
      company: leadData.company,
      objective: leadData.useCase,
      team_size: Number(leadData.teamSize) || null,
      budget: leadData.budget,
      score: result.finalScore,
      priority: result.priority,
      page_url: window.location.href,
      source: 'projects-chatbot-live',
      created_at: new Date().toISOString(),
    };

    try {
      if (SIMULATE_WEBHOOK_SEND) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        setWebhookState('Simulation active: envoi simule reussi (aucune requete externe envoyee).');
        trackEvent('chatbot_webhook_simulated', { page: 'projects', score: result.finalScore });
        return;
      }

      if (!webhookUrl) {
        setWebhookState('Webhook non configure (VITE_CHATBOT_WEBHOOK_URL ou VITE_LEAD_WEBHOOK_URL).');
        return;
      }

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Webhook failed (${res.status})`);
      setWebhookState('Lead envoye au webhook avec succes.');
      trackEvent('chatbot_webhook_success', { page: 'projects' });
    } catch (err) {
      setWebhookState(`Erreur envoi webhook: ${err.message}`);
      trackEvent('chatbot_webhook_error', { page: 'projects', message: err.message });
    } finally {
      setSending(false);
    }
  };

  // Support actions
  const supportPayloadPreview = useMemo(
    () =>
      JSON.stringify(
        {
          customer_name: supportForm.customerName || 'Customer Name',
          customer_email: supportForm.customerEmail || 'customer@company.com',
          order_id: supportForm.orderId || 'N/A',
          language: supportForm.language,
          channel: supportForm.channel,
          vip: supportForm.vip,
          ticket_text: supportForm.ticketText || 'Customer issue text',
          triage: supportResult || null,
          source: 'projects-support-triage-live',
          created_at: new Date().toISOString(),
        },
        null,
        2,
      ),
    [supportForm, supportResult],
  );

  const runSupportTriage = () => {
    if (!supportForm.customerName || !supportForm.customerEmail || !supportForm.ticketText) {
      setSupportWebhookState('Remplis nom, email et ticket pour analyser.');
      return;
    }

    setSupportWebhookState('');
    setSupportResult(null);
    setSupportStepsDone([]);

    SUPPORT_STEPS.forEach((step, index) => {
      setTimeout(() => {
        setSupportStepsDone((prev) => [...prev, step]);
        if (index === SUPPORT_STEPS.length - 1) {
          const analysis = analyzeSupportTicket({
            ticketText: supportForm.ticketText,
            orderId: supportForm.orderId,
            language: supportForm.language,
            vip: supportForm.vip,
          });
          setSupportResult(analysis);
          trackEvent('support_triage_completed', {
            page: 'projects',
            priority: analysis.priority,
            intent: analysis.intent,
            score: analysis.score,
          });
        }
      }, 380 * (index + 1));
    });
  };

  const loadSupportSample = (example) => {
    setSupportForm(example.form);
    setActiveSupportExample(example.id);
    setSupportStepsDone([...SUPPORT_STEPS]);
    const analysis = analyzeSupportTicket({
      ticketText: example.form.ticketText,
      orderId: example.form.orderId,
      language: example.form.language,
      vip: example.form.vip,
    });
    setSupportResult(analysis);
    setSupportWebhookState(`Exemple "${example.label}" charge et analyse.`);
    trackEvent('support_triage_sample_loaded', { page: 'projects', example_id: example.id });
  };

  const sendSupportToWebhook = async () => {
    if (!supportResult) {
      setSupportWebhookState('Lance l analyse support avant envoi.');
      return;
    }

    setSupportSending(true);
    setSupportWebhookState('');

    const payload = {
      customer_name: supportForm.customerName,
      customer_email: supportForm.customerEmail,
      order_id: supportForm.orderId || null,
      language: supportForm.language,
      channel: supportForm.channel,
      vip: supportForm.vip,
      ticket_text: supportForm.ticketText,
      intent: supportResult.intent,
      sentiment: supportResult.sentiment,
      priority: supportResult.priority,
      score: supportResult.score,
      route_to: supportResult.routeTo,
      tags: supportResult.tags,
      suggested_reply: supportResult.suggestedReply,
      source: 'projects-support-triage-live',
      page_url: window.location.href,
      created_at: new Date().toISOString(),
    };

    try {
      if (SIMULATE_WEBHOOK_SEND) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        setSupportWebhookState('Simulation active: envoi triage simule reussi (aucune requete externe envoyee).');
        trackEvent('support_triage_webhook_simulated', { page: 'projects', score: supportResult.score });
        return;
      }

      if (!supportWebhookUrl) {
        setSupportWebhookState('Webhook non configure (VITE_SUPPORT_WEBHOOK_URL ou VITE_LEAD_WEBHOOK_URL).');
        return;
      }

      const res = await fetch(supportWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Webhook failed (${res.status})`);
      setSupportWebhookState('Ticket triage envoye au webhook avec succes.');
      trackEvent('support_triage_webhook_success', { page: 'projects' });
    } catch (err) {
      setSupportWebhookState(`Erreur envoi webhook support: ${err.message}`);
      trackEvent('support_triage_webhook_error', { page: 'projects', message: err.message });
    } finally {
      setSupportSending(false);
    }
  };

  // Recovery actions
  const recoveryPayloadPreview = useMemo(
    () =>
      JSON.stringify(
        {
          customer_email: recoveryForm.customerEmail || 'customer@store.com',
          cart_value: Number(recoveryForm.cartValue) || 0,
          items_count: Number(recoveryForm.itemsCount) || 1,
          hours_since_abandonment: Number(recoveryForm.hoursSinceAbandonment) || 2,
          previous_orders: Number(recoveryForm.previousOrders) || 0,
          customer_type: recoveryForm.customerType,
          region: recoveryForm.region,
          top_product: recoveryForm.topProduct || 'N/A',
          recovery: recoveryResult || null,
          source: 'projects-revenue-recovery-live',
          created_at: new Date().toISOString(),
        },
        null,
        2,
      ),
    [recoveryForm, recoveryResult],
  );

  const runRecoveryAnalysis = () => {
    if (!recoveryForm.customerEmail || !recoveryForm.cartValue) {
      setRecoveryWebhookState('Remplis email client et valeur panier.');
      return;
    }

    setRecoveryWebhookState('');
    setRecoveryResult(null);
    setRecoveryStepsDone([]);

    RECOVERY_STEPS.forEach((step, index) => {
      setTimeout(() => {
        setRecoveryStepsDone((prev) => [...prev, step]);
        if (index === RECOVERY_STEPS.length - 1) {
          const analysis = analyzeRecoveryFlow(recoveryForm);
          setRecoveryResult(analysis);
          trackEvent('recovery_flow_completed', {
            page: 'projects',
            score: analysis.recoveryScore,
            priority: analysis.priority,
          });
        }
      }, 380 * (index + 1));
    });
  };

  const loadRecoverySample = (example) => {
    setRecoveryForm(example.form);
    setActiveRecoveryExample(example.id);
    setRecoveryStepsDone([...RECOVERY_STEPS]);
    const analysis = analyzeRecoveryFlow(example.form);
    setRecoveryResult(analysis);
    setRecoveryWebhookState(`Exemple "${example.label}" charge et analyse.`);
    trackEvent('recovery_sample_loaded', { page: 'projects', example_id: example.id });
  };

  const sendRecoveryToWebhook = async () => {
    if (!recoveryResult) {
      setRecoveryWebhookState('Lance d abord l analyse recovery.');
      return;
    }

    setRecoverySending(true);
    setRecoveryWebhookState('');

    const payload = {
      customer_email: recoveryForm.customerEmail,
      cart_value: Number(recoveryForm.cartValue) || 0,
      items_count: Number(recoveryForm.itemsCount) || 1,
      hours_since_abandonment: Number(recoveryForm.hoursSinceAbandonment) || 2,
      previous_orders: Number(recoveryForm.previousOrders) || 0,
      customer_type: recoveryForm.customerType,
      region: recoveryForm.region,
      top_product: recoveryForm.topProduct || '',
      recovery_score: recoveryResult.recoveryScore,
      priority: recoveryResult.priority,
      urgency: recoveryResult.urgency,
      expected_recovery_rate: recoveryResult.expectedRecoveryRate,
      estimated_recovered_revenue: recoveryResult.estimatedRecoveredRevenue,
      recommended_incentive: recoveryResult.recommendedIncentive,
      sequence: recoveryResult.sequence,
      source: 'projects-revenue-recovery-live',
      page_url: window.location.href,
      created_at: new Date().toISOString(),
    };

    try {
      if (SIMULATE_WEBHOOK_SEND) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        setRecoveryWebhookState('Simulation active: envoi recovery simule reussi (aucune requete externe envoyee).');
        trackEvent('recovery_webhook_simulated', { page: 'projects', score: recoveryResult.recoveryScore });
        return;
      }

      if (!recoveryWebhookUrl) {
        setRecoveryWebhookState('Webhook non configure (VITE_RECOVERY_WEBHOOK_URL ou VITE_LEAD_WEBHOOK_URL).');
        return;
      }

      const res = await fetch(recoveryWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Webhook failed (${res.status})`);
      setRecoveryWebhookState('Recovery flow envoye au webhook avec succes.');
      trackEvent('recovery_webhook_success', { page: 'projects' });
    } catch (err) {
      setRecoveryWebhookState(`Erreur envoi webhook recovery: ${err.message}`);
      trackEvent('recovery_webhook_error', { page: 'projects', message: err.message });
    } finally {
      setRecoverySending(false);
    }
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

      <main>
        <section className="relative overflow-hidden py-16 lg:py-24 border-b border-border">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_15%,rgba(59,130,246,.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,.14),transparent_28%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Projects & Live Demos
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight">
                Des projets reels, testables, et orientés ROI.
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Choisis une demo live ci-dessous pour voir exactement comment l&apos;agent prend une decision et envoie le payload vers n8n.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg border border-border bg-background/70 px-3 py-2">Chatbot qualification</div>
                <div className="rounded-lg border border-border bg-background/70 px-3 py-2">Support triage</div>
                <div className="rounded-lg border border-border bg-background/70 px-3 py-2">Revenue recovery</div>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PROJECT_METRICS.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-border bg-background/70 px-4 py-3">
                    <p className="text-xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 lg:grid-cols-3">
              {PROJECTS.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  active={activeDemo === p.id}
                  onSelect={() => setActiveDemo(p.id)}
                />
              ))}
            </div>
          </div>
        </section>

        <section ref={demoSectionRef} className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {activeDemo === 'chatbot' ? (
              <div className="grid gap-6 xl:grid-cols-5">
                <Card className="xl:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-primary" />
                      Live Demo - AI Website Chatbot
                    </CardTitle>
                    <CardDescription>
                      Conversation live, FAQ, qualification lead, puis envoi webhook.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div ref={chatContainerRef} className="rounded-xl border border-border bg-surface-elevated/70 p-3 h-[360px] overflow-auto space-y-3">
                      {messages.map((msg, idx) => (
                        <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background border border-border text-foreground'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg border border-border bg-background/70 p-3 space-y-2">
                      <p className="text-xs font-semibold text-foreground">Choisir un exemple (3 scenarii)</p>
                      <div className="flex flex-wrap gap-2">
                        {CHATBOT_EXAMPLES.map((example) => (
                          <Button
                            key={example.id}
                            type="button"
                            variant={activeChatbotExample === example.id ? 'default' : 'outline'}
                            onClick={() => loadChatbotSample(example)}
                            className="rounded-full"
                          >
                            {example.label}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{selectedChatbotExample.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" onClick={startQualification} className="rounded-full">
                        Demarrer qualification manuelle
                      </Button>
                      <Button type="button" variant="outline" onClick={() => sendQuickUserMessage('Quels sont vos tarifs ?')} className="rounded-full">
                        Quick FAQ: Prix
                      </Button>
                      <Button type="button" variant="outline" onClick={() => sendQuickUserMessage('Quels sont les delais ?')} className="rounded-full">
                        Quick FAQ: Delais
                      </Button>
                      <Button type="button" variant="ghost" onClick={resetConversation} className="rounded-full">
                        Reinitialiser
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        className="flex-1 h-11 rounded-full border border-input bg-background px-4 text-sm"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUserMessage();
                        }}
                        placeholder="Ecris un message..."
                        aria-label="Message chatbot"
                      />
                      <Button onClick={handleUserMessage} size="icon" className="rounded-full" aria-label="Envoyer message">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Conseil UX: clique un exemple, compare le score obtenu, puis envoie le payload webhook.
                    </p>
                  </CardContent>
                </Card>

                <Card className="xl:col-span-2">
                  <CardHeader>
                    <CardTitle>Execution & Lead Output</CardTitle>
                    <CardDescription>Sortie visible pour ton prospect et ton webhook.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-border bg-surface-elevated p-4">
                      <p className="text-xs font-mono text-muted-foreground mb-2">Payload preview</p>
                      <pre className="text-xs overflow-auto max-h-48 whitespace-pre-wrap break-all">{payloadPreview}</pre>
                    </div>

                    {result ? (
                      <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm space-y-1">
                        <p><strong>Lead score:</strong> {result.finalScore}/100</p>
                        <p><strong>Priority:</strong> {result.priority}</p>
                        <p><strong>Route to:</strong> {result.routeTo}</p>
                        <p><strong>Estimated hours saved/mo:</strong> {result.monthlyHoursSaved}h</p>
                        <p><strong>Confidence:</strong> {result.confidence}</p>
                        <p><strong>Next action:</strong> {result.nextAction}</p>
                      </div>
                    ) : null}

                    <Button onClick={sendToWebhook} disabled={sending || !result} className="w-full rounded-full">
                      <Cpu className="w-4 h-4" />
                      {sending ? 'Envoi...' : 'Envoyer au webhook'}
                    </Button>

                    {webhookState ? (
                      <p className={`text-sm ${webhookState.toLowerCase().includes('succes') ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                        {webhookState}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            ) : null}

            {activeDemo === 'support' ? (
              <div className="grid gap-6 xl:grid-cols-5">
                <Card className="xl:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-primary" />
                      Live Demo - Support Triage Agent
                    </CardTitle>
                    <CardDescription>Colle un ticket client reel et vois la priorisation instantanee.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <label className="text-sm space-y-1">
                        <span className="text-muted-foreground">Nom client</span>
                        <input className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={supportForm.customerName} onChange={(e) => setSupportForm((f) => ({ ...f, customerName: e.target.value }))} placeholder="Claire Martin" />
                      </label>
                      <label className="text-sm space-y-1">
                        <span className="text-muted-foreground">Email client</span>
                        <input className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={supportForm.customerEmail} onChange={(e) => setSupportForm((f) => ({ ...f, customerEmail: e.target.value }))} placeholder="claire@client.com" />
                      </label>
                      <label className="text-sm space-y-1">
                        <span className="text-muted-foreground">Order ID (optionnel)</span>
                        <input className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={supportForm.orderId} onChange={(e) => setSupportForm((f) => ({ ...f, orderId: e.target.value }))} placeholder="#MC-10293" />
                      </label>
                      <label className="text-sm space-y-1">
                        <span className="text-muted-foreground">Canal</span>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={supportForm.channel} onChange={(e) => setSupportForm((f) => ({ ...f, channel: e.target.value }))}>
                          <option value="email">Email</option>
                          <option value="chat">Chat</option>
                          <option value="social">Social DM</option>
                        </select>
                      </label>
                      <label className="text-sm space-y-1">
                        <span className="text-muted-foreground">Langue</span>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={supportForm.language} onChange={(e) => setSupportForm((f) => ({ ...f, language: e.target.value }))}>
                          <option value="fr">Francais</option>
                          <option value="en">English</option>
                        </select>
                      </label>
                      <label className="text-sm space-y-1">
                        <span className="text-muted-foreground">Client VIP</span>
                        <div className="h-10 rounded-md border border-input bg-background px-3 flex items-center gap-2">
                          <input type="checkbox" checked={supportForm.vip} onChange={(e) => setSupportForm((f) => ({ ...f, vip: e.target.checked }))} />
                          <span className="text-sm">Prioriser ce client</span>
                        </div>
                      </label>
                    </div>

                    <div className="rounded-lg border border-border bg-background/70 p-3 space-y-2">
                      <p className="text-xs font-semibold text-foreground">Choisir un exemple (3 scenarii)</p>
                      <div className="flex flex-wrap gap-2">
                        {SUPPORT_EXAMPLES.map((example) => (
                          <Button
                            key={example.id}
                            variant={activeSupportExample === example.id ? 'default' : 'outline'}
                            onClick={() => loadSupportSample(example)}
                            className="rounded-full"
                          >
                            {example.label}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{selectedSupportExample.description}</p>
                    </div>

                    <label className="text-sm space-y-1 block">
                      <span className="text-muted-foreground">Ticket message</span>
                      <textarea className="w-full min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm" value={supportForm.ticketText} onChange={(e) => setSupportForm((f) => ({ ...f, ticketText: e.target.value }))} placeholder="Bonjour, ma commande n est toujours pas livree et je veux un remboursement." />
                    </label>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={runSupportTriage} className="rounded-full">
                        <AlertTriangle className="w-4 h-4" />
                        Analyser le ticket
                      </Button>
                      <Button onClick={sendSupportToWebhook} disabled={supportSending || !supportResult} variant="outline" className="rounded-full">
                        <Cpu className="w-4 h-4" />
                        {supportSending ? 'Envoi...' : 'Envoyer triage webhook'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Sequence ideale: choisis un exemple, compare intent/priorite, puis envoie au webhook.
                    </p>
                  </CardContent>
                </Card>

                <Card className="xl:col-span-2">
                  <CardHeader>
                    <CardTitle>Triage Output</CardTitle>
                    <CardDescription>Sortie exploitable pour Gorgias/CRM/n8n.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-border bg-background p-3 text-xs space-y-2">
                      {SUPPORT_STEPS.map((step) => (
                        <div key={step} className="flex items-center gap-2">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${supportStepsDone.includes(step) ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                          <span className={supportStepsDone.includes(step) ? 'text-foreground' : 'text-muted-foreground'}>{step}</span>
                        </div>
                      ))}
                    </div>

                    {supportResult ? (
                      <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm space-y-1">
                        <p><strong>Intent:</strong> {supportResult.intent}</p>
                        <p><strong>Sentiment:</strong> {supportResult.sentiment}</p>
                        <p><strong>Priority:</strong> {supportResult.priority}</p>
                        <p><strong>Score:</strong> {supportResult.score}/100</p>
                        <p><strong>Route:</strong> {supportResult.routeTo}</p>
                        <p><strong>Tags:</strong> {supportResult.tags.join(', ')}</p>
                        <p className="pt-1"><strong>Suggested reply:</strong> {supportResult.suggestedReply}</p>
                      </div>
                    ) : null}

                    <div className="rounded-lg border border-border bg-surface-elevated p-4">
                      <p className="text-xs font-mono text-muted-foreground mb-2">Support payload preview</p>
                      <pre className="text-xs overflow-auto max-h-48 whitespace-pre-wrap break-all">{supportPayloadPreview}</pre>
                    </div>

                    {supportWebhookState ? (
                      <p className={`text-sm ${supportWebhookState.toLowerCase().includes('succes') ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                        {supportWebhookState}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            ) : null}

            {activeDemo === 'recovery' ? (
              <div className="grid gap-6 xl:grid-cols-5">
                <Card className="xl:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                      Live Demo - Revenue Recovery Agent
                    </CardTitle>
                    <CardDescription>Simule un abandon panier et genere une sequence recovery actionnable.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <label className="text-sm space-y-1">
                        <span className="text-muted-foreground">Email client</span>
                        <input className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={recoveryForm.customerEmail} onChange={(e) => setRecoveryForm((f) => ({ ...f, customerEmail: e.target.value }))} placeholder="client@shop.com" />
                      </label>
                      <label className="text-sm space-y-1">
                        <span className="text-muted-foreground">Valeur panier (EUR)</span>
                        <input type="number" min={0} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={recoveryForm.cartValue} onChange={(e) => setRecoveryForm((f) => ({ ...f, cartValue: e.target.value }))} placeholder="89" />
                      </label>
                      <label className="text-sm space-y-1">
                        <span className="text-muted-foreground">Articles</span>
                        <input type="number" min={1} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={recoveryForm.itemsCount} onChange={(e) => setRecoveryForm((f) => ({ ...f, itemsCount: e.target.value }))} />
                      </label>
                      <label className="text-sm space-y-1">
                        <span className="text-muted-foreground">Heures depuis abandon</span>
                        <input type="number" min={1} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={recoveryForm.hoursSinceAbandonment} onChange={(e) => setRecoveryForm((f) => ({ ...f, hoursSinceAbandonment: e.target.value }))} />
                      </label>
                      <label className="text-sm space-y-1">
                        <span className="text-muted-foreground">Commandes precedentes</span>
                        <input type="number" min={0} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={recoveryForm.previousOrders} onChange={(e) => setRecoveryForm((f) => ({ ...f, previousOrders: e.target.value }))} />
                      </label>
                      <label className="text-sm space-y-1">
                        <span className="text-muted-foreground">Type client</span>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={recoveryForm.customerType} onChange={(e) => setRecoveryForm((f) => ({ ...f, customerType: e.target.value }))}>
                          <option value="new">Nouveau</option>
                          <option value="returning">Fidelise</option>
                        </select>
                      </label>
                      <label className="text-sm space-y-1">
                        <span className="text-muted-foreground">Region</span>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={recoveryForm.region} onChange={(e) => setRecoveryForm((f) => ({ ...f, region: e.target.value }))}>
                          <option value="fr">FR</option>
                          <option value="en">EN</option>
                        </select>
                      </label>
                      <label className="text-sm space-y-1">
                        <span className="text-muted-foreground">Produit principal</span>
                        <input className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={recoveryForm.topProduct} onChange={(e) => setRecoveryForm((f) => ({ ...f, topProduct: e.target.value }))} placeholder="Green Flash Kit" />
                      </label>
                    </div>

                    <div className="rounded-lg border border-border bg-background/70 p-3 space-y-2">
                      <p className="text-xs font-semibold text-foreground">Choisir un exemple (3 scenarii)</p>
                      <div className="flex flex-wrap gap-2">
                        {RECOVERY_EXAMPLES.map((example) => (
                          <Button
                            key={example.id}
                            variant={activeRecoveryExample === example.id ? 'default' : 'outline'}
                            onClick={() => loadRecoverySample(example)}
                            className="rounded-full"
                          >
                            {example.label}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{selectedRecoveryExample.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={runRecoveryAnalysis} className="rounded-full">
                        <ShoppingCart className="w-4 h-4" />
                        Lancer analyse recovery
                      </Button>
                      <Button onClick={sendRecoveryToWebhook} disabled={recoverySending || !recoveryResult} variant="outline" className="rounded-full">
                        <Cpu className="w-4 h-4" />
                        {recoverySending ? 'Envoi...' : 'Envoyer recovery webhook'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Sequence ideale: choisis un exemple, compare score/incentive, puis envoie au webhook.
                    </p>
                  </CardContent>
                </Card>

                <Card className="xl:col-span-2">
                  <CardHeader>
                    <CardTitle>Recovery Output</CardTitle>
                    <CardDescription>Sequence actionnable prete pour Klaviyo/n8n.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-border bg-background p-3 text-xs space-y-2">
                      {RECOVERY_STEPS.map((step) => (
                        <div key={step} className="flex items-center gap-2">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${recoveryStepsDone.includes(step) ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                          <span className={recoveryStepsDone.includes(step) ? 'text-foreground' : 'text-muted-foreground'}>{step}</span>
                        </div>
                      ))}
                    </div>

                    {recoveryResult ? (
                      <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm space-y-1">
                        <p><strong>Recovery score:</strong> {recoveryResult.recoveryScore}/100</p>
                        <p><strong>Priority:</strong> {recoveryResult.priority}</p>
                        <p><strong>Urgency:</strong> {recoveryResult.urgency}</p>
                        <p><strong>Expected recovery rate:</strong> {recoveryResult.expectedRecoveryRate}%</p>
                        <p><strong>Estimated recovered revenue:</strong> {recoveryResult.estimatedRecoveredRevenue} EUR</p>
                        <p><strong>Incentive:</strong> {recoveryResult.recommendedIncentive}</p>
                        <p className="pt-1"><strong>Sequence:</strong></p>
                        {recoveryResult.sequence.map((item) => (
                          <p key={item.timing}>{item.timing} ({item.channel}): {item.message}</p>
                        ))}
                      </div>
                    ) : null}

                    <div className="rounded-lg border border-border bg-surface-elevated p-4">
                      <p className="text-xs font-mono text-muted-foreground mb-2">Recovery payload preview</p>
                      <pre className="text-xs overflow-auto max-h-48 whitespace-pre-wrap break-all">{recoveryPayloadPreview}</pre>
                    </div>

                    {recoveryWebhookState ? (
                      <p className={`text-sm ${recoveryWebhookState.toLowerCase().includes('succes') ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                        {recoveryWebhookState}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
