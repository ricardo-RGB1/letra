import { useState, useEffect } from 'react';


/**
 * Custom hook that tracks the scroll position of the window and returns whether the scroll position has exceeded a given threshold.
 * @param threshold - The threshold value at which the scroll position is considered scrolled.
 * @returns A boolean value indicating whether the scroll position has exceeded the threshold.
 */
export const useScrollTop = (threshold = 10) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > threshold) { 
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        }
        // Add event listener to window object
        window.addEventListener('scroll', handleScroll); 

        // Remove event listener when component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [threshold]); // Re-run effect when threshold changes

    return scrolled; // Return the current scroll state
}