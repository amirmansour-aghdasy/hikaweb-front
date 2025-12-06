/**
 * Security utilities for sanitizing user input and preventing XSS attacks
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHTML(html) {
    if (!html || typeof html !== 'string') return '';
    
    // Remove script tags and event handlers
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/data:text\/html/gi, '');
}

/**
 * Sanitize text content (remove HTML tags)
 * @param {string} text - Text to sanitize
 * @returns {string} - Plain text
 */
export function sanitizeText(text) {
    if (!text || typeof text !== 'string') return '';
    
    // Remove all HTML tags
    return text.replace(/<[^>]*>/g, '');
}

/**
 * Validate phone number format (Iranian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export function validatePhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') return false;
    
    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');
    
    // Check Iranian phone format: 09xxxxxxxxx or +989xxxxxxxxx
    return /^(09|\+989|00989)\d{9}$/.test(cleaned);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export function validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export function escapeHTML(text) {
    if (!text || typeof text !== 'string') return '';
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Sanitize URL to prevent XSS
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL
 */
export function sanitizeURL(url) {
    if (!url || typeof url !== 'string') return '';
    
    // Only allow http, https, and relative URLs
    if (/^(https?:\/\/|\/)/.test(url)) {
        return url;
    }
    
    return '';
}

