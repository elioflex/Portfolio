import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';

const NAV_LINKS = [
  { label: 'Offres', href: '#offres' },
  { label: 'Cas clients', href: '#cas-clients' },
  { label: 'Méthode', href: '#methode' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleNavClick = (label, href, area) => {
    setOpen(false);
    trackEvent('nav_click', { label, href, area });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-xl shadow-sm border-b border-border'
          : 'bg-transparent'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 group"
            aria-label="IdeaToAutomation - Accueil"
            onClick={() => trackEvent('nav_click', { label: 'logo', href: '#', area: 'header' })}
          >
            <img
              src="/assets/logo/logo-primary-light.svg"
              alt="IdeaToAutomation"
              className="h-8 w-auto"
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => trackEvent('nav_click', { label: link.label, href: link.href, area: 'desktop_menu' })}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button asChild size="sm" className="rounded-full px-6 font-semibold">
              <a
                href="#contact"
                onClick={() => trackEvent('cta_click', { placement: 'header_desktop', cta_text: 'book_diagnostic' })}
              >
                Réserver un diagnostic
              </a>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 -mr-2 text-foreground"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-0 top-16 bg-background z-40 transition-all duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col px-6 pt-8 gap-1" aria-label="Navigation mobile">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.label, link.href, 'mobile_menu')}
              className="text-lg font-medium text-foreground py-3 border-b border-border"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-6">
            <Button asChild className="w-full rounded-full font-semibold" size="lg">
              <a
                href="#contact"
                onClick={() => {
                  setOpen(false);
                  trackEvent('cta_click', { placement: 'header_mobile', cta_text: 'book_diagnostic' });
                }}
              >
                Réserver un diagnostic
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
