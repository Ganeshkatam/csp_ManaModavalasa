import React, { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { Header } from '../components/navigation/Header';
import { Footer } from '../components/navigation/Footer';
import { MobileBottomNav } from '../components/navigation/MobileBottomNav';
import { ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { useAppContext } from '../app/providers';

export function SurveyLayout() {
    const { isOnline } = useAppContext();
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [location.pathname]);

    return (
        <div className="app-root">
            <ScrollRestoration />
            <Header />
            <div style={{ background: isOnline ? 'var(--color-blue-50)' : 'var(--color-amber-50)', borderBottom: `1px solid ${isOnline ? 'var(--color-blue-100)' : 'var(--color-amber-100)'}`, padding: '0.45rem 0', fontSize: '0.8125rem' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: isOnline ? 'var(--color-blue-800)' : 'var(--color-amber-800)' }}>
                        <ShieldCheck size={14} />
                        <span>CSP Field Household Survey • 7 Standard Modules (APSCHE Approved)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: isOnline ? 'var(--color-emerald-700)' : 'var(--color-amber-800)' }}>
                        {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
                        <span>{isOnline ? 'Network Online' : 'Offline Mode (Local Storage)'}</span>
                    </div>
                </div>
            </div>
            <main className="main-content-layout">
                <Outlet />
            </main>
            <Footer />
            <MobileBottomNav />
        </div>
    );
}

export default SurveyLayout;
