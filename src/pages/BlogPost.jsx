import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Calendar, Home, Mail, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlogPostBySlug } from '@/lib/blog';
import { applySeo } from '@/lib/seo';
import { useParams } from 'react-router-dom';
import PageNotFound from '@/lib/PageNotFound';

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

function excerptFromMarkdown(markdown = '') {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/[#>*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 170);
}

export default function BlogPost() {
  const { slug = '' } = useParams();
  const post = getBlogPostBySlug(slug);

  useEffect(() => {
    if (!post) return;

    applySeo({
      title: `${post.title} | IdeaToAutomation`,
      description: post.description || excerptFromMarkdown(post.content),
      path: `/blog/${post.slug}`,
    });
  }, [post]);

  if (!post) {
    return <PageNotFound />;
  }

  return (
    <div className="min-h-screen bg-[#081018] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#081018]/85 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2" aria-label="IdeaToAutomation accueil">
            <img src="/assets/logo/logo-primary-light.svg" alt="IdeaToAutomation" className="h-8 w-auto" />
          </a>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="rounded-full border-white/20 text-slate-200 hover:bg-white/10">
              <a href="/blog">Blog</a>
            </Button>
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
        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e1b25] via-[#0e1720] to-[#123027] p-8 lg:p-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              {post.title}
            </h1>
            {post.description ? <p className="mt-4 text-slate-300 text-lg">{post.description}</p> : null}

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              {post.date ? (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.date)}
                </span>
              ) : null}
              {post.tags.length > 0 ? (
                <span className="inline-flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {post.tags.join(', ')}
                </span>
              ) : null}
            </div>
          </header>

          <section className="mt-8 rounded-3xl border border-white/10 bg-[#0f1a25] p-6 sm:p-8 lg:p-10">
            <div className="max-w-none text-slate-200 leading-8 space-y-6">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-2 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-bold text-white mt-8 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h3>,
                  p: ({ children }) => <p className="text-base text-slate-200 leading-8 mb-4">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-4">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-4">{children}</ol>,
                  li: ({ children }) => <li className="text-slate-200">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-emerald-400/60 pl-4 italic text-slate-300 my-4">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="text-emerald-300 underline underline-offset-4 hover:text-emerald-200">
                      {children}
                    </a>
                  ),
                  code: ({ inline, children }) =>
                    inline ? (
                      <code className="rounded bg-[#1a2a36] px-1.5 py-0.5 text-sm text-emerald-200">{children}</code>
                    ) : (
                      <code className="block overflow-x-auto rounded-xl bg-[#0b141a] p-4 text-sm text-slate-100">
                        {children}
                      </code>
                    ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
