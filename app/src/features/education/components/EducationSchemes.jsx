import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight } from 'lucide-react';
import { schemeService, generateSlug } from '../../schemes/api/schemes';

export function EducationSchemes({ schemes: propSchemes, lang = 'en' }) {
    const isTe = lang === 'te';
    const [fetchedSchemes, setFetchedSchemes] = useState([]);
    const [loading, setLoading] = useState(!propSchemes || propSchemes.length === 0);
    const [error, setError] = useState(null);

    const schemes = (propSchemes && propSchemes.length > 0) ? propSchemes : fetchedSchemes;

    useEffect(() => {
        if (propSchemes && propSchemes.length > 0) {
            return;
        }

        let isMounted = true;
        setLoading(true);
        setError(null);

        schemeService.getSchemesByCategory('Education')
            .then(data => {
                if (isMounted) {
                    setFetchedSchemes(data || []);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (isMounted) {
                    console.error('Error fetching education schemes:', err);
                    setError(err.message || 'Failed to load education schemes');
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [propSchemes]);

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Award size={20} style={{ color: 'var(--color-indigo-600)' }} />
                        {isTe ? "విద్యా సంక్షేమ పథకాలు & ప్రయోజనాలు" : "Education Benefits & Welfare Schemes"}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe 
                            ? "పాఠశాల మరియు ఉన్నత విద్యార్థుల కోసం అధికారిక సంక్షేమ పథకాలు. సమగ్ర వివరాలు మరియు అర్హత ప్రమాణాల కోసం పథకాల విభాగాన్ని చూడండి."
                            : "Official educational welfare schemes. Contextual linkages into the canonical schemes registry."
                        }
                    </p>
                </div>
                <div>
                    <Link to="/schemes/category/education" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                        {isTe ? "అన్ని విద్యా పథకాలు చూడండి" : "View All Education Schemes"}
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {loading && (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-slate-500)', fontSize: '0.9rem' }}>
                    {isTe ? "విద్యా పథకాల వివరాలు లోడ్ అవుతున్నాయి..." : "Loading education schemes..."}
                </div>
            )}

            {error && !loading && (
                <div style={{ padding: '1rem', background: 'var(--color-red-50, #fef2f2)', border: '1px solid var(--color-red-200, #fecaca)', borderRadius: 'var(--radius-md)', color: 'var(--color-red-800, #991b1b)', fontSize: '0.85rem' }}>
                    {isTe ? "విద్యా పథకాలను లోడ్ చేయడంలో సమస్య ఏర్పడింది." : `Unable to load education schemes: ${error}`}
                </div>
            )}

            {!loading && !error && schemes.length === 0 && (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-slate-500)', fontSize: '0.9rem' }}>
                    {isTe ? "ప్రస్తుతం ఏ విద్యా పథకాలు ప్రచురించబడలేదు." : "No published education schemes currently available."}
                </div>
            )}

            {!loading && !error && schemes.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {schemes.map((s) => {
                        const title = isTe ? (s.name_te || s.name) : s.name;
                        const subtitle = isTe ? (s.description_te || s.description) : s.description;
                        const slug = s.slug || generateSlug(s.name) || s.id;
                        const categoryLabel = isTe ? "విద్యా సంక్షేమం" : (s.category || "Education");

                        return (
                            <div key={s.id} style={{ background: '#ffffff', border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-xs)' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span className="badge badge-civic" style={{ fontSize: '0.7rem' }}>
                                            {categoryLabel}
                                        </span>
                                        {s.verified_on && (
                                            <span style={{ fontSize: '0.72rem', color: 'var(--color-slate-500)' }}>
                                                {s.verified_on}
                                            </span>
                                        )}
                                    </div>
                                    <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                                        {title}
                                    </h3>
                                    <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: 'var(--color-slate-600)', lineHeight: '1.45' }}>
                                        {subtitle}
                                    </p>
                                </div>
                                <div>
                                    <Link 
                                        to={`/schemes/${slug}`}
                                        className="btn btn-outline btn-block"
                                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', padding: '0.45rem 0.75rem', textDecoration: 'none' }}
                                    >
                                        <span>{isTe ? "పూర్తి వివరాలు చూడండి" : "View Scheme Details"}</span>
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default EducationSchemes;
