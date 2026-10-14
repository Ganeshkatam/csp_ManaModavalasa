import { supabase, isSupabaseConfigured, isValidUuid } from '../../../lib/supabase.js';

export const SCHEME_CATEGORIES = [
    'All',
    'Agriculture',
    'Employment',
    'Housing',
    'Education',
    'Healthcare',
    'Women & Child',
    'Social Welfare'
];

export function generateSlug(name) {
    if (!name) return '';
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

export const schemeService = {
    getAllSchemes,
    getSchemeBySlugOrId,
    getSchemesByCategory
};

export async function getAllSchemes({ category = 'All', search = '', limit, offset = 0 } = {}) {
    if (!isSupabaseConfigured) {
        return [];
    }

    let query = supabase
        .from('schemes')
        .select('id, village_id, name, name_te, category, description, description_te, eligibility, eligibility_te, documents, documents_te, official_url, image_url, verified_on, source, application_process, benefits, exclusions, status')
        .eq('status', 'published')
        .order('name');

    if (category && category !== 'All') {
        query = query.eq('category', category);
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
        // Sanitize search query to prevent delimiter issues in PostgREST or syntax
        const cleaned = search.replace(/[,()]/g, ' ').trim();
        if (cleaned.length > 0) {
            query = query.or(
                `name.ilike.%${cleaned}%,name_te.ilike.%${cleaned}%,category.ilike.%${cleaned}%,description.ilike.%${cleaned}%,description_te.ilike.%${cleaned}%,eligibility.ilike.%${cleaned}%,eligibility_te.ilike.%${cleaned}%`
            );
        }
    }

    if (limit && Number.isInteger(limit) && limit > 0) {
        if (Number.isInteger(offset) && offset > 0) {
            query = query.range(offset, offset + limit - 1);
        } else {
            query = query.limit(limit);
        }
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
}

export function findBestSchemeMatch(schemes, identifier) {
    if (!schemes || !Array.isArray(schemes) || schemes.length === 0 || !identifier) return null;
    const lowerId = String(identifier).toLowerCase().trim();
    const cleanId = lowerId.replace(/[-_]+/g, ' ').trim();

    // Priority 1: Exact slug match
    const exactSlug = schemes.find(s => generateSlug(s.name) === lowerId);
    if (exactSlug) return exactSlug;

    // Priority 2: Normalized name equals clean identifier
    const exactName = schemes.find(s => {
        const cleanName = (s.name || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        return cleanName === cleanId;
    });
    if (exactName) return exactName;

    // Priority 3: Slug starts with identifier or identifier starts with slug
    const prefixMatch = schemes.find(s => {
        const slug = generateSlug(s.name);
        return slug.length > 0 && (slug.startsWith(lowerId) || lowerId.startsWith(slug));
    });
    if (prefixMatch) return prefixMatch;

    // Priority 4: Slug substring containment
    const subMatch = schemes.find(s => {
        const slug = generateSlug(s.name);
        return slug.length > 0 && (slug.includes(lowerId) || lowerId.includes(slug));
    });
    if (subMatch) return subMatch;

    return null;
}

export async function getSchemeBySlugOrId(identifier) {
    if (!identifier || !isSupabaseConfigured) return null;

    const trimmed = String(identifier).trim();
    if (!trimmed) return null;

    // 1. Direct index lookup by UUID if identifier is valid UUID
    if (isValidUuid(trimmed)) {
        const { data, error } = await supabase
            .from('schemes')
            .select('id, village_id, name, name_te, category, description, description_te, eligibility, eligibility_te, documents, documents_te, official_url, image_url, verified_on, source, application_process, benefits, exclusions, status')
            .eq('id', trimmed)
            .eq('status', 'published')
            .limit(1);

        if (error) throw error;
        return (data && data.length > 0) ? data[0] : null;
    }

    // 2. Extract leading keyword tokens (length >= 3)
    const words = trimmed
        .toLowerCase()
        .split(/[-_]+/)
        .map(w => w.replace(/[^a-z0-9]/g, ''))
        .filter(w => w.length >= 3);

    // 3. First attempt: Query database with candidate keyword filters (ILIKE on significant terms)
    if (words.length > 0) {
        const candidateWords = words.slice(0, 3);
        const filterClause = candidateWords.map(w => `name.ilike.%${w}%`).join(',');
        const { data: candidates, error: candidateError } = await supabase
            .from('schemes')
            .select('id, village_id, name, name_te, category, description, description_te, eligibility, eligibility_te, documents, documents_te, official_url, image_url, verified_on, source, application_process, benefits, exclusions, status')
            .eq('status', 'published')
            .or(filterClause)
            .limit(10);

        if (!candidateError && candidates && candidates.length > 0) {
            const matched = findBestSchemeMatch(candidates, trimmed);
            if (matched) return matched;
        }
    }

    // 4. Guaranteed fallback: fetch published schemes (capped at 100) and match against slugs
    const { data: allPublished, error: fallbackError } = await supabase
        .from('schemes')
        .select('id, village_id, name, name_te, category, description, description_te, eligibility, eligibility_te, documents, documents_te, official_url, image_url, verified_on, source, application_process, benefits, exclusions, status')
        .eq('status', 'published')
        .limit(100);

    if (fallbackError) throw fallbackError;
    return findBestSchemeMatch(allPublished || [], trimmed);
}

export async function getSchemesByCategory(category) {
    return getAllSchemes({ category });
}

export default schemeService;
