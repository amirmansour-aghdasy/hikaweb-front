"use client";

import { useState, useCallback } from "react";
import { handleApiError } from "@/lib/utils/errorHandler";

/**
 * Hook for safe async operations with error handling
 * @param {Function} asyncFn - Async function to wrap
 * @param {Object} options - Error handling options
 * @returns {Object} { execute, loading, error, data }
 */
export function useSafeAsync(asyncFn, options = {}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const execute = useCallback(async (...args) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await asyncFn(...args);
            setData(result);
            return result;
        } catch (err) {
            setError(err);
            handleApiError(err, options);
            throw err; // Re-throw to allow caller to handle if needed
        } finally {
            setLoading(false);
        }
    }, [asyncFn, options]);

    return { execute, loading, error, data };
}

/**
 * Hook for safe async operations that return null on error
 * @param {Function} asyncFn - Async function to wrap
 * @param {Object} options - Error handling options
 * @returns {Object} { execute, loading, data }
 */
export function useSafeAsyncNullable(asyncFn, options = {}) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const execute = useCallback(async (...args) => {
        setLoading(true);
        
        try {
            const result = await asyncFn(...args);
            setData(result);
            return result;
        } catch (err) {
            handleApiError(err, options);
            setData(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, [asyncFn, options]);

    return { execute, loading, data };
}

