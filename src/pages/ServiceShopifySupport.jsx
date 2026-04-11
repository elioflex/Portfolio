import React from 'react';
import ServicePageTemplate from '@/components/seo/ServicePageTemplate';

export default function ServiceShopifySupport() {
  return (
    <ServicePageTemplate
      slug="automatisation-service-client-shopify"
      metaTitle="Automatisation Service Client Shopify | IdeaToAutomation"
      metaDescription="Automatisez votre service client Shopify: triage IA, routage SAV, synchronisation Gorgias/CRM et réduction du temps de réponse en quelques semaines."
      eyebrow="E-commerce Support Ops"
      title="Automatisation service client Shopify"
      subtitle="Réduisez les tickets manuels et accélérez vos réponses clients avec un système IA branché sur Shopify, Gorgias et votre CRM."
      outcomes={['Temps de réponse ÷ 3', 'Volume traité x2', 'Escalade VIP automatique']}
      stack={['Shopify', 'n8n', 'Gorgias', 'Klaviyo', 'HubSpot', 'Slack']}
      painPoints={[
        'Trop de tickets SAV répétés et faible priorisation des urgences.',
        'Retards de traitement sur retours, remboursements et demandes livraison.',
        'Perte de contexte client entre support, CRM et équipe ops.',
      ]}
      deliverables={[
        'Classification IA des tickets (livraison, retour, remboursement, VIP).',
        'Routage intelligent par SLA, langue, segment client et valeur panier.',
        'Réponses suggérées + synchronisation CRM en temps réel.',
      ]}
      timeline={['J+3: audit + process map', 'Semaine 2: déploiement du pilote', 'Semaine 3-6: optimisation KPI + handover']}
    />
  );
}
