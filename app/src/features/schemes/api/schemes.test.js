import test from 'node:test';
import assert from 'node:assert';
import { generateSlug, getAllSchemes, getSchemeBySlugOrId, findBestSchemeMatch } from './schemes.js';

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

test('findBestSchemeMatch resolves full and partial slugs correctly', () => {
    const mockSchemes = [
        { id: '1', name: 'Dr. NTR Vaidya Seva Health Scheme' },
        { id: '2', name: 'Talliki Vandanam Scheme (formerly Jagananna Amma Vodi)' },
        { id: '3', name: 'PM-Kisan Samman Nidhi (with Annadata Sukhibhava)' },
        { id: '4', name: 'Post-Matric Fee Reimbursement (Jagananna Vidya Deevena & Vasathi Deevena)' },
        { id: '5', name: 'NTR Bharosa Pension Scheme ' }
    ];

    // 1. Exact full slug from user's URL
    const matchFull = findBestSchemeMatch(
        mockSchemes,
        'post-matric-fee-reimbursement-jagananna-vidya-deevena-vasathi-deevena'
    );
    assert.ok(matchFull);
    assert.strictEqual(matchFull.id, '4');

    // 2. Prefix/partial slug
    const matchPrefix = findBestSchemeMatch(mockSchemes, 'post-matric-fee-reimbursement');
    assert.ok(matchPrefix);
    assert.strictEqual(matchPrefix.id, '4');

    // 3. Middle slug component
    const matchMiddle = findBestSchemeMatch(mockSchemes, 'jagananna-vidya-deevena');
    assert.ok(matchMiddle);
    assert.strictEqual(matchMiddle.id, '4');

    // 4. Talliki Vandanam full and partial
    const matchTalliki = findBestSchemeMatch(mockSchemes, 'talliki-vandanam-scheme-formerly-jagananna-amma-vodi');
    assert.ok(matchTalliki);
    assert.strictEqual(matchTalliki.id, '2');

    // 5. Unknown slug
    const matchUnknown = findBestSchemeMatch(mockSchemes, 'completely-nonexistent-scheme-xyz');
    assert.strictEqual(matchUnknown, null);

    // 6. Null and empty inputs
    assert.strictEqual(findBestSchemeMatch(null, 'test'), null);
    assert.strictEqual(findBestSchemeMatch([], 'test'), null);
    assert.strictEqual(findBestSchemeMatch(mockSchemes, ''), null);
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


