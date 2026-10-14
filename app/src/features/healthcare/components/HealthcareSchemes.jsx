import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import { healthcareSchemesData } from '../data/healthcareSchemesData';

export function HealthcareSchemes({ schemes = [], lang = 'en' }) {
    const isTe = lang === 'te';
    const { header, provenance, labels } = healthcareSchemesData;

    if (!schemes || schemes.length === 0) return null;

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Award size={20} style={{ color: 'var(--color-blue-600)' }} />
                        {isTe ? header.titleTe : header.title}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe ? header.subtitleTe : header.subtitle}
                    </p>
                </div>
                <div>
                    <Link to="/schemes/category/healthcare" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                        {isTe ? header.actionTextTe : header.actionText}
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            <div className="provenance-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span>
                        <strong>{isTe ? labels.sourceLabelTe : labels.sourceLabel} </strong>
                        {isTe ? provenance.sourceTe : provenance.source}
                    </span>
                    <span>
                        <strong>{isTe ? labels.verifiedLabelTe : labels.verifiedLabel} </strong>
                        {provenance.verifiedOn}
                    </span>
                </div>
                <div style={{ marginTop: '0.35rem', color: 'var(--color-slate-600)' }}>
                    <strong>{isTe ? labels.noteLabelTe : labels.noteLabel} </strong>
                    {isTe ? provenance.noteTe : provenance.note}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {schemes.map(s => {
                    const title = isTe ? (s.name_te || s.name) : s.name;
                    const desc = isTe ? (s.description_te || s.description) : s.description;
                    const elig = isTe ? (s.eligibility_te || s.eligibility) : s.eligibility;
                    const benefits = isTe ? (s.benefits_te || s.benefits) : s.benefits;
                    const appProcess = isTe ? (s.application_process_te || s.application_process) : s.application_process;

                    return (
                        <div 
                            key={s.id} 
                            style={{ 
                                background: '#ffffff', 
                                border: '1px solid var(--color-slate-200)', 
                                borderRadius: 'var(--radius-xl, 16px)', 
                                padding: '1.5rem', 
                                boxShadow: '0 4px 18px -2px rgba(15, 23, 42, 0.05)',
                                borderLeft: '5px solid var(--color-blue-600)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                                        <span className="badge badge-verified">
                                            <ShieldCheck size={11} style={{ marginRight: '3px' }} />
                                            {isTe ? labels.stateFlagshipBadgeTe : labels.stateFlagshipBadge}
                                        </span>
                                        <span className="badge badge-civic" style={{ background: 'var(--color-emerald-50)', color: 'var(--color-emerald-800)', border: '1px solid var(--color-emerald-200)' }}>
                                            {isTe ? labels.coverageBadgeTe : labels.coverageBadge}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: '0 0 0.4rem', lineHeight: '1.25' }}>
                                        {title}
                                    </h3>
                                </div>

                                {s.official_url && (
                                    <a 
                                        href={s.official_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-secondary btn-sm"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}
                                    >
                                        <span>{isTe ? labels.officialPortalTe : labels.officialPortal}</span>
                                        <ExternalLink size={13} />
                                    </a>
                                )}
                            </div>

                            <p style={{ fontSize: '0.88rem', color: 'var(--color-slate-700)', lineHeight: '1.55', marginBottom: '1.15rem' }}>
                                {desc}
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', background: 'var(--color-slate-50)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-200)', marginBottom: '1.25rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-slate-500)', marginBottom: '0.35rem' }}>
                                        {isTe ? labels.eligibilityTitleTe : labels.eligibilityTitle}
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate-800)', lineHeight: '1.45', fontWeight: 500 }}>
                                        {elig}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-slate-500)', marginBottom: '0.35rem' }}>
                                        {isTe ? labels.benefitsTitleTe : labels.benefitsTitle}
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate-800)', lineHeight: '1.45', fontWeight: 500 }}>
                                        {benefits || (isTe ? labels.defaultBenefitsTe : labels.defaultBenefits)}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-slate-100)' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                                    <strong>{isTe ? labels.applicationPrefixTe : labels.applicationPrefix} </strong>
                                    {appProcess || (isTe ? labels.defaultApplicationTe : labels.defaultApplication)}
                                </div>

                                <Link 
                                    to="/schemes" 
                                    className="btn btn-primary btn-sm"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <span>{isTe ? labels.viewDetailsTe : labels.viewDetails}</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default HealthcareSchemes;
