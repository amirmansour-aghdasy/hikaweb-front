/**
 * Global Error Handler Utility
 * Handles unhandled errors and provides user-friendly error messages
 */

import toast from "react-hot-toast";

/**
 * Get user-friendly error message
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export function getErrorMessage(error) {
    // Handle different error types
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    
    if (error?.data?.message) {
        return error.data.message;
    }
    
    if (error?.message) {
        // Filter out technical error messages in production
        if (process.env.NODE_ENV === 'production') {
            // Common error messages that should be shown
            const userFriendlyMessages = [
                'timeout',
                'network',
                'connection',
                'failed to fetch',
                'unauthorized',
                'forbidden',
                'not found',
                'server error'
            ];
            
            const errorMessage = error.message.toLowerCase();
            const isUserFriendly = userFriendlyMessages.some(msg => errorMessage.includes(msg));
            
            if (isUserFriendly) {
                return error.message;
            }
            
            // Return generic message for technical errors in production
            return 'خطایی رخ داد. لطفاً دوباره تلاش کنید.';
        }
        
        return error.message;
    }
    
    return 'خطایی رخ داد. لطفاً دوباره تلاش کنید.';
}

/**
 * Handle API errors gracefully
 * @param {Error} error - Error object
 * @param {Object} options - Error handling options
 * @returns {void}
 */
export function handleApiError(error, options = {}) {
    const {
        showToast = true,
        fallbackMessage = 'خطایی در ارتباط با سرور رخ داد. لطفاً دوباره تلاش کنید.',
        logError = true
    } = options;

    // Log error in development or if explicitly requested
    if (logError && (process.env.NODE_ENV === 'development' || options.forceLog)) {
        console.error('API Error:', error);
    }

    // Show toast notification if requested
    if (showToast) {
        const message = getErrorMessage(error) || fallbackMessage;
        toast.error(message);
    }
}

/**
 * Handle async function errors
 * @param {Function} asyncFn - Async function to wrap
 * @param {Object} options - Error handling options
 * @returns {Function} Wrapped function
 */
export function withErrorHandling(asyncFn, options = {}) {
    return async (...args) => {
        try {
            return await asyncFn(...args);
        } catch (error) {
            handleApiError(error, options);
            throw error; // Re-throw to allow caller to handle if needed
        }
    };
}

/**
 * Safe async wrapper that returns null on error instead of throwing
 * @param {Function} asyncFn - Async function to wrap
 * @param {Object} options - Error handling options
 * @returns {Function} Wrapped function that returns null on error
 */
export function safeAsync(asyncFn, options = {}) {
    return async (...args) => {
        try {
            return await asyncFn(...args);
        } catch (error) {
            handleApiError(error, options);
            return null;
        }
    };
}

/**
 * Setup global error handlers
 */
export function setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return;

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        // Prevent default error handling
        event.preventDefault();
        
        const error = event.reason;
        
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Unhandled Promise Rejection:', error);
        }
        
        // Show user-friendly error message
        const message = getErrorMessage(error);
        toast.error(message || 'خطایی رخ داد. لطفاً صفحه را رفرش کنید.');
    });

    // Handle global JavaScript errors
    window.addEventListener('error', (event) => {
        // Prevent default error handling
        event.preventDefault();
        
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Global Error:', event.error);
        }
        
        // Show user-friendly error message
        toast.error('خطایی در صفحه رخ داد. لطفاً صفحه را رفرش کنید.');
        
        // Return true to prevent default error handling
        return true;
    });
}

