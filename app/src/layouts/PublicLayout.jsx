import React, { useState, useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { Header } from '../components/navigation/Header';
import { Footer } from '../components/navigation/Footer';
import { MobileBottomNav } from '../components/navigation/MobileBottomNav';
import { AnnouncementTicker } from '../features/announcements/components/AnnouncementTicker';
import { announcementService } from '../features/announcements/api/announcements';
import { useAppContext } from '../app/providers';
import { useSEO } from '../hooks/useSEO';

export function PublicLayout() {
    const { lang } = useAppContext();
    const [announcements, setAnnouncements] = useState([]);
    const location = useLocation();

    useSEO();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [location.pathname]);

    useEffect(() => {
        announcementService.getAnnouncements().then(data => {
            if (data && data.length > 0) setAnnouncements(data);
        });
    }, []);

    return (
        <div className="app-root">
            <ScrollRestoration />
            <Header />
            <AnnouncementTicker announcements={announcements} lang={lang} />
            <main className="main-content-layout">
                <Outlet />
            </main>
            <Footer />
            <MobileBottomNav />
        </div>
    );
}

export default PublicLayout;
