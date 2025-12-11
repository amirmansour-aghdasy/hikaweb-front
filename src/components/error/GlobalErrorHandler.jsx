"use client";

import { useEffect } from "react";
import { setupGlobalErrorHandlers } from "@/lib/utils/errorHandler";

/**
 * Global Error Handler Component
 * Sets up global error handlers for unhandled errors
 */
export default function GlobalErrorHandler() {
    useEffect(() => {
        // Setup global error handlers
        setupGlobalErrorHandlers();
    }, []);

    return null;
}

