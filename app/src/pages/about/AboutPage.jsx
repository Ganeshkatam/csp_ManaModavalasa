import React from 'react';
import { Link } from 'react-router-dom';
import { 
    GraduationCap, 
    BookOpen, 
    ShieldCheck, 
    FileText, 
    CheckCircle2, 
    MapPin, 
    Users, 
    Building, 
    AlertCircle, 
    ExternalLink 
} from 'lucide-react';
import { useAppContext } from '../../app/providers';

export function AboutPage() {
    const { lang } = useAppContext();
    const isTe = lang === 'te';

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="container page-header-inner">
                    <div className="page-badge-row">
                        <span className="badge badge-civic">
                            <GraduationCap size={12} style={{ marginRight: '4px' }} />
                            {isTe ? "విద్యా & ప్రాజెక్ట్ నేపథ్యం" : "Academic Context & Project Attributions"}
                        </span>
                        <span className="badge badge-verified">
                            {isTe ? "APSCHE G.O. Ms. No. 46 నిబంధనలు" : "APSCHE Guidelines Compliant"}
                        </span>
                    </div>
                    <h1 className="page-title">
                        {isTe ? "మన మోదవలస ప్రాజెక్ట్ గురించి" : "About ManaModavalasa Project"}
                    </h1>
                    <p className="page-subtitle">
                        {isTe
                            ? "మోదవలస గ్రామ పంచాయతీ కోసం నిర్వహించిన కమ్యూనిటీ సర్వీస్ ప్రాజెక్ట్ (CSP), క్షేత్రస్థాయి అధ్యయనం మరియు డిజిటల్ పౌర సమాచార వేదిక వివరాలు."
                            : "Academic scope, field survey methodology, student attribution, and non-government public disclaimer for the Modavalasa community portal."
                        }
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '960px', margin: '0 auto' }}>

                    {/* Non-Government Disclaimer Banner */}
                    <div className="civic-card" style={{ padding: '1.5rem 1.75rem', borderLeft: '4px solid var(--color-amber-500)', background: 'var(--color-slate-50)' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ color: 'var(--color-amber-600)', marginTop: '2px', flexShrink: 0 }}>
                                <AlertCircle size={22} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: '0 0 0.35rem' }}>
                                    {isTe ? "ప్రజా సమాచార గమనిక (Non-Government Disclaimer)" : "Non-Government Civic Information Notice"}
                                </h3>
                                <p style={{ fontSize: '0.875rem', lineHeight: '1.65', color: 'var(--color-slate-700)', margin: 0 }}>
                                    {isTe
                                        ? "మన మోదవలస అనేది విద్యా పరిశోధన మరియు పౌర అవగాహన కొరకు రూపొందించబడిన స్వతంత్ర సమాచార వేదిక. ఇది ఆంధ్రప్రదేశ్ ప్రభుత్వ అధికారిక లావాదేవీ పోర్టల్ కాదు. సంక్షేమ పథకాల నమోదు, దరఖాస్తులు మరియు ధృవీకరణల కోసం పౌరులు తమ గ్రామ సచివాలయాన్ని లేదా అధికారిక ప్రభుత్వ వెబ్‌సైట్లను మాత్రమే సంప్రదించాలి."
                                        : "ManaModavalasa is an independent academic community service and civic informational platform engineered to make verified village data accessible to residents and examiners. It is not an official government transaction portal. Statutory scheme enrollments and certifications are processed exclusively through the Andhra Pradesh Navasakam portal, local Grama Sachivalayam, or designated official departments."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Overview & Objective */}
                    <div className="civic-card" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BookOpen size={20} style={{ color: 'var(--color-blue-600)' }} />
                            {isTe ? "ప్రాజెక్ట్ లక్ష్యం & ప్రాముఖ్యత" : "Project Overview & Civic Purpose"}
                        </h2>
                        <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--color-slate-700)', marginBottom: '1.25rem' }}>
                            {isTe
                                ? "మోదవలస గ్రామీణ ప్రాంతంలో సంక్షేమ పథకాలు, అత్యవసర వైద్య సేవలు, పాఠశాలలు మరియు స్థానిక చేతివృత్తుల వివరాలను గ్రామస్థులకు సులభంగా అందుబాటులో ఉంచడమే ఈ ప్రాజెక్ట్ యొక్క ప్రధాన ఉద్దేశం. డిజిటల్ విభజనను అధిగమించేందుకు సాధారణ మొబైల్ పరికరాల్లోనూ వేగంగా పనిచేసే విధంగా, ద్విభాషా (తెలుగు మరియు ఇంగ్లీష్) విధానంలో ఈ పోర్టల్ రూపొందించబడింది."
                                : "The primary objective of ManaModavalasa is to bridge the rural information gap by providing a fast, transparent, and mobile-optimized digital directory for Modavalasa Gram Panchayat (Denkada Mandal, Vizianagaram District). The portal unifies verified eligibility criteria for government welfare schemes, direct phone numbers for frontline emergency and civic workers, Primary Health Centre operating hours, school facilities, and local micro-enterprise listings."
                            }
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
                            <div style={{ padding: '1rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-slate-200)' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-slate-900)', marginBottom: '0.35rem' }}>
                                    {isTe ? "ధృవీకరించబడిన సంక్షేమ సమాచారం" : "Verified Welfare Schemes"}
                                </div>
                                <div style={{ fontSize: '0.825rem', color: 'var(--color-slate-600)', lineHeight: '1.5' }}>
                                    {isTe ? "అర్హతలు, అవసరమైన పత్రాలు మరియు అధికారిక పోర్టల్ లింకులు." : "Document checklists, income criteria, and authentic .gov.in links."}
                                </div>
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-slate-200)' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-slate-900)', marginBottom: '0.35rem' }}>
                                    {isTe ? "24x7 అత్యవసర సంప్రదింపులు" : "Emergency Helplines"}
                                </div>
                                <div style={{ fontSize: '0.825rem', color: 'var(--color-slate-600)', lineHeight: '1.5' }}>
                                    {isTe ? "పంచాయతీ, ఏఎన్ఎం, ఆశా కార్యకర్తలు మరియు లైన్మెన్ నంబర్లు." : "Single-tap direct calling for ambulance, police, health, and local linemen."}
                                </div>
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-slate-200)' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-slate-900)', marginBottom: '0.35rem' }}>
                                    {isTe ? "గోప్యతా రక్షణ (Zero PII)" : "Privacy by Design"}
                                </div>
                                <div style={{ fontSize: '0.825rem', color: 'var(--color-slate-600)', lineHeight: '1.5' }}>
                                    {isTe ? "పౌరుల ఆధార్, రేషన్ వంటి వ్యక్తిగత వివరాలు సేకరించబడవు." : "No Aadhaar, OTP, or resident identity data is ever requested or stored."}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Framework & Attribution */}
                    <div className="civic-card" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <GraduationCap size={20} style={{ color: 'var(--color-emerald-600)' }} />
                            {isTe ? "విద్యా ప్రమాణాలు & ప్రాజెక్ట్ నిర్వహణ" : "Curricular Framework & Student Credit"}
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid var(--color-slate-200)' }}>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-600)', fontWeight: 600 }}>
                                                {isTe ? "అకడమిక్ ప్రోగ్రామ్:" : "Academic Program:"}
                                            </td>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-900)', fontWeight: 700 }}>
                                                B.Tech Computer Science &amp; Engineering
                                            </td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid var(--color-slate-200)' }}>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-600)', fontWeight: 600 }}>
                                                {isTe ? "కోర్సు విభాగం:" : "Course Requirement:"}
                                            </td>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-900)', fontWeight: 700 }}>
                                                Community Service Project (CSP)
                                            </td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid var(--color-slate-200)' }}>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-600)', fontWeight: 600 }}>
                                                {isTe ? "నియంత్రణ మార్గదర్శకాలు:" : "Statutory Framework:"}
                                            </td>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-900)', fontWeight: 700 }}>
                                                APSCHE Guidelines (G.O. Ms. No. 46)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-600)', fontWeight: 600 }}>
                                                {isTe ? "వ్యవధి / సమయం:" : "Duration & Immersion:"}
                                            </td>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-900)', fontWeight: 700 }}>
                                                4 Weeks / 100 Hours Field Study
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid var(--color-slate-200)' }}>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-600)', fontWeight: 600 }}>
                                                {isTe ? "విద్యార్థి పరిశోధకుడు:" : "Student Investigator:"}
                                            </td>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-900)', fontWeight: 700 }}>
                                                Ganesh Katam
                                            </td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid var(--color-slate-200)' }}>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-600)', fontWeight: 600 }}>
                                                {isTe ? "అధ్యయనం చేసిన గ్రామం:" : "Assigned Habitation:"}
                                            </td>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-900)', fontWeight: 700 }}>
                                                Modavalasa Gram Panchayat
                                            </td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid var(--color-slate-200)' }}>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-600)', fontWeight: 600 }}>
                                                {isTe ? "మండలం & జిల్లా:" : "Mandal & District:"}
                                            </td>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-900)', fontWeight: 700 }}>
                                                Denkada Mandal, Vizianagaram District
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-600)', fontWeight: 600 }}>
                                                {isTe ? "సర్వే నిర్వహించిన తేదీ:" : "Field Survey Period:"}
                                            </td>
                                            <td style={{ padding: '0.65rem 0', color: 'var(--color-slate-900)', fontWeight: 700 }}>
                                                August 2024
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <p style={{ fontSize: '0.875rem', lineHeight: '1.65', color: 'var(--color-slate-600)', margin: 0 }}>
                            {isTe
                                ? "ఈ ప్రాజెక్ట్ ఆంధ్రప్రదేశ్ ఉన్నత విద్యా మండలి (APSCHE) ఇంటర్న్‌షిప్ నిబంధనల ప్రకారం, ఇంజనీరింగ్ విద్యార్థులకు గ్రామీణ జీవనం, సమాజ అవసరాలు మరియు క్షేత్రస్థాయి సమస్యల పరిష్కారంలో ప్రత్యక్ష అనుభవం అందించడం కోసం నిర్వహించబడింది."
                                : "As mandated by the Andhra Pradesh State Council of Higher Education (APSCHE) under G.O. Ms. No. 46, the Community Service Project immerses undergraduate engineering students into rural communities to document socioeconomic conditions, understand civic service delivery, and engineer sustainable digital interventions."
                            }
                        </p>
                    </div>

                    {/* Survey Methodology & Data Provenance */}
                    <div className="civic-card" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={20} style={{ color: 'var(--color-teal-600)' }} />
                            {isTe ? "సమాచార వనరులు & సర్వే విధానం" : "Data Sources & Empirical Methodology"}
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-slate-700)', lineHeight: '1.65' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <CheckCircle2 size={18} style={{ color: 'var(--color-emerald-600)', marginTop: '3px', flexShrink: 0 }} />
                                <div>
                                    <strong style={{ color: 'var(--color-slate-900)' }}>
                                        {isTe ? "సెన్సస్ 2011 గణాంకాలు (Census of India):" : "Official Census Baseline (Census 2011):"}
                                    </strong>{' '}
                                    {isTe
                                        ? "గ్రామ భౌగోళిక సరిహద్దులు, విస్తీర్ణం (633 హెక్టార్లు), గృహాలు (624) మరియు అధికారిక జనాభా (2,584) వివరాలు భారత ప్రభుత్వ సెన్సస్ 2011 ప్రైమరీ సెన్సస్ అబ్‌స్ట్రాక్ట్ (టేబుల్ A-5, గ్రామ కోడ్ 583218) ఆధారంగా తీసుకోబడ్డాయి."
                                        : "Habitation boundaries, geographical area (633 hectares), households (624), and official population statistics (2,584) are cited directly from the Primary Census Abstract, Table A-5 (Village Code: 583218) published by the Office of the Registrar General & Census Commissioner, India."
                                    }
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <CheckCircle2 size={18} style={{ color: 'var(--color-emerald-600)', marginTop: '3px', flexShrink: 0 }} />
                                <div>
                                    <strong style={{ color: 'var(--color-slate-900)' }}>
                                        {isTe ? "గ్రామ క్షేత్ర సర్వే (ఆగస్టు 2024):" : "Empirical Household Survey (August 2024):"}
                                    </strong>{' '}
                                    {isTe
                                        ? "మోదవలసలోని గృహాలలో 7 ప్రామాణిక అంశాలపై (గృహ సౌకర్యాలు, తాగునీరు, విద్యుత్, ఉపాధి, విద్య, ఆరోగ్యం మరియు సంక్షేమ పథకాలు) సర్వే నిర్వహించి క్షేత్రస్థాయి పరిశీలనలు నమోదు చేయబడ్డాయి."
                                        : "A systematic household survey was conducted across Modavalasa covering 7 core socioeconomic dimensions: demographics, housing and sanitation, water and power reliability, livelihoods and agriculture, education and healthcare access, and welfare scheme penetration."
                                    }
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <CheckCircle2 size={18} style={{ color: 'var(--color-emerald-600)', marginTop: '3px', flexShrink: 0 }} />
                                <div>
                                    <strong style={{ color: 'var(--color-slate-900)' }}>
                                        {isTe ? "స్థానిక రికార్డుల ధృవీకరణ:" : "Administrative Cross-Verification:"}
                                    </strong>{' '}
                                    {isTe
                                        ? "ఆరోగ్య కేంద్రం వేళలు, అంగన్‌వాడీ కేంద్రాలు, మండల పరిషత్ ప్రాథమిక పాఠశాల మరియు హెల్ప్‌లైన్ నంబర్లు సంబంధిత స్థానిక సిబ్బంది మరియు గ్రామ సచివాలయ సమాచారంతో ధృవీకరించబడ్డాయి."
                                        : "All institutional schedules, public facility locations, and emergency contact numbers have been verified directly against local administrative records from Modavalasa Grama Sachivalayam, Denkada PHC, and school authorities."
                                    }
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-slate-200)', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <Link to="/village" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Building size={14} />
                                <span>{isTe ? "గ్రామ ప్రొఫైల్ చూడండి" : "Explore Village Profile"}</span>
                            </Link>
                            <Link to="/schemes" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <FileText size={14} />
                                <span>{isTe ? "సంక్షేమ పథకాలు చూడండి" : "Explore Welfare Schemes"}</span>
                            </Link>
                            <Link to="/contacts" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Users size={14} />
                                <span>{isTe ? "అత్యవసర నంబర్లు" : "Emergency Contacts"}</span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AboutPage;
