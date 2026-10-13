import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env : {});

export const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || '';
export function isValidUuid(str) {
    if (!str || typeof str !== 'string') return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
}

const rawDefaultVillageId = env.VITE_DEFAULT_VILLAGE_ID;
export const DEFAULT_VILLAGE_ID = (rawDefaultVillageId && isValidUuid(rawDefaultVillageId))
    ? rawDefaultVillageId.trim()
    : null;

let cachedResolvedVillageId = null;

export function clearVillageCache() {
    cachedResolvedVillageId = null;
}

/**
 * Resolves the active village identifier.
 * Priority:
 * 1. Validated environment configuration (VITE_DEFAULT_VILLAGE_ID) if provided.
 * 2. In-memory cached village UUID if previously resolved.
 * 3. Explicit database lookup against the villages table.
 * If all sources fail, throws an explicit Error rather than silently falling back to a fixed identifier.
 *
 * @param {Object} [client=supabase] Supabase database client
 * @returns {Promise<string>} Valid UUID of the target village
 */
export async function resolveVillageId(client = supabase) {
    if (DEFAULT_VILLAGE_ID) {
        return DEFAULT_VILLAGE_ID;
    }
    if (cachedResolvedVillageId) {
        return cachedResolvedVillageId;
    }
    if (!client || typeof client.from !== 'function') {
        throw new Error('Village resolution failed: Supabase client is not available or unconfigured.');
    }

    const { data, error } = await client
        .from('villages')
        .select('id')
        .limit(1);

    if (error) {
        throw new Error(`Village resolution failed during database query: ${error.message || 'Database error'}`);
    }

    const candidateId = Array.isArray(data) && data.length > 0 ? data[0]?.id : data?.id;
    if (candidateId && isValidUuid(candidateId)) {
        cachedResolvedVillageId = candidateId;
        return cachedResolvedVillageId;
    }

    throw new Error('Unable to resolve village identifier: No valid VITE_DEFAULT_VILLAGE_ID configured and no village records found in the database. Administrative context must be configured.');
}

export function validateSupabaseConfig(url, anonKey) {
    if (!url || typeof url !== 'string' || !url.trim()) {
        return { valid: false, reason: 'missing_url', message: 'VITE_SUPABASE_URL environment variable is missing.' };
    }
    if (!anonKey || typeof anonKey !== 'string' || !anonKey.trim()) {
        return { valid: false, reason: 'missing_anon_key', message: 'VITE_SUPABASE_ANON_KEY environment variable is missing.' };
    }
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return { valid: false, reason: 'malformed_url', message: 'VITE_SUPABASE_URL must use http or https protocol.' };
        }
    } catch {
        return { valid: false, reason: 'malformed_url', message: 'VITE_SUPABASE_URL is not a valid URL.' };
    }
    return { valid: true, reason: null, message: null };
}

export const supabaseConfigValidation = validateSupabaseConfig(SUPABASE_URL, SUPABASE_ANON_KEY);
export const isSupabaseConfigured = supabaseConfigValidation.valid;

function createUnconfiguredClient(validation) {
    const throwConfigError = () => {
        const error = new Error(`Database connection unavailable: ${validation.message}`);
        error.name = 'SupabaseConfigurationError';
        return Promise.reject(error);
    };

    const emptyResult = () => Promise.resolve({ data: null, error: { message: validation.message } });

    return {
        from: () => ({
            select: () => ({
                limit: () => ({ then: (resolve) => resolve({ data: [], error: { message: validation.message } }) }),
                order: () => ({ then: (resolve) => resolve({ data: [], error: { message: validation.message } }) }),
                eq: () => ({ maybeSingle: emptyResult, then: emptyResult }),
                then: (resolve) => resolve({ data: [], error: { message: validation.message } })
            }),
            insert: emptyResult,
            update: emptyResult,
            delete: emptyResult
        }),
        rpc: emptyResult,
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signInWithPassword: throwConfigError,
            signOut: async () => ({ error: null }),
            updateUser: throwConfigError
        }
    };
}

if (!isSupabaseConfigured) {
    console.warn(`Supabase environment note: ${supabaseConfigValidation.message}`);
}

export const supabase = isSupabaseConfigured
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : createUnconfiguredClient(supabaseConfigValidation);

