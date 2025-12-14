"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/services/api/client";
import { MagnifyingGlass } from "@/lib/icons/svg";
import { BsClock, BsEye, BsGrid3X3, BsList } from "react-icons/bs";
import { HiOutlineFire, HiSparkles } from "react-icons/hi";
import { FiArrowLeft, FiArrowRight, FiFilter } from "react-icons/fi";

// Lazy load components
const ArticleCard = dynamic(() => import("@/components/cards").then(mod => mod.ArticleCard), {
    ssr: true,
});

const MagCategoriesSlider = dynamic(() => import("@/components/sliders").then(mod => mod.MagCategoriesSlider), {
    ssr: true,
});

const ArticlesSidebar = dynamic(() => import("@/components/articles/ArticlesSidebar"), {
    ssr: true,
});

export default function ArticlesListClient({ 
    initialArticles = [], 
    initialPagination = { page: 1, limit: 9, total: 0, totalPages: 1 },
    categories = [],
    featuredArticles = [],
    popularArticles = [],
    searchParams = {}
}) {
    const router = useRouter();
    const searchParamsHook = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams?.search || '');
    const [categoryFilter, setCategoryFilter] = useState(searchParams?.category || 'all');
    const [articles, setArticles] = useState(Array.isArray(initialArticles) ? initialArticles : []);
    const [pagination, setPagination] = useState({
        page: parseInt(initialPagination?.page) || 1,
        limit: parseInt(initialPagination?.limit) || 9,
        total: parseInt(initialPagination?.total) || 0,
        totalPages: parseInt(initialPagination?.totalPages) || 1,
        hasNext: initialPagination?.hasNext || false,
        hasPrev: initialPagination?.hasPrev || false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    // Update URL when filters change
    const updateURL = (newPage, newSearch, newCategory) => {
        const params = new URLSearchParams();
        if (newPage > 1) params.set('page', newPage.toString());
        if (newSearch && newSearch.trim() !== '') params.set('search', newSearch);
        if (newCategory && newCategory !== 'all') params.set('category', newCategory);
        
        const queryString = params.toString();
        const newURL = queryString ? `/mag?${queryString}` : '/mag';
        router.push(newURL, { scroll: false });
    };

    // Fetch articles when URL changes
    useEffect(() => {
        const fetchArticles = async () => {
            const page = parseInt(searchParamsHook?.get('page')) || 1;
            const search = searchParamsHook?.get('search') || '';
            const category = searchParamsHook?.get('category') || '';
            
            setIsLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    lang: "fa",
                    isPublished: "true",
                    page: page.toString(),
                    limit: "9",
                });
                
                if (search && search.trim() !== '') {
                    queryParams.append('search', search);
                }
                
                if (category && category !== 'all' && category.trim() !== '') {
                    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
                    if (objectIdPattern.test(category)) {
                        queryParams.append('category', category);
                    }
                }
                
                const response = await apiClient.get(`/articles?${queryParams.toString()}`);
                const articlesData = response.data || [];
                const paginationData = response.pagination || response.data?.pagination || { page: 1, limit: 9, total: 0, totalPages: 1 };
                
                setArticles(Array.isArray(articlesData) ? articlesData : []);
                setPagination({
                    page: parseInt(paginationData.page) || 1,
                    limit: parseInt(paginationData.limit) || 9,
                    total: parseInt(paginationData.total) || 0,
                    totalPages: parseInt(paginationData.totalPages) || 1,
                    hasNext: paginationData.hasNext || false,
                    hasPrev: paginationData.hasPrev || false
                });
                setSearchTerm(search);
                setCategoryFilter(category || 'all');
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, [searchParamsHook]);

    const handleSearch = (e) => {
        e.preventDefault();
        updateURL(1, searchTerm, categoryFilter);
    };

    const handleCategoryChange = (categoryId) => {
        setCategoryFilter(categoryId);
        updateURL(1, searchTerm, categoryId);
    };

    const handlePageChange = (newPage) => {
        updateURL(newPage, searchTerm, categoryFilter);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const displayArticles = Array.isArray(articles) ? articles.map(article => ({
        id: article._id,
        _id: article._id,
        title: article.title?.fa || article.title,
        description: article.excerpt?.fa || article.shortDescription?.fa || "",
        thumbnail: article.featuredImage || "/assets/images/post-thumb-1.webp",
        createdAt: article.publishedAt || article.createdAt,
        readTime: `${article.readTime || 5} دقیقه`,
        slug: article.slug?.fa || article.slug?.en || article.slug,
        views: article.views || 0,
        article
    })) : [];

    return (
        <main className="w-full min-h-screen">
            {/* Hero Section - Premium Design */}
            <section className="relative w-full py-3.5 md:py-7 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgb(20 184 166) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>
                
                <div className="relative w-full max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-10" data-aos="fade-up">
                        <h1 className="text-5xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                            هیکا <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">مگ</span>
                        </h1>
                    </div>
                    
                    {/* Enhanced Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="جستجو در مقالات... (مثلاً: سئو، طراحی وب، بازاریابی)"
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

            <div className="w-full py-8 md:py-10">
                {/* Categories Filter */}
                <div className="mb-10 md:mb-14" data-aos="fade-up">
                    <MagCategoriesSlider />
                </div>

                {/* Featured Articles Section - Premium Design */}
                {featuredArticles.length > 0 && (
                    <section className="mb-14 md:mb-20" data-aos="fade-up">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
                                    <HiOutlineFire className="text-2xl text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">مقالات ویژه</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">برترین مقالات انتخاب شده</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                            {featuredArticles.map((article, index) => {
                                const title = article.title?.fa || article.title;
                                const slug = article.slug?.fa || article.slug?.en || article.slug;
                                const image = article.featuredImage || "/assets/images/post-thumb-1.webp";
                                const excerpt = article.excerpt?.fa || article.shortDescription?.fa || "";
                                
                                return (
                                    <Link 
                                        href={`/mag/${slug}`} 
                                        key={article._id || index}
                                        className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100"
                                        data-aos="fade-up"
                                        data-aos-delay={index * 100}
                                    >
                                        <div className="relative h-56 overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                            <div className="absolute top-5 right-5">
                                                <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg">
                                                    <HiOutlineFire className="w-4 h-4" />
                                                    ویژه
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
                                                {title}
                                            </h3>
                                            <p className="text-sm text-slate-600 line-clamp-3 mb-5 leading-relaxed">
                                                {excerpt}
                                            </p>
                                            <div className="flex items-center gap-5 text-xs text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <BsClock className="w-4 h-4" />
                                                    <span>{article.readTime || 5} دقیقه</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BsEye className="w-4 h-4" />
                                                    <span>{article.views || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Main Content with Sidebar */}
                <div className="w-full grid grid-cols-12 gap-6 md:gap-8">
                    {/* Articles Grid */}
                    <div className="w-full grid col-span-12 md:col-span-9">
                        {/* Header with View Toggle */}
                        <section data-aos="fade-up">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                        {searchTerm ? (
                                            <>
                                                نتایج جستجو: <span className="text-teal-600 dark:text-teal-400">"{searchTerm}"</span>
                                            </>
                                        ) : (
                                            'همه مقالات'
                                        )}
                                    </h2>
                                    {pagination.total > 0 && (
                                        <p className="text-slate-500 dark:text-slate-400">
                                            {pagination.total.toLocaleString('fa-IR')} مقاله یافت شد
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-md border border-slate-200 dark:border-slate-700">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-all ${
                                            viewMode === 'grid' 
                                                ? 'bg-teal-600 text-white shadow-md' 
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        <BsGrid3X3 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg transition-all ${
                                            viewMode === 'list' 
                                                ? 'bg-teal-600 text-white shadow-md' 
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        <BsList className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {isLoading && displayArticles.length === 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 animate-pulse">
                                            <div className="w-full h-48 md:h-56 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700"></div>
                                            <div className="p-5 md:p-6 space-y-4">
                                                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
                                                <div className="space-y-2">
                                                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                                                </div>
                                                <div className="flex items-center gap-4 pt-2">
                                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : displayArticles.length === 0 ? (
                                <div className="w-full flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
                                    <div className="text-7xl mb-6">📚</div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">مقاله‌ای یافت نشد</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                                        {searchTerm ? 'لطفاً کلمات کلیدی دیگری را امتحان کنید' : 'هنوز مقاله‌ای منتشر نشده است'}
                                    </p>
                                    {searchTerm && (
                                        <Link
                                            href="/mag"
                                            className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                                        >
                                            مشاهده همه مقالات
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className={`w-full grid gap-6 md:gap-8 ${
                                        viewMode === 'grid' 
                                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr' 
                                            : 'grid-cols-1'
                                    }`}>
                                        {displayArticles.map((article, index) => (
                                            <div 
                                                key={article.id || index} 
                                                className="h-full flex shadow-lg hover:shadow-xl transition-all duration-500" 
                                                data-aos="fade-up" 
                                                data-aos-delay={index * 50}
                                            >
                                                <ArticleCard 
                                                    article={article} 
                                                    className="h-full w-full"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Enhanced Pagination */}
                                    {pagination && typeof pagination.totalPages === 'number' && pagination.totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-3 mt-14">
                                            <button
                                                onClick={() => handlePageChange(pagination.page - 1)}
                                                disabled={!pagination.hasPrev}
                                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-teal-500 dark:hover:border-teal-600 hover:text-teal-600 dark:hover:text-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-sm hover:shadow-md"
                                            >
                                                <FiArrowRight className="w-5 h-5" />
                                                <span>قبلی</span>
                                            </button>
                                            <div className="flex items-center gap-2">
                                                {(() => {
                                                    const totalPages = parseInt(pagination.totalPages) || 1;
                                                    const currentPage = parseInt(pagination.page) || 1;
                                                    const maxPages = Math.min(5, totalPages);
                                                    
                                                    return Array.from({ length: maxPages }, (_, i) => {
                                                        let pageNum;
                                                        if (totalPages <= 5) {
                                                            pageNum = i + 1;
                                                        } else if (currentPage <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (currentPage >= totalPages - 2) {
                                                            pageNum = totalPages - 4 + i;
                                                        } else {
                                                            pageNum = currentPage - 2 + i;
                                                        }
                                                        
                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => handlePageChange(pageNum)}
                                                                className={`px-5 py-3 rounded-xl font-bold transition-all ${
                                                                    pageNum === currentPage
                                                                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg scale-110'
                                                                        : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-teal-500 dark:hover:border-teal-600 hover:text-teal-600 dark:hover:text-teal-400 shadow-sm hover:shadow-md'
                                                                }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                            <button
                                                onClick={() => handlePageChange(pagination.page + 1)}
                                                disabled={!pagination.hasNext}
                                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-teal-500 dark:hover:border-teal-600 hover:text-teal-600 dark:hover:text-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-sm hover:shadow-md"
                                            >
                                                <span>بعدی</span>
                                                <FiArrowLeft className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="w-full col-span-12 md:col-span-3">
                        <div className="sticky top-24">
                            <ArticlesSidebar
                                popularArticles={popularArticles}
                                categories={categories}
                                showNewsletter={true}
                                showPopular={true}
                                showCategories={true}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
