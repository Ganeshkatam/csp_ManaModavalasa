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

export async function getSchemeBySlugOrId(identifier) {
    if (!identifier || !isSupabaseConfigured) return null;

    // 1. Direct index lookup by UUID if identifier is valid UUID
    if (isValidUuid(identifier)) {
        const { data, error } = await supabase
            .from('schemes')
            .select('id, village_id, name, name_te, category, description, description_te, eligibility, eligibility_te, documents, documents_te, official_url, image_url, verified_on, source, application_process, benefits, exclusions, status')
            .eq('id', identifier)
            .eq('status', 'published')
            .limit(1);

        if (error) throw error;
        return (data && data.length > 0) ? data[0] : null;
    }

    // 2. Targeted name lookup without fetching entire published registry
    const searchToken = identifier.replace(/[-_]+/g, ' ').replace(/[()]/g, '').trim().slice(0, 40);
    const { data, error } = await supabase
        .from('schemes')
        .select('id, village_id, name, name_te, category, description, description_te, eligibility, eligibility_te, documents, documents_te, official_url, image_url, verified_on, source, application_process, benefits, exclusions, status')
        .eq('status', 'published')
        .ilike('name', `%${searchToken}%`)
        .limit(5);

    if (error) throw error;

    if (data && data.length > 0) {
        const matched = data.find(s => 
            generateSlug(s.name) === identifier ||
            s.name.toLowerCase() === identifier.toLowerCase().replace(/-/g, ' ')
        );
        return matched || data[0];
    }

    return null;
}

export async function getSchemesByCategory(category) {
    return getAllSchemes({ category });
}

export default schemeService;
