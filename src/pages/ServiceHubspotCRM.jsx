import React from 'react';
import ServicePageTemplate from '@/components/seo/ServicePageTemplate';

export default function ServiceHubspotCRM() {
  return (
    <ServicePageTemplate
      slug="automatisation-crm-hubspot"
      metaTitle="Automatisation CRM HubSpot B2B | IdeaToAutomation"
      metaDescription="Automatisation CRM HubSpot pour équipes B2B: qualification lead, scoring, suivi commercial et pipeline toujours à jour."
      eyebrow="B2B Sales Ops"
      title="Automatisation CRM HubSpot pour équipes B2B"
      subtitle="Construisez un pipeline commercial propre et réactif: qualification automatique, relances orchestrées et synchronisation de chaque interaction."
      outcomes={['Réponse lead < 5 min', 'Mises à jour CRM automatiques', 'Follow-ups non oubliés']}
      stack={['HubSpot', 'n8n', 'Calendly', 'Google Sheets', 'Slack', 'Email API']}
      painPoints={[
        'Leads non traités assez vite après formulaire ou prise de contact.',
        'Pipeline incomplet et actions commerciales non standardisées.',
        'Reporting manuel chronophage et manque de visibilité manager.',
      ]}
      deliverables={[
        'Qualification + scoring automatisé des leads entrants.',
        'Création et mise à jour automatique des contacts, deals et tâches HubSpot.',
        'Séquences de relance multi-étapes selon intent et maturité.',
      ]}
      timeline={['J+3: audit funnel + CRM', 'Semaine 2: flows de qualification et routage', 'Semaine 3-6: optimisation conversion + dashboard']}
    />
  );
}
