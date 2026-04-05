import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Clock, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import RevealWrapper from './RevealWrapper';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', objective: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLoading(false);
    setSubmitted(true);
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
                  Merci {form.name}. Nous revenons vers vous sous 24h ouvrables avec un créneau de diagnostic.
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

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
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