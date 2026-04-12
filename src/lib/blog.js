const blogModules = import.meta.glob('/content/blog/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

function stripQuotes(value) {
  if (!value) return value;
  if (
    (value.startsWith('"') && value.endsWith('"'))
    || (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function parseArrayValue(value) {
  const inner = value.slice(1, -1).trim();
  if (!inner) return [];
  return inner
    .split(',')
    .map((item) => stripQuotes(item.trim()))
    .filter(Boolean);
}

function parseFrontmatterValue(key, rawValue) {
  const value = rawValue.trim();
  if (!value) return '';

  if (value === 'true') return true;
  if (value === 'false') return false;

  if (value.startsWith('[') && value.endsWith(']')) {
    return parseArrayValue(value);
  }

  if ((key === 'tags' || key === 'keywords') && value.includes(',')) {
    return value
      .split(',')
      .map((item) => stripQuotes(item.trim()))
      .filter(Boolean);
  }

  return stripQuotes(value);
}

function parseFrontmatter(rawMarkdown) {
  const match = rawMarkdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { frontmatter: {}, content: rawMarkdown.trim() };
  }

  const rawFrontmatter = match[1];
  const content = rawMarkdown.slice(match[0].length).trim();
  const frontmatter = {};
  let currentListKey = null;

  rawFrontmatter.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    if (trimmed.startsWith('- ') && currentListKey) {
      const item = stripQuotes(trimmed.slice(2).trim());
      if (item) {
        frontmatter[currentListKey].push(item);
      }
      return;
    }

    const separatorIndex = trimmed.indexOf(':');
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1);

    if (!rawValue.trim() && (key === 'tags' || key === 'keywords')) {
      frontmatter[key] = [];
      currentListKey = key;
      return;
    }

    currentListKey = null;
    frontmatter[key] = parseFrontmatterValue(key, rawValue);
  });

  return { frontmatter, content };
}

function normalizeSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function slugFromFilePath(filePath) {
  const fileName = filePath.split('/').pop() || '';
  const stem = fileName.replace(/\.md$/i, '');
  return stem.replace(/^\d{8,14}-/, '');
}

function toTimestampForSort(value) {
  if (!value) return 0;
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

const allBlogPosts = Object.entries(blogModules)
  .map(([filePath, rawMarkdown]) => {
    const { frontmatter, content } = parseFrontmatter(rawMarkdown);
    const fallbackSlug = normalizeSlug(slugFromFilePath(filePath));
    const resolvedSlug = normalizeSlug(frontmatter.slug || fallbackSlug);

    const tags = Array.isArray(frontmatter.tags)
      ? frontmatter.tags
      : typeof frontmatter.tags === 'string' && frontmatter.tags
      ? [frontmatter.tags]
      : [];

    const keywords = Array.isArray(frontmatter.keywords)
      ? frontmatter.keywords
      : typeof frontmatter.keywords === 'string' && frontmatter.keywords
      ? [frontmatter.keywords]
      : [];

    return {
      filePath,
      slug: resolvedSlug,
      title: frontmatter.title || fallbackSlug || 'Article',
      description: frontmatter.description || '',
      date: frontmatter.date || '',
      tags,
      keywords,
      draft: frontmatter.draft === true,
      content,
      frontmatter,
    };
  })
  .filter((post) => Boolean(post.slug))
  .sort((a, b) => {
    const dateDiff = toTimestampForSort(b.date) - toTimestampForSort(a.date);
    if (dateDiff !== 0) return dateDiff;
    return a.filePath < b.filePath ? 1 : -1;
  });

const publishedBlogPosts = allBlogPosts.filter((post) => !post.draft);

const blogPostBySlug = publishedBlogPosts.reduce((map, post) => {
  if (!map.has(post.slug)) {
    map.set(post.slug, post);
  }
  return map;
}, new Map());

export function getAllBlogPosts() {
  return publishedBlogPosts;
}

export function getBlogPostBySlug(slug) {
  const normalized = normalizeSlug(slug);
  return blogPostBySlug.get(normalized) || null;
}
