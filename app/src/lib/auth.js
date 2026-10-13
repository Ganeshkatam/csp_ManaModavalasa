import { supabase } from './supabase.js';
import { isValidEmail } from '../utils/validation.js';

export const authService = {
    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },

    async signIn(email, password) {
        if (!email || typeof email !== 'string') {
            throw new Error('Please enter a valid email address.');
        }
        const cleanEmail = email.trim();
        if (!isValidEmail(cleanEmail)) {
            throw new Error('Please enter a valid email address.');
        }

        if (password === undefined || password === null || typeof password !== 'string' || password.length === 0) {
            throw new Error('Password is required.');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: password
        });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async updatePassword(newPassword) {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;
        return data;
    },

    async isAdmin() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return false;
            const { data, error } = await supabase
                .from('admin_users')
                .select('role')
                .eq('user_id', session.user.id)
                .eq('role', 'admin')
                .maybeSingle();
            return !error && !!data;
        } catch {
            return false;
        }
    },

    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    }
};

export default authService;
