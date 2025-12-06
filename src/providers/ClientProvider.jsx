'use client';

import { useEffect, useRef } from 'react';
import AOS from 'aos';
import { registerServiceWorker } from '@/lib/pwa';
import useAuthStore from '@/lib/store/authStore';

export default function ClientProvider({ children }) {
    const init = useAuthStore((state) => state.init);
    const hasInitialized = useRef(false);

    useEffect(() => {
        // Initialize AOS only on client-side after hydration
        if (typeof window !== 'undefined' && !hasInitialized.current) {
            hasInitialized.current = true;
            
            // Initialize AOS with proper configuration
            const initAOS = () => {
                AOS.init({
                    duration: 1000,
                    once: true,
                    offset: 100,
                    startEvent: 'DOMContentLoaded',
                    disable: false,
                    // Mark HTML as initialized after AOS is ready
                    initClassName: 'aos-initialized',
                    animatedClassName: 'aos-animate',
                });
                
                // Mark HTML as initialized (AOS doesn't do this automatically)
                document.documentElement.classList.add('aos-initialized');
                
                // Refresh AOS to apply animations to already rendered elements
                AOS.refresh();
            };

            // Initialize immediately if DOM is ready, otherwise wait for DOMContentLoaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initAOS);
            } else {
                // DOM is already ready, initialize immediately
                initAOS();
            }

            registerServiceWorker();
            // Initialize auth state only once
            init();

            return () => {
                document.removeEventListener('DOMContentLoaded', initAOS);
            };
        }
    }, []); // Empty dependency array - only run once on mount

    return <>{children}</>;
}
