"use client";

import { useState, useEffect, useMemo } from "react";
import { MdOutlineArticle } from "react-icons/md";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { FaBriefcase } from "react-icons/fa";
import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { apiClient } from "@/services/api/client";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "./Pagination";

export default function BookmarksTab({ user, searchQuery = "" }) {
    const [activeSubTab, setActiveSubTab] = useState(0);
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [removingBookmark, setRemovingBookmark] = useState(null);
    const LIMIT = 10; // Default limit per page

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const subTabs = [
        { id: 0, label: "مقالات", icon: <MdOutlineArticle className="w-5 h-5" /> },
        { id: 1, label: "ویدئوها", icon: <HiOutlineVideoCamera className="w-5 h-5" /> },
        { id: 2, label: "نمونه کارها", icon: <FaBriefcase className="w-5 h-5" /> },
    ];

    useEffect(() => {
        if (activeSubTab === 0) {
            // Only fetch articles bookmarks for now (videos and portfolios will be implemented later)
            setPage(1); // Reset page when search query changes
            fetchBookmarks(1, debouncedSearchQuery);
        } else {
            // For videos and portfolios, show "coming soon" message
            setBookmarks([]);
            setLoading(false);
            setTotalPages(1);
        }
    }, [activeSubTab, debouncedSearchQuery]);

    useEffect(() => {
        if (activeSubTab === 0) {
            // Fetch when page changes
            fetchBookmarks(page, debouncedSearchQuery);
        }
    }, [page]);

    const fetchBookmarks = async (pageNum = page, currentSearchQuery = "") => {
        try {
            setLoading(true);
            const searchParam = currentSearchQuery ? `&search=${encodeURIComponent(currentSearchQuery)}` : "";
            const response = await apiClient.get(`/bookmarks?page=${pageNum}&limit=${LIMIT}${searchParam}`);
            
            // Response structure: { success: true, data: [...], pagination: {...} }
            const fetchedBookmarks = response.data || [];
            const pagination = response.pagination || {};
            
            // Calculate totalPages from pagination.total if totalPages is not provided
            const calculatedTotalPages = pagination.totalPages || (pagination.total ? Math.ceil(pagination.total / LIMIT) : 1);
            
            setBookmarks(fetchedBookmarks);
            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
            if (error.status !== 401 && error.status !== 403) {
                toast.error("خطا در دریافت نشان‌گذاری‌ها");
            }
            // Set empty state on error
            setBookmarks([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleRemoveBookmark = async (articleId) => {
        if (removingBookmark === articleId) return;
        
        setRemovingBookmark(articleId);
        try {
            await apiClient.post(`/articles/${articleId}/bookmark`);
            setBookmarks(prev => prev.filter(bookmark => bookmark._id !== articleId));
            toast.success("مقاله از نشان‌ها حذف شد");
            // Refresh stats
            window.dispatchEvent(new Event('refreshStats'));
        } catch (error) {
            console.error("Error removing bookmark:", error);
            toast.error("خطا در حذف نشان");
        } finally {
            setRemovingBookmark(null);
        }
    };


    // Filter bookmarks based on search query
    const filteredBookmarks = useMemo(() => {
        if (!debouncedSearchQuery.trim()) {
            return bookmarks;
        }

        const query = debouncedSearchQuery.toLowerCase().trim();
        return bookmarks.filter(bookmark => {
            const title = (bookmark.title?.fa || bookmark.title || "").toLowerCase();
            const excerpt = (bookmark.excerpt?.fa || bookmark.shortDescription?.fa || "").toLowerCase();
            return title.includes(query) || excerpt.includes(query);
        });
    }, [bookmarks, debouncedSearchQuery]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat("fa-IR", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }).format(date);
        } catch {
            return "";
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">نشان‌گذاری‌ها</h2>
            
            {/* Sub Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-700">
                <div className="flex gap-1">
                    {subTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveSubTab(tab.id);
                                setPage(1);
                                setBookmarks([]);
                            }}
                            className={`
                                flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                                ${activeSubTab === tab.id
                                    ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                                }
                            `}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="py-4">
                {activeSubTab === 0 && (
                    <>
                        {loading && bookmarks.length === 0 ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 animate-pulse">
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-lg flex-shrink-0"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredBookmarks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <BsBookmark className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                                    {debouncedSearchQuery ? "نتیجه‌ای یافت نشد" : "هنوز مقاله‌ای نشان‌گذاری نکرده‌اید"}
                                </p>
                                <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                                    {debouncedSearchQuery 
                                        ? "لطفاً عبارت جستجوی دیگری امتحان کنید" 
                                        : "مقالات مورد علاقه خود را نشان‌گذاری کنید تا بعداً راحت‌تر به آن‌ها دسترسی داشته باشید"
                                    }
                                </p>
                                {!debouncedSearchQuery && (
                                    <Link
                                        href="/mag"
                                        className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                                    >
                                        مشاهده مقالات
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredBookmarks.map((bookmark) => {
                                    const title = bookmark.title?.fa || bookmark.title || "مقاله";
                                    const slug = bookmark.slug?.fa || bookmark.slug?.en || bookmark.slug || bookmark._id;
                                    const thumbnail = bookmark.featuredImage || "/assets/images/post-thumb-1.webp";
                                    const excerpt = bookmark.excerpt?.fa || bookmark.shortDescription?.fa || "";
                                    const readTime = bookmark.readTime || 5;
                                    const publishedAt = bookmark.publishedAt || bookmark.createdAt;

                                    return (
                                        <div
                                            key={bookmark._id}
                                            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex gap-4">
                                                <Link
                                                    href={`/mag/${slug}`}
                                                    className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 relative group"
                                                >
                                                    <Image
                                                        src={thumbnail}
                                                        alt={title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        sizes="96px"
                                                    />
                                                </Link>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <Link
                                                            href={`/mag/${slug}`}
                                                            className="flex-1 min-w-0"
                                                        >
                                                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-2">
                                                                {title}
                                                            </h3>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleRemoveBookmark(bookmark._id)}
                                                            disabled={removingBookmark === bookmark._id}
                                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
                                                            title="حذف از نشان‌ها"
                                                        >
                                                            <BsBookmarkFill className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                                        </button>
                                                    </div>
                                                    {excerpt && (
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                                            {excerpt}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                                        <span>{readTime} دقیقه مطالعه</span>
                                                        {publishedAt && (
                                                            <span>{formatDate(publishedAt)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                {totalPages > 1 && (
                                    <div className="mt-8">
                                        <Pagination
                                            currentPage={page}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                            loading={loading}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
                {activeSubTab === 1 && (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <HiOutlineVideoCamera className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                        <p className="text-lg font-medium">ویدئوهای نشان‌گذاری شده</p>
                        <p className="text-sm mt-2">این بخش به زودی اضافه خواهد شد</p>
                    </div>
                )}
                {activeSubTab === 2 && (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <FaBriefcase className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                        <p className="text-lg font-medium">نمونه کارهای نشان‌گذاری شده</p>
                        <p className="text-sm mt-2">این بخش به زودی اضافه خواهد شد</p>
                    </div>
                )}
            </div>
        </div>
    );
}
