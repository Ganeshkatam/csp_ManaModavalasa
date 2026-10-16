import { supabase, isSupabaseConfigured } from '../../../lib/supabase.js';

export const CONTACT_CATEGORIES = [
    'All',
    'Emergency',
    'Administration',
    'Healthcare',
    'Police',
    'Utilities',
    'Other Services'
];

export const contactService = {
    async getContacts({ category = 'All', search = '', limit } = {}, client = supabase) {
        if (!isSupabaseConfigured && client === supabase) return [];

        let query = client
            .from('contacts')
            .select('id, village_id, name, name_te, designation, designation_te, category, phone, address, availability, source, verified_on, jurisdiction, status')
            .eq('status', 'published')
            .order('name');

        if (category && category !== 'All') {
            query = query.eq('category', category);
        }

        if (limit && Number.isInteger(limit) && limit > 0) {
            query = query.limit(limit);
        }

        const { data, error } = await query;
        if (error) throw error;

        let results = data || [];
        if (search && search.trim().length > 0) {
            const q = search.toLowerCase().trim();
            results = results.filter(c =>
                (c.name && c.name.toLowerCase().includes(q)) ||
                (c.name_te && c.name_te.toLowerCase().includes(q)) ||
                (c.designation && c.designation.toLowerCase().includes(q)) ||
                (c.phone && c.phone.includes(q)) ||
                (c.category && c.category.toLowerCase().includes(q))
            );
        }

        return results;
    },

    async getEmergencyHelplines(client = supabase) {
        if (!isSupabaseConfigured && client === supabase) return [];

        const { data, error } = await client
            .from('contacts')
            .select('*')
            .eq('status', 'published')
            .in('phone', ['108', '100', '104', '1912'])
            .order('phone');

        if (error) throw error;
        return data || [];
    }
};

export default contactService;
