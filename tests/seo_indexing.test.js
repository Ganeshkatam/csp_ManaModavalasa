import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    BASE_PRODUCTION_URL,
    ROUTE_SEO_CATALOG,
    normalizeCanonicalPath,
    buildCanonicalUrls,
    resolveRouteMetadata
} from '../app/src/utils/seo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sitemapPath = path.join(rootDir, 'app', 'public', 'sitemap.xml');
const robotsPath = path.join(rootDir, 'app', 'public', 'robots.txt');
const indexHtmlPath = path.join(rootDir, 'app', 'index.html');

test('normalizeCanonicalPath normalizes paths consistently without trailing slashes', () => {
    assert.equal(normalizeCanonicalPath(''), '/');
    assert.equal(normalizeCanonicalPath('/'), '/');
    assert.equal(normalizeCanonicalPath('/schemes'), '/schemes');
    assert.equal(normalizeCanonicalPath('/schemes/'), '/schemes');
    assert.equal(normalizeCanonicalPath('/schemes/pm-kisan/'), '/schemes/pm-kisan');
});

test('buildCanonicalUrls constructs valid absolute canonical and hreflang URLs', () => {
    const homeUrls = buildCanonicalUrls('/');
    assert.equal(homeUrls.canonical, 'https://manamodavalasa.vercel.app/');
    assert.equal(homeUrls.en, 'https://manamodavalasa.vercel.app/?lang=en');
    assert.equal(homeUrls.te, 'https://manamodavalasa.vercel.app/?lang=te');
    assert.equal(homeUrls.xDefault, 'https://manamodavalasa.vercel.app/');

    const schemesUrls = buildCanonicalUrls('/schemes');
    assert.equal(schemesUrls.canonical, 'https://manamodavalasa.vercel.app/schemes');
    assert.equal(schemesUrls.en, 'https://manamodavalasa.vercel.app/schemes?lang=en');
    assert.equal(schemesUrls.te, 'https://manamodavalasa.vercel.app/schemes?lang=te');
    assert.equal(schemesUrls.xDefault, 'https://manamodavalasa.vercel.app/schemes');

    const detailUrls = buildCanonicalUrls('/schemes/pm-kisan');
    assert.equal(detailUrls.canonical, 'https://manamodavalasa.vercel.app/schemes/pm-kisan');
    assert.equal(detailUrls.en, 'https://manamodavalasa.vercel.app/schemes/pm-kisan?lang=en');
    assert.equal(detailUrls.te, 'https://manamodavalasa.vercel.app/schemes/pm-kisan?lang=te');
    assert.equal(detailUrls.xDefault, 'https://manamodavalasa.vercel.app/schemes/pm-kisan');
});

test('resolveRouteMetadata provides distinct titles and descriptions for all defined routes in both languages', () => {
    const verifiedPublicRoutes = [
        '/',
        '/schemes',
        '/contacts',
        '/announcements',
        '/healthcare',
        '/education',
        '/businesses',
        '/village',
        '/about',
        '/feedback',
        '/search',
        '/survey',
        '/dashboard'
    ];

    for (const route of verifiedPublicRoutes) {
        const enMeta = resolveRouteMetadata(route, 'en');
        const teMeta = resolveRouteMetadata(route, 'te');

        assert.ok(enMeta.title, `Missing English title for route ${route}`);
        assert.ok(enMeta.description, `Missing English description for route ${route}`);
        assert.ok(teMeta.title, `Missing Telugu title for route ${route}`);
        assert.ok(teMeta.description, `Missing Telugu description for route ${route}`);

        assert.notEqual(enMeta.title, teMeta.title, `English and Telugu titles must be distinct for route ${route}`);
        assert.ok(enMeta.title.includes('ManaModavalasa'), `English title for ${route} must contain ManaModavalasa`);
        assert.ok(teMeta.title.includes('మన మోదవలస'), `Telugu title for ${route} must contain మన మోదవలస`);
    }
});

test('sitemap.xml contains all 13 verified public routes with valid hreflang entries', () => {
    assert.ok(fs.existsSync(sitemapPath), 'sitemap.xml must exist in app/public/');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');

    const expectedRoutes = [
        'https://manamodavalasa.vercel.app/',
        'https://manamodavalasa.vercel.app/schemes',
        'https://manamodavalasa.vercel.app/contacts',
        'https://manamodavalasa.vercel.app/announcements',
        'https://manamodavalasa.vercel.app/healthcare',
        'https://manamodavalasa.vercel.app/education',
        'https://manamodavalasa.vercel.app/businesses',
        'https://manamodavalasa.vercel.app/village',
        'https://manamodavalasa.vercel.app/about',
        'https://manamodavalasa.vercel.app/feedback',
        'https://manamodavalasa.vercel.app/search',
        'https://manamodavalasa.vercel.app/survey',
        'https://manamodavalasa.vercel.app/dashboard'
    ];

    for (const route of expectedRoutes) {
        assert.ok(sitemapContent.includes(`<loc>${route}</loc>`), `sitemap.xml must include <loc>${route}</loc>`);
        
        // Every route must have en, te, and x-default alternate links
        const pathSuffix = route === 'https://manamodavalasa.vercel.app/' ? '/' : route.replace('https://manamodavalasa.vercel.app', '');
        const expectedEn = `hreflang="en" href="https://manamodavalasa.vercel.app${pathSuffix}?lang=en"`;
        const expectedTe = `hreflang="te" href="https://manamodavalasa.vercel.app${pathSuffix}?lang=te"`;
        const expectedDefault = `hreflang="x-default" href="${route}"`;

        assert.ok(sitemapContent.includes(expectedEn), `sitemap.xml must include alternate en for ${route}`);
        assert.ok(sitemapContent.includes(expectedTe), `sitemap.xml must include alternate te for ${route}`);
        assert.ok(sitemapContent.includes(expectedDefault), `sitemap.xml must include alternate x-default for ${route}`);
    }
});

test('robots.txt explicitly permits all public routes and declares sitemap', () => {
    assert.ok(fs.existsSync(robotsPath), 'robots.txt must exist in app/public/');
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');

    const requiredAllowDirectives = [
        'Allow: /',
        'Allow: /schemes',
        'Allow: /contacts',
        'Allow: /healthcare',
        'Allow: /education',
        'Allow: /businesses',
        'Allow: /announcements',
        'Allow: /village',
        'Allow: /about',
        'Allow: /feedback',
        'Allow: /search',
        'Allow: /survey',
        'Allow: /dashboard'
    ];

    for (const directive of requiredAllowDirectives) {
        assert.ok(robotsContent.includes(directive), `robots.txt must include "${directive}"`);
    }

    assert.ok(robotsContent.includes('Disallow: /admin'), 'robots.txt must disallow /admin');
    assert.ok(robotsContent.includes('Disallow: /api/'), 'robots.txt must disallow /api/');
    assert.ok(robotsContent.includes('Sitemap: https://manamodavalasa.vercel.app/sitemap.xml'), 'robots.txt must declare sitemap URL');
    assert.ok(robotsContent.includes('Host: https://manamodavalasa.vercel.app'), 'robots.txt must declare Host');
});

test('index.html contains targetable canonical and hreflang link tags', () => {
    assert.ok(fs.existsSync(indexHtmlPath), 'index.html must exist in app/');
    const htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

    assert.ok(htmlContent.includes('id="canonical-link"'), 'index.html must contain id="canonical-link" for runtime reconciliation');
    assert.ok(htmlContent.includes('id="hreflang-en"'), 'index.html must contain id="hreflang-en"');
    assert.ok(htmlContent.includes('id="hreflang-te"'), 'index.html must contain id="hreflang-te"');
    assert.ok(htmlContent.includes('id="hreflang-default"'), 'index.html must contain id="hreflang-default"');
});

test('strictly zero emojis in SEO utility catalog, sitemap, and robots configurations', () => {
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

    const seoJsContent = fs.readFileSync(path.join(rootDir, 'app', 'src', 'utils', 'seo.js'), 'utf-8');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');

    assert.ok(!emojiRegex.test(seoJsContent), 'app/src/utils/seo.js must contain zero emojis');
    assert.ok(!emojiRegex.test(sitemapContent), 'app/public/sitemap.xml must contain zero emojis');
    assert.ok(!emojiRegex.test(robotsContent), 'app/public/robots.txt must contain zero emojis');
});

