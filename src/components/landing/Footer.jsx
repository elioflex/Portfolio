import React from 'react';
import { trackEvent } from '@/lib/analytics';

const QUICK_LINKS = [
  { label: 'Offres', href: '#offres' },
  { label: 'Méthode', href: '#methode' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const SEO_PAGES = [
  { label: 'Automatisation service client Shopify', href: '/automatisation-service-client-shopify' },
  { label: 'Automatisation CRM HubSpot', href: '/automatisation-crm-hubspot' },
  { label: 'Chatbot WhatsApp service client', href: '/chatbot-whatsapp-service-client' },
];

const LEGAL_LINKS = [
  { label: 'Mentions légales', href: '#' },
  { label: 'Politique de confidentialité', href: '#' },
  { label: 'CGV', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-surface-dark text-surface-dark-foreground border-t border-white/10" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <a href="#" className="flex items-center gap-2" aria-label="IdeaToAutomation">
              <img
                src="/assets/logo/logo-primary-light.svg"
                alt="IdeaToAutomation"
                className="h-8 w-auto"
              />
            </a>
            <p className="mt-4 text-sm opacity-60 leading-relaxed max-w-xs">
              Systèmes d'automatisation sur mesure pour les équipes en croissance. Moins de travail manuel, plus d'impact.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-50">Navigation</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-semibold uppercase tracking-wider mt-8 mb-4 opacity-50">Solutions</h4>
            <ul className="space-y-2.5">
              {SEO_PAGES.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-50">Contact</h4>
            <a
              href="mailto:contact@ideatoautomation.com"
              onClick={() => trackEvent('contact_click', { channel: 'email_footer' })}
              className="text-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              contact@ideatoautomation.com
            </a>

            <h4 className="text-sm font-semibold uppercase tracking-wider mt-8 mb-4 opacity-50">Légal</h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm opacity-40">
            © {new Date().getFullYear()} IdeaToAutomation. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
