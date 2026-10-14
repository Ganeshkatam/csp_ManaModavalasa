import test from 'node:test';
import assert from 'node:assert/strict';
import {
    validateSupabaseConfig,
    supabase,
    isSupabaseConfigured,
    isValidUuid,
    resolveVillageId,
    clearVillageCache,
    DEFAULT_VILLAGE_ID
} from './supabase.js';

test('validateSupabaseConfig detects missing URL', () => {
    const resNull = validateSupabaseConfig(null, 'some-key');
    assert.strictEqual(resNull.valid, false);
    assert.strictEqual(resNull.reason, 'missing_url');

    const resEmpty = validateSupabaseConfig('', 'some-key');
    assert.strictEqual(resEmpty.valid, false);
    assert.strictEqual(resEmpty.reason, 'missing_url');

    const resWhitespace = validateSupabaseConfig('   ', 'some-key');
    assert.strictEqual(resWhitespace.valid, false);
    assert.strictEqual(resWhitespace.reason, 'missing_url');
});

test('validateSupabaseConfig detects missing anonymous key', () => {
    const resNull = validateSupabaseConfig('https://valid.supabase.co', null);
    assert.strictEqual(resNull.valid, false);
    assert.strictEqual(resNull.reason, 'missing_anon_key');

    const resEmpty = validateSupabaseConfig('https://valid.supabase.co', '');
    assert.strictEqual(resEmpty.valid, false);
    assert.strictEqual(resEmpty.reason, 'missing_anon_key');

    const resWhitespace = validateSupabaseConfig('https://valid.supabase.co', '   ');
    assert.strictEqual(resWhitespace.valid, false);
    assert.strictEqual(resWhitespace.reason, 'missing_anon_key');
});

test('validateSupabaseConfig detects malformed URLs', () => {
    const resInvalid = validateSupabaseConfig('not-a-valid-url', 'some-key');
    assert.strictEqual(resInvalid.valid, false);
    assert.strictEqual(resInvalid.reason, 'malformed_url');

    const resFtp = validateSupabaseConfig('ftp://some-host.com', 'some-key');
    assert.strictEqual(resFtp.valid, false);
    assert.strictEqual(resFtp.reason, 'malformed_url');

    const resJavascript = validateSupabaseConfig('javascript:alert(1)', 'some-key');
    assert.strictEqual(resJavascript.valid, false);
    assert.strictEqual(resJavascript.reason, 'malformed_url');
});

test('validateSupabaseConfig accepts valid https and http configurations', () => {
    const resHttps = validateSupabaseConfig('https://xyzcompany.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validkey');
    assert.strictEqual(resHttps.valid, true);
    assert.strictEqual(resHttps.reason, null);

    const resHttp = validateSupabaseConfig('http://localhost:54321', 'sb_anon_test_key');
    assert.strictEqual(resHttp.valid, true);
    assert.strictEqual(resHttp.reason, null);
});

test('unconfigured client fails gracefully without issuing network requests', async () => {
    if (!isSupabaseConfigured) {
        const selectResult = await supabase.from('villages').select('*');
        assert.deepEqual(selectResult.data, []);
        assert.ok(selectResult.error);

        const rpcResult = await supabase.rpc('search_portal', { p_query: 'test' });
        assert.strictEqual(rpcResult.data, null);
        assert.ok(rpcResult.error);

        const sessionResult = await supabase.auth.getSession();
        assert.strictEqual(sessionResult.data.session, null);
    }
});

test('isValidUuid accurately validates UUID format and rejects invalid inputs', () => {
    assert.strictEqual(isValidUuid('00000000-0000-0000-0000-000000000001'), true);
    assert.strictEqual(isValidUuid('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'), true);
    assert.strictEqual(isValidUuid('not-a-uuid'), false);
    assert.strictEqual(isValidUuid('00000000-0000-0000-0000-00000000000Z'), false);
    assert.strictEqual(isValidUuid(''), false);
    assert.strictEqual(isValidUuid(null), false);
    assert.strictEqual(isValidUuid(undefined), false);
    assert.strictEqual(isValidUuid(12345), false);
});

test('DEFAULT_VILLAGE_ID does not silently fall back to hardcoded UUID when missing', () => {
    if (!process.env.VITE_DEFAULT_VILLAGE_ID) {
        assert.strictEqual(DEFAULT_VILLAGE_ID, null);
    }
});

test('resolveVillageId resolves via explicit database lookup when client provides village record', async () => {
    clearVillageCache();
    const mockVillageId = '12345678-1234-1234-1234-123456789abc';
    const mockClient = {
        from: (table) => {
            assert.strictEqual(table, 'villages');
            return {
                select: (cols) => {
                    assert.strictEqual(cols, 'id');
                    return {
                        limit: async (num) => {
                            assert.strictEqual(num, 1);
                            return { data: [{ id: mockVillageId }], error: null };
                        }
                    };
                }
            };
        }
    };

    const resolved = await resolveVillageId(mockClient);
    assert.strictEqual(resolved, mockVillageId);

    // Verify in-memory caching returns resolved ID without querying client again
    const cached = await resolveVillageId({ from: () => { throw new Error('Should not be called'); } });
    assert.strictEqual(cached, mockVillageId);

    clearVillageCache();
});

test('resolveVillageId resolves via census_village_code when client supports eq query', async () => {
    clearVillageCache();
    const mockCensusVillageId = '87654321-4321-4321-4321-cba987654321';
    let queriedCensusCode = null;

    const mockClient = {
        from: (table) => {
            assert.strictEqual(table, 'villages');
            return {
                select: (cols) => {
                    assert.strictEqual(cols, 'id');
                    return {
                        eq: (col, val) => {
                            assert.strictEqual(col, 'census_village_code');
                            queriedCensusCode = val;
                            return {
                                limit: async (num) => {
                                    assert.strictEqual(num, 1);
                                    return { data: [{ id: mockCensusVillageId }], error: null };
                                }
                            };
                        },
                        limit: async () => ({ data: [], error: null })
                    };
                }
            };
        }
    };

    const resolved = await resolveVillageId(mockClient);
    assert.strictEqual(resolved, mockCensusVillageId);
    assert.strictEqual(queriedCensusCode, '583218');

    clearVillageCache();
});

test('resolveVillageId fails clearly when database lookup returns no village records', async () => {
    clearVillageCache();
    const emptyClient = {
        from: () => ({
            select: () => ({
                limit: async () => ({ data: [], error: null })
            })
        })
    };

    await assert.rejects(
        () => resolveVillageId(emptyClient),
        /Unable to resolve village identifier: No valid VITE_DEFAULT_VILLAGE_ID configured and no village records found/
    );
});

test('resolveVillageId fails clearly when database lookup returns a query error', async () => {
    clearVillageCache();
    const errorClient = {
        from: () => ({
            select: () => ({
                limit: async () => ({ data: null, error: { message: 'relation "villages" does not exist' } })
            })
        })
    };

    await assert.rejects(
        () => resolveVillageId(errorClient),
        /Village resolution failed during database query/
    );
});

test('resolveVillageId fails clearly when client is null or unconfigured', async () => {
    clearVillageCache();
    await assert.rejects(
        () => resolveVillageId(null),
        /Village resolution failed: Supabase client is not available or unconfigured/
    );
});

