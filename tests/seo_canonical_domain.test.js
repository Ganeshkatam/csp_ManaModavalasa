import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const canonicalOrigin = 'https://manamodavalasa.vercel.app';
const previousOrigin = 'https://manamodavalasa.tomesphere.in';

test('HTML SEO metadata uses the canonical Vercel domain', async () => {
  const html = await readFile(new URL('../app/index.html', import.meta.url), 'utf8');
  assert.match(html, new RegExp(`<link rel="canonical" href="${canonicalOrigin.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}/"`));
  assert.doesNotMatch(html, new RegExp(previousOrigin.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')));
});

test('robots.txt declares the canonical sitemap and no unsupported Host directive', async () => {
  const robots = await readFile(new URL('../app/public/robots.txt', import.meta.url), 'utf8');
  assert.match(robots, new RegExp(`Sitemap: ${canonicalOrigin}/sitemap\\\\.xml`));
  assert.doesNotMatch(robots, /^Host:/im);
  assert.doesNotMatch(robots, new RegExp(previousOrigin.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')));
});

test('sitemap URLs all use the canonical Vercel domain', async () => {
  const sitemap = await readFile(new URL('../app/public/sitemap.xml', import.meta.url), 'utf8');
  assert.match(sitemap, /<loc>https:\\/\\/manamodavalasa\\.vercel\\.app\\//);
  assert.doesNotMatch(sitemap, new RegExp(previousOrigin.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')));
});

test('Vercel does not redirect the primary Vercel hostname away from itself', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.equal(config.redirects?.some((rule) =>
    rule.has?.some((condition) => condition.type === 'host' && condition.value === 'manamodavalasa.vercel.app') &&
    rule.destination?.startsWith(previousOrigin)
  ) ?? false, false);
});
