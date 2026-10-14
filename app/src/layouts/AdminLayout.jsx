import React, { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { Header } from '../components/navigation/Header';
import { Footer } from '../components/navigation/Footer';

export function AdminLayout() {
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
            <main className="main-content-layout">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default AdminLayout;
