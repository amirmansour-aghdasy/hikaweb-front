/**
 * Error Logger Utility
 * Handles error logging for production without exposing errors to users
 */

/**
 * Log error to error reporting service
 * @param {Error} error - Error object
 * @param {Object} context - Additional context information
 * @param {string} level - Error level (error, warning, info)
 */
export function logError(error, context = {}, level = 'error') {
    // Only log in production, never expose to console
    if (process.env.NODE_ENV !== 'production') {
        return;
    }

    try {
        // Prepare error data
        const errorData = {
            message: error?.message || 'Unknown error',
            stack: error?.stack || '',
            name: error?.name || 'Error',
            level,
            context: {
                ...context,
                url: typeof window !== 'undefined' ? window.location.href : '',
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
                timestamp: new Date().toISOString(),
            },
        };

        // Send to error reporting API (if configured)
        if (process.env.NEXT_PUBLIC_ERROR_REPORTING_API) {
            fetch(process.env.NEXT_PUBLIC_ERROR_REPORTING_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(errorData),
                // Don't wait for response, fire and forget
            }).catch(() => {
                // Silently fail if error reporting fails
            });
        }

        // Optionally log to localStorage for debugging (limited to last 10 errors)
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                const errorLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
                errorLogs.push({
                    ...errorData,
                    id: Date.now(),
                });
                
                // Keep only last 10 errors
                const recentErrors = errorLogs.slice(-10);
                localStorage.setItem('errorLogs', JSON.stringify(recentErrors));
            } catch (e) {
                // Silently fail if localStorage is not available
            }
        }
    } catch (loggingError) {
        // Silently fail if error logging itself fails
        // We don't want error logging to cause more errors
    }
}

/**
 * Log error with user-friendly message
 * @param {Error} error - Error object
 * @param {string} userMessage - User-friendly error message
 * @param {Object} context - Additional context
 */
export function logErrorWithMessage(error, userMessage, context = {}) {
    logError(error, {
        ...context,
        userMessage,
    }, 'error');
}

/**
 * Log warning
 * @param {string} message - Warning message
 * @param {Object} context - Additional context
 */
export function logWarning(message, context = {}) {
    logError(new Error(message), context, 'warning');
}

