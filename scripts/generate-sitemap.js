#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.elevares.ca';
const ROOT = process.cwd();
const OUTPUTS = [path.join(ROOT, 'sitemap.xml'), path.join(ROOT, 'public', 'sitemap.xml')];
const ROUTES = [
  '/',
  '/about-us',
  '/portfolio',
  '/contact',
  '/blog',
  '/rms-measurement-calgary',
  '/360-virtual-tours-calgary',
  '/real-estate-floor-plans-calgary',
  '/virtual-staging-calgary',
  '/blog/rms-measurement-calgary-real-estate-listings',
  '/html/privacy-policy',
  '/html/terms-and-conditions',
];
const lastmod = new Date().toISOString().slice(0, 10);

const urls = ROUTES.map((route) => {
  const changefreq = route === '/' || route === '/blog' ? 'weekly' : 'monthly';
  const priority = route === '/' ? '1.0' : route.includes('calgary') ? '0.9' : '0.7';
  return `  <url>\n    <loc>${SITE_URL}${route === '/' ? '/' : route}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true });
for (const output of OUTPUTS) fs.writeFileSync(output, xml);
console.log(`Generated ${ROUTES.length} sitemap route(s): ${OUTPUTS.map((o) => path.relative(ROOT, o)).join(', ')}`);
