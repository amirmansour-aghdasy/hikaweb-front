/**
 * Browser Fingerprinting Utility
 * Generates a unique identifier for the browser/device without requiring login
 * Similar to how WordPress tracks unique visitors
 * 
 * This combines multiple browser characteristics to create a unique fingerprint:
 * - Screen resolution
 * - Timezone
 * - Language
 * - Platform
 * - User Agent
 * - Canvas fingerprint (if available)
 */

/**
 * Generate a simple browser fingerprint
 * This is a lightweight approach that doesn't require canvas fingerprinting
 * which can be blocked by privacy extensions
 */
export function generateBrowserFingerprint() {
    if (typeof window === 'undefined') {
        return '';
    }

    try {
        const fingerprint = {
            screen: {
                width: window.screen?.width || 0,
                height: window.screen?.height || 0,
                colorDepth: window.screen?.colorDepth || 0,
            },
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
            language: navigator.language || navigator.userLanguage || '',
            platform: navigator.platform || '',
            userAgent: navigator.userAgent || '',
            cookieEnabled: navigator.cookieEnabled || false,
            doNotTrack: navigator.doNotTrack || '',
        };

        // Create a hash-like string from the fingerprint
        const fingerprintString = JSON.stringify(fingerprint);
        
        // Use a simple hash function (not cryptographic, but sufficient for this use case)
        let hash = 0;
        for (let i = 0; i < fingerprintString.length; i++) {
            const char = fingerprintString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return Math.abs(hash).toString(36);
    } catch (error) {
        console.warn('Error generating browser fingerprint:', error);
        // Fallback: use a random ID stored in localStorage
        return getOrCreateStoredFingerprint();
    }
}

/**
 * Get or create a stored fingerprint in localStorage
 * This provides a fallback if fingerprinting fails
 */
function getOrCreateStoredFingerprint() {
    if (typeof window === 'undefined') {
        return '';
    }

    try {
        const storageKey = 'hikaweb_browser_fingerprint';
        let fingerprint = localStorage.getItem(storageKey);
        
        if (!fingerprint) {
            // Generate a random ID
            fingerprint = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
            localStorage.setItem(storageKey, fingerprint);
        }
        
        return fingerprint;
    } catch (error) {
        console.warn('Error accessing localStorage for fingerprint:', error);
        // Last resort: use sessionStorage
        try {
            const sessionKey = 'hikaweb_browser_fingerprint_session';
            let fingerprint = sessionStorage.getItem(sessionKey);
            
            if (!fingerprint) {
                fingerprint = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
                sessionStorage.setItem(sessionKey, fingerprint);
            }
            
            return fingerprint;
        } catch (sessionError) {
            console.warn('Error accessing sessionStorage for fingerprint:', sessionError);
            return '';
        }
    }
}

/**
 * Get browser fingerprint (with caching)
 */
let cachedFingerprint = null;

export function getBrowserFingerprint() {
    if (typeof window === 'undefined') {
        return '';
    }

    if (cachedFingerprint) {
        return cachedFingerprint;
    }

    cachedFingerprint = generateBrowserFingerprint();
    return cachedFingerprint;
}

