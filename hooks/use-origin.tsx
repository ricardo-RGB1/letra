import { useEffect, useState } from 'react';



/**
 * Custom hook that returns the origin of the current window.
 * If the window object is not available (e.g., server-side rendering), an empty string is returned.
 * @returns {string} The origin of the current window.
 */
export const useOrigin = () => {
    const [mounted, setMounted] = useState(false);
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''; // Get the origin of the current window

    useEffect(() => {
        setMounted(true);
    }, []);

    if(!mounted) {
        return "";
    }

    return origin; 
}