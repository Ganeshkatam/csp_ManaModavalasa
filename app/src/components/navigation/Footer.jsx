import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { createTelLink } from '../../utils/phone';

export function Footer() {
    const { t, isAdmin } = useAppContext();

    const emergencyHelplines = [
        { id: '108', name: '108 Emergency Ambulance', phone: '108' },
        { id: '100', name: '100 Police Emergency', phone: '100' },
        { id: '104', name: '104 Health Advisory', phone: '104' },
        { id: '1912', name: '1912 Electricity Helpline', phone: '1912' }
    ];

    return (
        <footer className="clean-footer" role="contentinfo">
            <div className="container">
                <div className="footer-grid">
                    {/* Column 1: Project Identity */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                            <div className="nav-emblem" style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.15)', overflow: 'hidden', padding: 0 }}>
                                <img src="/images/logo.png" alt="ManaModavalasa Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                                    {t?.portalTitleEn || 'ManaModavalasa'}
                                </h3>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-400)' }}>
                                    {t?.portalTitleRegional || 'మన మోదవలస'}
                                </div>
                            </div>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-400)', lineHeight: '1.6' }}>
                            {t?.footerAboutText || 'Digital village information portal providing verified public services, welfare schemes, emergency contacts, and civic infrastructure data for Modavalasa Gram Panchayat.'}
                        </p>

                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-emerald-400)', marginTop: '0.5rem', fontWeight: 600 }}>
                            <ShieldCheck size={14} />
                            <span>{t?.footerCivicBadge || 'Independent Civic Information Initiative'}</span>
                        </div>
                    </div>

                    {/* Column 2: Civic Modules */}
                    <div>
                        <h4 className="footer-col-title">Portal Modules</h4>
                        <ul className="footer-link-list">
                            <li><Link to="/">Home Overview</Link></li>
                            <li><Link to="/schemes">Welfare Schemes</Link></li>
                            <li><Link to="/contacts">Emergency Contacts</Link></li>
                            <li><Link to="/healthcare">Primary Healthcare</Link></li>
                            <li><Link to="/education">Schools &amp; Anganwadi</Link></li>
                            <li><Link to="/businesses">Artisans &amp; Businesses</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Community & Project */}
                    <div>
                        <h4 className="footer-col-title">Community &amp; Project</h4>
                        <ul className="footer-link-list">
                            <li><Link to="/about">About This Project</Link></li>
                            <li><Link to="/village">Village Profile</Link></li>
                            <li><Link to="/announcements">Public Notices</Link></li>
                            <li><Link to="/feedback">Citizen Feedback</Link></li>
                            <li><Link to="/survey">Household Survey</Link></li>
                            <li><Link to="/dashboard">Analytics Dashboard</Link></li>
                            {isAdmin && (
                                <li><Link to="/admin">Administration</Link></li>
                            )}
                        </ul>
                    </div>

                    {/* Column 4: 24x7 Helplines */}
                    <div>
                        <h4 className="footer-col-title">24x7 Emergency Helplines</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {emergencyHelplines.map(hl => (
                                <a 
                                    key={hl.phone}
                                    href={createTelLink(hl.phone)} 
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--color-slate-800)', border: '1px solid var(--color-slate-700)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', color: '#ffffff', fontSize: '0.8125rem', textDecoration: 'none', fontWeight: 600 }}
                                >
                                    <Phone size={13} style={{ color: 'var(--color-emerald-400)' }} />
                                    <span>{hl.phone} — {hl.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Non-Government Disclaimer */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '1.75rem 0 1rem', paddingTop: '1.25rem', fontSize: '0.78rem', color: 'var(--color-slate-400)', lineHeight: '1.6' }}>
                    <p style={{ margin: 0 }}>
                        <strong style={{ color: 'var(--color-slate-300)' }}>Notice:</strong>{' '}
                        {t?.nonGovDisclaimer || 'ManaModavalasa is an independent educational and civic project created to provide verified public information. It is not an official government portal. For statutory applications, visit official Andhra Pradesh portals or the Grama Sachivalayam.'}
                    </p>
                </div>

                <div className="footer-bottom-bar">
                    <div>
                        {t?.footerCopyright || 'ManaModavalasa — Modavalasa Gram Panchayat Civic Information Portal'}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link to="/about" style={{ color: 'var(--color-slate-400)', textDecoration: 'underline' }}>About &amp; Attribution</Link>
                        <span>•</span>
                        <span>Database: Supabase PostgreSQL</span>
                        <span>•</span>
                        <span>Zero Resident PII</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
