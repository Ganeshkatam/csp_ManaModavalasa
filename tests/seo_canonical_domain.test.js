import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const canonicalOrigin = 'https://manamodavalasa.tomesphere.in';
const legacyOrigin = 'https://manamodavalasa.vercel.app';

test('HTML SEO metadata uses the canonical custom domain', async () => {
  const html = await readFile(new URL('../app/index.html', import.meta.url), 'utf8');
  assert.match(html, new RegExp(`<link rel="canonical" href="${canonicalOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/"`));
  assert.doesNotMatch(html, new RegExp(legacyOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('robots.txt declares the canonical sitemap and no unsupported Host directive', async () => {
  const robots = await readFile(new URL('../app/public/robots.txt', import.meta.url), 'utf8');
  assert.match(robots, new RegExp(`Sitemap: ${canonicalOrigin}/sitemap\\.xml`));
  assert.doesNotMatch(robots, /^Host:/im);
  assert.doesNotMatch(robots, new RegExp(legacyOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('sitemap URLs all use the canonical domain', async () => {
  const sitemap = await readFile(new URL('../app/public/sitemap.xml', import.meta.url), 'utf8');
  assert.match(sitemap, /<loc>https:\/\/manamodavalasa\.tomesphere\.in\//);
  assert.doesNotMatch(sitemap, new RegExp(legacyOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('Vercel permanently redirects the legacy hostname to the canonical domain', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.ok(config.redirects?.some((rule) =>
    rule.permanent === true &&
    rule.destination === `${canonicalOrigin}/$1` &&
    rule.has?.some((condition) => condition.type === 'host' && condition.value === 'manamodavalasa.vercel.app')
  ));
});
