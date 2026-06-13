#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://elevares.ca';
const ROOT = process.cwd();
const OUTPUTS = [path.join(ROOT, 'sitemap.xml'), path.join(ROOT, 'public', 'sitemap.xml')];
const EXCLUDE = new Set(['html/404.html', 'html/sign-in.html', 'html/sign-up.html', 'thank-you.html']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    const rel = path.relative(ROOT, fullPath).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (['.git', 'node_modules', 'libs', 'public'].includes(entry.name)) return [];
      return walk(fullPath);
    }
    return entry.isFile() && entry.name.endsWith('.html') ? [rel] : [];
  });
}

function routeFor(file) {
  if (file === 'index.html' || file === 'html/index.html') return '/';
  if (!file.includes('/') && file.endsWith('.html')) return `/${file.replace(/\.html$/, '')}`;
  return `/${file}`;
}

function priorityFor(route) {
  if (route === '/') return '1.0';
  if (route.includes('contact') || route.includes('about')) return '0.8';
  if (route.includes('project')) return '0.7';
  return '0.5';
}

function changefreqFor(route) {
  if (route === '/' || route.includes('project')) return 'monthly';
  return 'yearly';
}

const routes = [...new Set(walk(ROOT)
  .filter((file) => !EXCLUDE.has(file))
  .map(routeFor))]
  .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));

const lastmod = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map((route) => `  <url>\n` +
    `    <loc>${SITE_URL}${route === '/' ? '/' : route}</loc>\n` +
    `    <lastmod>${lastmod}</lastmod>\n` +
    `    <changefreq>${changefreqFor(route)}</changefreq>\n` +
    `    <priority>${priorityFor(route)}</priority>\n` +
    `  </url>`).join('\n') +
  `\n</urlset>\n`;

fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true });
for (const output of OUTPUTS) fs.writeFileSync(output, xml);
console.log(`Generated ${routes.length} sitemap route(s): ${OUTPUTS.map((o) => path.relative(ROOT, o)).join(', ')}`);
