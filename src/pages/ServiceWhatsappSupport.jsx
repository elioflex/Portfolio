import React from 'react';
import ServicePageTemplate from '@/components/seo/ServicePageTemplate';

export default function ServiceWhatsappSupport() {
  return (
    <ServicePageTemplate
      slug="chatbot-whatsapp-service-client"
      metaTitle="Chatbot WhatsApp Service Client | IdeaToAutomation"
      metaDescription="Déployez un chatbot WhatsApp pour le service client: réponses instantanées, triage intelligent, escalade agent humain et sync CRM."
      eyebrow="WhatsApp AI Support"
      title="Chatbot WhatsApp pour service client"
      subtitle="Offrez des réponses immédiates 24/7, orientez automatiquement les demandes et escaladez les cas critiques vers la bonne équipe."
      outcomes={['Disponibilité 24/7', 'Taux d auto-résolution en hausse', 'Expérience client plus rapide']}
      stack={['WhatsApp Cloud API', 'n8n', 'LLM', 'CRM', 'Helpdesk', 'Webhook API']}
      painPoints={[
        'Messages clients non centralisés entre email, chat et WhatsApp.',
        'Surcharge des agents humains sur demandes à faible valeur.',
        'Absence de traçabilité complète entre conversation et CRM.',
      ]}
      deliverables={[
        'Playbooks conversationnels alignés sur votre ton de marque.',
        'Détection intention + sentiment + règles d escalade automatique.',
        'Passage fluide bot -> agent humain avec contexte complet.',
      ]}
      timeline={['J+3: design des cas d usage', 'Semaine 2: bot connecté à vos outils', 'Semaine 3-6: optimisation intents + SLA']}
    />
  );
}
