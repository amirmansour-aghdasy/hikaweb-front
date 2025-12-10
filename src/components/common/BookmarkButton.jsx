"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { apiClient } from "@/services/api/client";
import useAuthStore from "@/lib/store/authStore";
import toast from "react-hot-toast";

export default function BookmarkButton({ 
    articleId, 
    variant = "default", // "default" | "icon-only" | "minimal"
    className = "",
    onToggle = null
}) {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // Check bookmark status on mount
    useEffect(() => {
        const checkBookmark = async () => {
            if (!isAuthenticated || !user || !articleId) {
                setIsChecking(false);
                return;
            }

            try {
                const response = await apiClient.get(`/articles/${articleId}/bookmark/check`);
                setIsBookmarked(response.data?.isBookmarked || false);
            } catch (error) {
                // Ignore errors (user might not have permission)
                setIsBookmarked(false);
            } finally {
                setIsChecking(false);
            }
        };

        checkBookmark();
    }, [articleId, isAuthenticated, user]);

    const handleBookmark = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("لطفا ابتدا وارد شوید");
            router.push("/auth?redirect=" + encodeURIComponent(window.location.pathname));
            return;
        }

        if (!articleId) return;

        setIsLoading(true);
        try {
            const response = await apiClient.post(`/articles/${articleId}/bookmark`);
            const newBookmarkStatus = response.data?.isBookmarked || false;
            setIsBookmarked(newBookmarkStatus);
            
            if (onToggle) {
                onToggle(newBookmarkStatus);
            }
            
            toast.success(newBookmarkStatus ? "مقاله به نشان‌ها اضافه شد" : "مقاله از نشان‌ها حذف شد");
        } catch (error) {
            toast.error("خطا در نشان کردن مقاله");
        } finally {
            setIsLoading(false);
        }
    };

    // Icon only variant (for cards)
    if (variant === "icon-only") {
        return (
            <button
                onClick={handleBookmark}
                disabled={isLoading || isChecking}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 shadow-lg ${
                    isBookmarked
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-teal-600 hover:text-white'
                } ${isLoading || isChecking ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
                title={isBookmarked ? "حذف از نشان‌ها" : "نشان کردن"}
            >
                {isBookmarked ? (
                    <BsBookmarkFill className="w-5 h-5" />
                ) : (
                    <BsBookmark className="w-5 h-5" />
                )}
            </button>
        );
    }

    // Minimal variant (small button with icon + text)
    if (variant === "minimal") {
        return (
            <button
                onClick={handleBookmark}
                disabled={isLoading || isChecking}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                    isBookmarked
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                } ${isLoading || isChecking ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            >
                {isBookmarked ? (
                    <BsBookmarkFill className="w-4 h-4" />
                ) : (
                    <BsBookmark className="w-4 h-4" />
                )}
                <span>{isBookmarked ? 'نشان شده' : 'نشان کن'}</span>
            </button>
        );
    }

    // Default variant (full button)
    return (
        <button
            onClick={handleBookmark}
            disabled={isLoading || isChecking}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                isBookmarked
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            } ${isLoading || isChecking ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {isBookmarked ? (
                <BsBookmarkFill className="w-5 h-5" />
            ) : (
                <BsBookmark className="w-5 h-5" />
            )}
        </button>
    );
}

