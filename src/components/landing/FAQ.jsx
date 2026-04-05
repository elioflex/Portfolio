import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import RevealWrapper from './RevealWrapper';

const FAQS = [
  {
    q: 'Quel budget faut-il prévoir ?',
    a: 'Chaque projet est sur mesure. Un pilote démarre généralement entre 3 000 € et 10 000 €, selon la complexité. Le diagnostic initial est gratuit et vous permet d\'avoir une estimation précise avant tout engagement.',
  },
  {
    q: 'Combien de temps avant de voir des résultats ?',
    a: 'Le premier pilote est déployé en 2 à 6 semaines. Les résultats sont mesurables dès la mise en production : réduction du temps passé, diminution des erreurs, amélioration des délais.',
  },
  {
    q: 'Est-ce que ça va mobiliser mon équipe en interne ?',
    a: 'Très peu. Nous avons besoin de 2 à 3 entretiens pour comprendre vos processus, puis nous gérons l\'implémentation de bout en bout. Votre équipe est impliquée uniquement pour la validation.',
  },
  {
    q: 'Est-ce compatible avec nos outils existants ?',
    a: 'Oui. Nous travaillons avec votre stack actuel : CRM, ERP, outils de support, bases de données, etc. Nous intégrons les systèmes d\'automatisation dans votre environnement existant, sans tout remplacer.',
  },
  {
    q: 'Quel est le risque si ça ne fonctionne pas ?',
    a: 'Le diagnostic gratuit permet de valider le potentiel avant tout investissement. Si les objectifs ne sont pas atteints pendant le pilote, nous ajustons le système sans surcoût.',
  },
  {
    q: 'Qu\'en est-il de la sécurité de nos données ?',
    a: 'NDA systématique, infrastructure sécurisée, conformité RGPD. Vous gardez la propriété complète de vos données et workflows. Audit de sécurité inclus sur chaque intégration.',
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-32 bg-surface-elevated border-y border-border" aria-label="Questions fréquentes">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealWrapper>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Questions fréquentes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Les réponses aux questions que vous vous posez (probablement).
            </p>
          </div>
        </RevealWrapper>

        <RevealWrapper delay={0.15}>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-xl px-6 bg-background data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </RevealWrapper>
      </div>
    </section>
  );
}