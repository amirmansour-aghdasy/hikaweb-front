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
 * 
 * IMPORTANT: Uses localStorage to ensure persistence across sessions
 */
export function generateBrowserFingerprint() {
    if (typeof window === 'undefined') {
        return '';
    }

    try {
        // First, check if we have a stored fingerprint (persistent across sessions)
        const storageKey = 'hikaweb_browser_fingerprint';
        let storedFingerprint = null;
        
        try {
            storedFingerprint = localStorage.getItem(storageKey);
        } catch (e) {
            // localStorage might be disabled or full
        }
        
        // If we have a stored fingerprint, use it (ensures consistency)
        if (storedFingerprint && storedFingerprint.length > 10) {
            return storedFingerprint;
        }

        // Generate new fingerprint from browser characteristics
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
            // Add hardware concurrency for better uniqueness
            hardwareConcurrency: navigator.hardwareConcurrency || 0,
            // Add max touch points
            maxTouchPoints: navigator.maxTouchPoints || 0,
        };

        // Create a hash-like string from the fingerprint
        const fingerprintString = JSON.stringify(fingerprint);
        
        // Use a better hash function (SHA-256 like approach but simpler)
        // This creates a more unique identifier
        let hash = 0;
        for (let i = 0; i < fingerprintString.length; i++) {
            const char = fingerprintString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        // Create a more unique identifier by combining hash with timestamp (first time only)
        const timestamp = storedFingerprint ? '' : Date.now().toString(36);
        const fingerprintHash = Math.abs(hash).toString(36) + timestamp;
        
        // Store in localStorage for persistence
        try {
            localStorage.setItem(storageKey, fingerprintHash);
        } catch (e) {
            // If localStorage fails, continue with generated fingerprint
            console.warn('Could not store fingerprint in localStorage:', e);
        }
        
        return fingerprintHash;
    } catch (error) {
        console.warn('Error generating browser fingerprint:', error);
        // Fallback: use a stored ID or create a new one
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
 * Get browser fingerprint (with caching and persistence)
 * This ensures the same fingerprint is used across page reloads and sessions
 */
let cachedFingerprint = null;

export function getBrowserFingerprint() {
    if (typeof window === 'undefined') {
        return '';
    }

    // Check cache first
    if (cachedFingerprint) {
        return cachedFingerprint;
    }

    // Try to get from localStorage first (for persistence)
    try {
        const stored = localStorage.getItem('hikaweb_browser_fingerprint');
        if (stored && stored.length > 10) {
            cachedFingerprint = stored;
            return cachedFingerprint;
        }
    } catch (e) {
        // localStorage might be disabled
    }

    // Generate new fingerprint if not found
    cachedFingerprint = generateBrowserFingerprint();
    return cachedFingerprint;
}

