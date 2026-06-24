#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.elevares.ca';
const ROOT = process.cwd();
const OUTPUTS = [path.join(ROOT, 'sitemap.xml'), path.join(ROOT, 'public', 'sitemap.xml')];

// Include only final, indexable, live 200-status routes. Do not include redirecting routes, duplicate page copies, or temporary pages.
const ROUTES = [
  { route: '/', changefreq: 'weekly', priority: '1.0' },
  { route: '/rms-measurement-calgary', changefreq: 'monthly', priority: '0.9' },
  { route: '/blog', changefreq: 'weekly', priority: '0.8' },
  { route: '/blog/rms-measurement-calgary-real-estate-listings', changefreq: 'monthly', priority: '0.8' },
  { route: '/html/about-us', changefreq: 'yearly', priority: '0.6' },
  { route: '/html/contact', changefreq: 'yearly', priority: '0.6' },
  { route: '/html/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { route: '/html/terms-and-conditions', changefreq: 'yearly', priority: '0.3' },
];

const lastmod = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ROUTES.map(({ route, changefreq, priority }) => `  <url>\n` +
    `    <loc>${SITE_URL}${route === '/' ? '/' : route}</loc>\n` +
    `    <lastmod>${lastmod}</lastmod>\n` +
    `    <changefreq>${changefreq}</changefreq>\n` +
    `    <priority>${priority}</priority>\n` +
    `  </url>`).join('\n') +
  `\n</urlset>\n`;

fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true });
for (const output of OUTPUTS) fs.writeFileSync(output, xml);
console.log(`Generated ${ROUTES.length} sitemap route(s): ${OUTPUTS.map((o) => path.relative(ROOT, o)).join(', ')}`);
