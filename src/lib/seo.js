const SITE_URL = 'https://www.ideatoautomation.com';

function upsertMeta(selector, createAttrs, content) {
  let node = document.head.querySelector(selector);

  if (!node) {
    node = document.createElement('meta');
    Object.entries(createAttrs).forEach(([key, value]) => {
      node.setAttribute(key, value);
    });
    document.head.appendChild(node);
  }

  node.setAttribute('content', content);
}

function upsertCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', url);
}

export function applySeo({ title, description, path }) {
  if (typeof document === 'undefined') return;

  const canonicalPath = path?.startsWith('/') ? path : '/';
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  document.title = title;

  upsertMeta('meta[name="description"]', { name: 'description' }, description);
  upsertMeta('meta[property="og:title"]', { property: 'og:title' }, title);
  upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description);
  upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl);
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description);

  upsertCanonical(canonicalUrl);
}
