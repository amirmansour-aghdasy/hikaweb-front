"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/services/api/client";
import { MagnifyingGlass } from "@/lib/icons/svg";
import { BsClock, BsEye, BsGrid3X3, BsList, BsPlayFill } from "react-icons/bs";
import { HiOutlineFire, HiSparkles, HiHeart, HiBookmark } from "react-icons/hi";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import VideoCard from "./VideoCard";

export default function VideoListClient({ 
    initialVideos = [], 
    initialPagination = { page: 1, limit: 12, total: 0, totalPages: 1 },
    initialSearch = "",
    initialCategory = "",
    initialSortBy = "publishedAt",
    initialSortOrder = "desc"
}) {
    const router = useRouter();
    const searchParamsHook = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [categoryFilter, setCategoryFilter] = useState(initialCategory);
    const [sortBy, setSortBy] = useState(initialSortBy);
    const [sortOrder, setSortOrder] = useState(initialSortOrder);
    const [videos, setVideos] = useState(Array.isArray(initialVideos) ? initialVideos : []);
    const [pagination, setPagination] = useState({
        page: parseInt(initialPagination?.page) || 1,
        limit: parseInt(initialPagination?.limit) || 12,
        total: parseInt(initialPagination?.total) || 0,
        totalPages: parseInt(initialPagination?.totalPages) || 1,
        hasNext: initialPagination?.hasNext || false,
        hasPrev: initialPagination?.hasPrev || false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    // Update URL when filters change
    const updateURL = (newPage, newSearch, newCategory, newSortBy, newSortOrder) => {
        const params = new URLSearchParams();
        if (newPage > 1) params.set('page', newPage.toString());
        if (newSearch && newSearch.trim() !== '') params.set('search', newSearch);
        if (newCategory && newCategory !== 'all') params.set('category', newCategory);
        if (newSortBy !== 'publishedAt') params.set('sortBy', newSortBy);
        if (newSortOrder !== 'desc') params.set('sortOrder', newSortOrder);
        
        const queryString = params.toString();
        const newURL = queryString ? `/theater?${queryString}` : '/theater';
        router.push(newURL, { scroll: false });
    };

    // Fetch videos when URL changes
    useEffect(() => {
        const fetchVideos = async () => {
            const page = parseInt(searchParamsHook?.get('page')) || 1;
            const search = searchParamsHook?.get('search') || '';
            const category = searchParamsHook?.get('category') || '';
            const sortByParam = searchParamsHook?.get('sortBy') || 'publishedAt';
            const sortOrderParam = searchParamsHook?.get('sortOrder') || 'desc';
            
            setIsLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    isPublished: "true",
                    page: page.toString(),
                    limit: "12",
                    sortBy: sortByParam,
                    sortOrder: sortOrderParam,
                    language: "fa"
                });
                
                if (search && search.trim() !== '') {
                    queryParams.append('search', search);
                }
                
                if (category && category !== 'all' && category.trim() !== '') {
                    queryParams.append('category', category);
                }
                
                const response = await apiClient.get(`/videos?${queryParams.toString()}`);
                const videosData = response.data || [];
                const paginationData = response.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 };
                
                setVideos(Array.isArray(videosData) ? videosData : []);
                setPagination({
                    page: parseInt(paginationData.page) || 1,
                    limit: parseInt(paginationData.limit) || 12,
                    total: parseInt(paginationData.total) || 0,
                    totalPages: parseInt(paginationData.totalPages) || 1,
                    hasNext: paginationData.hasNext || false,
                    hasPrev: paginationData.hasPrev || false
                });
                setSearchTerm(search);
                setCategoryFilter(category || 'all');
                setSortBy(sortByParam);
                setSortOrder(sortOrderParam);
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos();
    }, [searchParamsHook]);

    const handleSearch = (e) => {
        e.preventDefault();
        updateURL(1, searchTerm, categoryFilter, sortBy, sortOrder);
    };

    const handleSortChange = (newSortBy, newSortOrder) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        updateURL(1, searchTerm, categoryFilter, newSortBy, newSortOrder);
    };

    const handlePageChange = (newPage) => {
        updateURL(newPage, searchTerm, categoryFilter, sortBy, sortOrder);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <main className="w-full min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full py-8 md:py-12 overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgb(20 184 166) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>
                
                <div className="relative w-full max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-8" data-aos="fade-up">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
                            تماشاخانه <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">هیکاوب</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            ویدئوهای آموزشی و تخصصی با کیفیت بالا
                        </p>
                    </div>
                    
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="جستجو در ویدئوها..."
                                    className="w-full h-16 px-6 text-slate-800 dark:text-slate-100 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent focus:outline-none"
                                />
                                <button 
                                    type="submit"
                                    className="absolute left-4 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                    <MagnifyingGlass className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

            {/* Main Content */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {/* Sort and View Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [newSortBy, newSortOrder] = e.target.value.split('-');
                                handleSortChange(newSortBy, newSortOrder);
                            }}
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="publishedAt-desc">جدیدترین</option>
                            <option value="publishedAt-asc">قدیمی‌ترین</option>
                            <option value="views-desc">پربازدیدترین</option>
                            <option value="likes-desc">محبوب‌ترین</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'grid' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                            aria-label="Grid view"
                        >
                            <BsGrid3X3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'list' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                            aria-label="List view"
                        >
                            <BsList className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Videos Grid/List */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-600 dark:text-slate-400 text-lg">ویدئویی یافت نشد</p>
                    </div>
                ) : (
                    <>
                        <div className={viewMode === 'grid' 
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "space-y-4"
                        }>
                            {videos.map((video) => (
                                <VideoCard 
                                    key={video._id} 
                                    video={video}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={!pagination.hasPrev}
                                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                                >
                                    <FiArrowRight className="w-4 h-4" />
                                    قبلی
                                </button>
                                
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (pagination.totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (pagination.page <= 3) {
                                            pageNum = i + 1;
                                        } else if (pagination.page >= pagination.totalPages - 2) {
                                            pageNum = pagination.totalPages - 4 + i;
                                        } else {
                                            pageNum = pagination.page - 2 + i;
                                        }
                                        
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-4 py-2 rounded-lg transition-colors ${
                                                    pagination.page === pageNum
                                                        ? 'bg-teal-600 text-white'
                                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={!pagination.hasNext}
                                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                                >
                                    بعدی
                                    <FiArrowLeft className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

