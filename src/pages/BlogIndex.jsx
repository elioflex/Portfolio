import React, { useEffect } from 'react';
import { ArrowRight, Calendar, Home, Mail, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllBlogPosts } from '@/lib/blog';
import { applySeo } from '@/lib/seo';

function formatDate(dateValue) {
  if (!dateValue) return null;
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

export default function BlogIndex() {
  const posts = getAllBlogPosts();

  useEffect(() => {
    applySeo({
      title: 'Blog IA & Automatisation | IdeaToAutomation',
      description:
        'Guides pratiques IA, n8n, CRM et support ops pour déployer des automatisations business utiles.',
      path: '/blog',
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#081018] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#081018]/85 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2" aria-label="IdeaToAutomation accueil">
            <img src="/assets/logo/logo-primary-light.svg" alt="IdeaToAutomation" className="h-8 w-auto" />
          </a>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="rounded-full border-white/20 text-slate-200 hover:bg-white/10">
              <a href="/">
                <Home className="w-4 h-4" />
                Accueil
              </a>
            </Button>
            <Button asChild size="sm" className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#05211b]">
              <a href="mailto:contact@ideatoautomation.com">
                <Mail className="w-4 h-4" />
                Contact
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="py-10 lg:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e1b25] via-[#0e1720] to-[#123027] p-8 lg:p-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Blog IA & Automatisation
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl">
              Articles concrets pour déployer des workflows n8n, automatiser CRM/support et améliorer vos opérations.
            </p>
          </section>

          <section className="mt-8">
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#0f1a25] p-8 text-center">
                <p className="text-slate-300">Aucun article publié pour le moment.</p>
                <p className="mt-2 text-sm text-slate-400">
                  Les nouveaux articles générés par n8n apparaîtront automatiquement ici.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {posts.map((post) => (
                  <article key={post.slug} className="rounded-2xl border border-white/10 bg-[#0f1a25] p-6">
                    <a href={`/blog/${post.slug}`} className="group block">
                      <h2 className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors">
                        {post.title}
                      </h2>
                      {post.description ? (
                        <p className="mt-3 text-slate-300">{post.description}</p>
                      ) : null}
                    </a>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      {post.date ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(post.date)}
                        </span>
                      ) : null}
                      {post.tags.length > 0 ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          {post.tags.join(', ')}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-5">
                      <Button asChild variant="outline" className="rounded-full border-white/20 text-slate-100 hover:bg-white/10">
                        <a href={`/blog/${post.slug}`}>
                          Lire l'article
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
