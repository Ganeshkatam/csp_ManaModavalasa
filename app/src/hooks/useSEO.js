import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../app/providers';
import { updateDocumentSEO } from '../utils/seo';

/**
 * React hook to synchronize document title, canonical link, hreflang alternates,
 * and meta tags with current route and active language.
 */
export function useSEO(options = {}) {
    const location = useLocation();
    const { lang } = useAppContext();

    const pathname = options.pathname || location.pathname;
    const activeLang = options.lang || lang;
    const customTitle = options.title || null;
    const customDescription = options.description || null;
    const customImage = options.image || null;

    useEffect(() => {
        updateDocumentSEO({
            pathname,
            lang: activeLang,
            customTitle,
            customDescription,
            customImage
        });
    }, [pathname, activeLang, customTitle, customDescription, customImage]);
}

export default useSEO;
