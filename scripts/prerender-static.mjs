import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_PATH = path.join(DIST_DIR, 'index.html');
const ROOT_PLACEHOLDER = '<div id="root"></div>';

const pages = [
  {
    route: '/',
    title: 'IdeaToAutomation — Systèmes IA et automatisation pour équipes en croissance',
    description:
      "IdeaToAutomation conçoit des systèmes d'automatisation sur mesure pour accélérer vos opérations. Moins de travail manuel, moins d'erreurs, une exécution plus rapide.",
    prerenderHtml: `
      <main>
        <section aria-label="Introduction">
          <h1>Réduisez 80% du travail manuel de vos équipes en 6 semaines.</h1>
          <p>Diagnostic 30 minutes offert, plan d'exécution en 72h, pilote en 2 à 6 semaines.</p>
          <p><a href="#contact">Réserver un diagnostic gratuitement</a></p>
        </section>
      </main>
    `,
  },
  {
    route: '/projects',
    title: 'Projects Live — IdeaToAutomation',
    description:
      "Démos live de solutions IA et automatisation: chatbot WhatsApp, support ops, CRM et workflows n8n.",
    prerenderHtml: `
      <main>
        <section aria-label="Projects live">
          <h1>Projects Live</h1>
          <p>Démos interactives de cas d'usage réels: qualification lead, support automatisé, CRM sync.</p>
          <p><a href="/chatbot-live">Voir la démo chatbot WhatsApp</a></p>
        </section>
      </main>
    `,
  },
  {
    route: '/chatbot-live',
    title: 'WhatsApp AI Demo — IdeaToAutomation',
    description:
      'Démo WhatsApp-style: conversations cliquables, scénarios multi-cas et automatisations CRM en temps réel.',
    prerenderHtml: `
      <main>
        <section aria-label="Chatbot live demo">
          <h1>WhatsApp-Style AI Demo</h1>
          <p>Simulez des conversations clients réelles avec routage, scoring et synchronisation CRM automatique.</p>
          <p><a href="/projects">Voir toutes les démos</a></p>
        </section>
      </main>
    `,
  },
  {
    route: '/automatisation-service-client-shopify',
    title: 'Automatisation Service Client Shopify | IdeaToAutomation',
    description:
      'Automatisez votre service client Shopify: triage IA, routage SAV, synchronisation Gorgias/CRM et réduction du temps de réponse.',
    prerenderHtml: `
      <main>
        <section aria-label="Automatisation service client Shopify">
          <h1>Automatisation service client Shopify</h1>
          <p>Triage intelligent, routage SAV et synchronisation CRM pour accélérer votre support e-commerce.</p>
          <p><a href="/#contact">Réserver un diagnostic</a></p>
        </section>
      </main>
    `,
  },
  {
    route: '/automatisation-crm-hubspot',
    title: 'Automatisation CRM HubSpot B2B | IdeaToAutomation',
    description:
      'Automatisation CRM HubSpot pour équipes B2B: qualification lead, scoring, suivi commercial et pipeline à jour.',
    prerenderHtml: `
      <main>
        <section aria-label="Automatisation CRM HubSpot">
          <h1>Automatisation CRM HubSpot pour équipes B2B</h1>
          <p>Qualification des leads, mise à jour automatique du pipeline et relances commerciales structurées.</p>
          <p><a href="/#contact">Réserver un diagnostic</a></p>
        </section>
      </main>
    `,
  },
  {
    route: '/chatbot-whatsapp-service-client',
    title: 'Chatbot WhatsApp Service Client | IdeaToAutomation',
    description:
      'Déployez un chatbot WhatsApp pour le service client: réponses instantanées, triage intelligent et escalade agent humain.',
    prerenderHtml: `
      <main>
        <section aria-label="Chatbot WhatsApp service client">
          <h1>Chatbot WhatsApp pour service client</h1>
          <p>Réponses 24/7, priorisation des demandes et synchronisation CRM en temps réel.</p>
          <p><a href="/chatbot-live">Voir la démonstration</a></p>
        </section>
      </main>
    `,
  },
  {
    route: '/blog',
    title: 'Blog IA & Automatisation | IdeaToAutomation',
    description:
      'Guides pratiques IA, n8n, CRM et support ops pour déployer des automatisations business utiles.',
    prerenderHtml: `
      <main>
        <section aria-label="Blog IA et automatisation">
          <h1>Blog IA & Automatisation</h1>
          <p>Articles pratiques sur n8n, CRM, support client et automatisation opérationnelle.</p>
          <p><a href="/#contact">Parler de votre use case</a></p>
        </section>
      </main>
    `,
  },
];

function escapeAttr(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function withPageMeta(templateHtml, page) {
  const canonical = `https://www.ideatoautomation.com${page.route === '/' ? '/' : page.route}`;
  let html = templateHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(page.title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeAttr(page.description)}" />`,
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonical}" />`,
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeAttr(page.title)}" />`,
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeAttr(page.description)}" />`,
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canonical}" />`,
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeAttr(page.title)}" />`,
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeAttr(page.description)}" />`,
  );

  return html.replace(
    ROOT_PLACEHOLDER,
    `<div id="root" data-prerendered="true">${page.prerenderHtml.trim()}</div>`,
  );
}

async function writePrerenderedPage(templateHtml, page) {
  const outputHtml = withPageMeta(templateHtml, page);

  if (page.route === '/') {
    await writeFile(INDEX_PATH, outputHtml, 'utf8');
    return;
  }

  const routeDir = path.join(DIST_DIR, page.route.replace(/^\//, ''));
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, 'index.html'), outputHtml, 'utf8');
}

async function main() {
  const templateHtml = await readFile(INDEX_PATH, 'utf8');

  if (!templateHtml.includes(ROOT_PLACEHOLDER)) {
    throw new Error('Unable to prerender: root placeholder not found in dist/index.html');
  }

  for (const page of pages) {
    await writePrerenderedPage(templateHtml, page);
  }

  console.log('Prerender complete for routes:', pages.map((page) => page.route).join(', '));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
