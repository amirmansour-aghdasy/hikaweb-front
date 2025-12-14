"use client";

import { useState, useEffect } from "react";
import { FaCopy, FaCheck, FaLink, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { apiClient } from "@/services/api/client";

/**
 * ShortLinkBox Component
 * Creates and displays a short link with copy functionality
 * SEO-friendly and accessible
 * 
 * @param {string} originalUrl - The full URL to shorten
 * @param {string} resourceType - Type of resource (article, service, portfolio, etc.)
 * @param {string} resourceId - ID of the resource
 * @param {string} label - Optional label (default: "لینک کوتاه")
 * @param {string} className - Additional CSS classes
 */
export default function ShortLinkBox({ 
    originalUrl, 
    resourceType = null, 
    resourceId = null,
    label = "لینک کوتاه", 
    className = "" 
}) {
    const [copied, setCopied] = useState(false);
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (originalUrl) {
            fetchOrCreateShortLink();
        }
    }, [originalUrl, resourceType, resourceId]);

    const fetchOrCreateShortLink = async () => {
        if (!originalUrl) return;

        setLoading(true);
        setError(null);

        try {
            // Try to get existing short link first
            let shortLink = null;
            
            if (resourceType && resourceId) {
                try {
                    const response = await apiClient.get(`/shortlinks/resource/${resourceType}/${resourceId}`);
                    // apiClient returns the full JSON response: { success: true, data: { shortLink: ... } }
                    shortLink = response?.data?.shortLink || null;
                    // If shortLink is null, it means it doesn't exist yet (not an error)
                } catch (err) {
                    // If error is 404, it's fine - we'll create a new one
                    if (err.response?.status !== 404 && err.status !== 404) {
                        console.error('Error fetching short link:', err);
                    }
                }
            }

            // If no existing short link, create one
            if (!shortLink) {
                const response = await apiClient.post('/shortlinks/get-or-create', {
                    originalUrl,
                    resourceType: resourceType || 'other',
                    resourceId: resourceId || null
                });
                
                // apiClient returns: { success: true, data: { shortLink: ... } }
                shortLink = response?.data?.shortLink || null;
                
                // Debug log in development
                if (process.env.NODE_ENV === 'development') {
                    console.log('Short link create response:', { 
                        fullResponse: response, 
                        shortLink,
                        responseData: response?.data
                    });
                }
            }

            if (shortLink?.shortCode) {
                const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                const shortLinkUrl = `${baseUrl}/b/${shortLink.shortCode}`;
                setShortUrl(shortLinkUrl);
                setError(null); // Clear any previous errors
            } else {
                // If we got a response but no shortCode, log it
                if (process.env.NODE_ENV === 'development') {
                    console.warn('Short link created but no shortCode:', shortLink);
                }
                setError('خطا در ایجاد لینک کوتاه');
            }
        } catch (error) {
            console.error('Error creating short link:', error);
            setError('خطا در ایجاد لینک کوتاه');
            // Fallback to original URL
            setShortUrl(originalUrl);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!shortUrl) return;

        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopied(true);
            toast.success("لینک کوتاه کپی شد!");
            
            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Error copying to clipboard:", error);
            toast.error("خطا در کپی لینک");
        }
    };

    if (!originalUrl) return null;

    return (
        <div 
            className={`relative flex items-center gap-3 p-3.5 md:p-4 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-600 transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
            data-aos="fade-up"
        >
            {/* Icon */}
            <div className="flex-shrink-0 p-3 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
                {loading ? (
                    <FaSpinner className="w-5 h-5 text-teal-600 dark:text-teal-400 animate-spin" />
                ) : (
                    <FaLink className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        {label}
                    </div>
                    {error && (
                        <span className="text-xs text-red-500 dark:text-red-400">خطا</span>
                    )}
                </div>
                
                {loading ? (
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">در حال ایجاد...</span>
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-red-500 dark:text-red-400">
                            {error}
                        </div>
                        <button
                            onClick={fetchOrCreateShortLink}
                            className="text-xs text-teal-600 dark:text-teal-400 hover:underline px-2 py-1 rounded hover:bg-teal-50 dark:hover:bg-teal-900/20"
                        >
                            تلاش مجدد
                        </button>
                    </div>
                ) : shortUrl ? (
                    <div className="flex items-center gap-2">
                        <div 
                            className="flex-1 text-sm md:text-base font-mono text-slate-800 dark:text-slate-200 truncate bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
                            title={shortUrl}
                        >
                            {shortUrl}
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        در حال ایجاد لینک کوتاه...
                    </div>
                )}
            </div>

            {/* Copy Button */}
            <button
                onClick={handleCopy}
                disabled={!shortUrl || loading}
                className="flex-shrink-0 p-3 bg-white dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 border-2 border-slate-200 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-600 rounded-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                aria-label="کپی لینک کوتاه"
                title="کپی لینک کوتاه"
            >
                {copied ? (
                    <FaCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                    <FaCopy className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300" />
                )}
            </button>

            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/0 to-teal-500/5 rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>
    );
}
