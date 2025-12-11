/**
 * Safe Server GET wrapper
 * Wraps serverGet calls to handle errors gracefully
 */

import { serverGet } from "@/lib/api/server";

/**
 * Safe server GET that returns null on error instead of throwing
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<object|null>} API response or null on error
 */
export async function safeServerGet(endpoint, options = {}) {
    try {
        return await serverGet(endpoint, options);
    } catch (error) {
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
            console.error(`Error fetching ${endpoint}:`, error);
        }
        
        // Return null to allow page to continue rendering
        return null;
    }
}

/**
 * Safe server GET that returns default value on error
 * @param {string} endpoint - API endpoint
 * @param {any} defaultValue - Default value to return on error
 * @param {object} options - Fetch options
 * @returns {Promise<any>} API response or default value
 */
export async function safeServerGetWithDefault(endpoint, defaultValue = null, options = {}) {
    try {
        const result = await serverGet(endpoint, options);
        return result?.data || defaultValue;
    } catch (error) {
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
            console.error(`Error fetching ${endpoint}:`, error);
        }
        
        return defaultValue;
    }
}

/**
 * Safe Promise.allSettled wrapper that handles errors gracefully
 * @param {Array<Promise>} promises - Array of promises
 * @returns {Promise<Array>} Array of settled results
 */
export async function safePromiseAllSettled(promises) {
    try {
        return await Promise.allSettled(promises);
    } catch (error) {
        // This should never happen, but just in case
        if (process.env.NODE_ENV === 'development') {
            console.error('Error in Promise.allSettled:', error);
        }
        return promises.map(() => ({ status: 'rejected', reason: error }));
    }
}

