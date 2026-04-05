import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Clock, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { trackEvent } from '@/lib/analytics';
import RevealWrapper from './RevealWrapper';

const WEBHOOK_TIMEOUT_MS = 15000;

function getTrackingParams() {
  const params = new URLSearchParams(window.location.search);
  const tracking = {};

  for (const [key, value] of params.entries()) {
    if (
      key.startsWith('utm_')
      || key === 'gclid'
      || key === 'fbclid'
      || key === 'msclkid'
      || key === 'ttclid'
      || key === 'li_fat_id'
    ) {
      tracking[key] = value;
    }
  }

  return tracking;
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', objective: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    trackEvent('lead_submit_attempt', { form: 'contact' });

    setSubmitError('');
    setLoading(true);

    try {
      const webhookUrl = import.meta.env.VITE_LEAD_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error('Webhook non configuré. Ajoutez VITE_LEAD_WEBHOOK_URL.');
      }

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

      const payload = {
        ...form,
        page_url: window.location.href,
        page_path: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        locale: navigator.language,
        tracking: getTrackingParams(),
        created_at: new Date().toISOString(),
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      window.clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(errorText || `Webhook error (${response.status})`);
      }

      setSubmittedName(form.name);
      setSubmitted(true);
      setForm({ name: '', email: '', objective: '' });
      trackEvent('lead_submit_success', { form: 'contact' });
    } catch (error) {
      const isTimeout = error?.name === 'AbortError';
      setSubmitError(
        isTimeout
          ? 'Le serveur met trop de temps à répondre. Réessayez dans quelques secondes.'
          : 'Impossible d’envoyer votre demande pour le moment. Écrivez-nous à contact@ideatoautomation.com.'
      );
      trackEvent('lead_submit_error', {
        form: 'contact',
        reason: isTimeout ? 'timeout' : 'request_error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-32" aria-label="Contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left */}
          <RevealWrapper>
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                Prêt à éliminer le travail manuel ?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Réservez un diagnostic gratuit de 30 minutes. Pas d'engagement, pas de pitch commercial — juste une analyse concrète de vos processus.
              </p>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">30 minutes, pas plus</p>
                    <p className="text-sm text-muted-foreground">On va droit au but.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">100% confidentiel</p>
                    <p className="text-sm text-muted-foreground">NDA disponible avant l'appel si nécessaire.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Plan d'action en 72h</p>
                    <p className="text-sm text-muted-foreground">Vous repartez avec un livrable concret.</p>
                  </div>
                </li>
              </ul>
            </div>
          </RevealWrapper>

          {/* Right - Form */}
          <RevealWrapper delay={0.15}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-2xl border border-border bg-surface-elevated">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Demande envoyée !</h3>
                <p className="mt-3 text-muted-foreground max-w-sm">
                  Merci {submittedName || 'à vous'}. Nous revenons vers vous sous 24h ouvrables avec un créneau de diagnostic.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 rounded-2xl border border-border bg-background shadow-sm"
              >
                <h3 className="text-xl font-bold text-foreground mb-6">
                  Réserver votre diagnostic gratuit
                </h3>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Nom complet</Label>
                    <Input
                      id="name"
                      required
                      placeholder="Jean Dupont"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email professionnel</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="jean@entreprise.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="objective" className="text-sm font-medium">Votre objectif principal</Label>
                    <Textarea
                      id="objective"
                      required
                      placeholder="Ex : Automatiser l'onboarding client, réduire le temps de traitement des commandes..."
                      value={form.objective}
                      onChange={(e) => setForm({ ...form, objective: e.target.value })}
                      className="mt-1.5 h-24 resize-none"
                    />
                  </div>
                </div>

                {submitError && (
                  <p className="mt-5 text-sm text-destructive" role="alert">
                    {submitError}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  aria-busy={loading}
                  className="w-full rounded-full font-semibold mt-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Réserver un diagnostic
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="mt-4 text-xs text-center text-muted-foreground">
                  Réponse sous 24h ouvrables. Aucun engagement.
                </p>
              </form>
            )}
          </RevealWrapper>
        </div>
      </div>
    </section>
  );
}
