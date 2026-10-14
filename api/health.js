import { handleHealthProbe } from '../app/src/lib/healthCheck.js';
import { supabase } from '../app/src/lib/supabase.js';

/**
 * Vercel Serverless Function - Operational Health Check
 * Route: GET /api/health?probe=liveness | readiness
 */
export default async function handler(req, res) {
    const probe = req.query?.probe || (req.url?.includes('/live') ? 'liveness' : 'readiness');
    const result = await handleHealthProbe({ probe }, supabase);

    res.setHeader('Content-Type', result.headers['Content-Type']);
    res.setHeader('Cache-Control', result.headers['Cache-Control']);
    return res.status(result.statusCode).json(result.body);
}
