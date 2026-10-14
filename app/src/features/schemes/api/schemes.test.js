import test from 'node:test';
import assert from 'node:assert';
import { generateSlug, getAllSchemes, getSchemeBySlugOrId } from './schemes.js';

test('generateSlug converts scheme name to url-friendly slug', () => {
    assert.strictEqual(
        generateSlug('Talliki Vandanam Scheme (formerly Jagananna Amma Vodi)'),
        'talliki-vandanam-scheme-formerly-jagananna-amma-vodi'
    );
    assert.strictEqual(
        generateSlug('Post-Matric Fee Reimbursement & Vasathi Deevena'),
        'post-matric-fee-reimbursement-vasathi-deevena'
    );
    assert.strictEqual(generateSlug(''), '');
    assert.strictEqual(generateSlug(null), '');
});

test('getSchemeBySlugOrId returns null for empty or null identifier', async () => {
    const resEmpty = await getSchemeBySlugOrId('');
    assert.strictEqual(resEmpty, null);

    const resNull = await getSchemeBySlugOrId(null);
    assert.strictEqual(resNull, null);
});

test('getAllSchemes handles unconfigured client gracefully without throwing', async () => {
    const results = await getAllSchemes({ category: 'Education', search: 'Vidya' });
    assert.ok(Array.isArray(results));
});

test('getSchemeBySlugOrId handles UUID lookup gracefully without throwing', async () => {
    const result = await getSchemeBySlugOrId('814e720a-d4ad-482b-9c37-f8fcf324c7e6');
    assert.strictEqual(result, null);
});

test('getSchemeBySlugOrId handles slug lookup gracefully without throwing', async () => {
    const result = await getSchemeBySlugOrId('talliki-vandanam-scheme');
    assert.strictEqual(result, null);
});

