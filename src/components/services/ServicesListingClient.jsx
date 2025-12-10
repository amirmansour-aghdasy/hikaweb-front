"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import ServiceCard from "./ServiceCard";
import QuickViewModal from "./QuickViewModal";
import { 
    HiMagnifyingGlass, 
    HiXMark, 
    HiSquares2X2, 
    HiBars3,
    HiArrowsUpDown
} from "react-icons/hi2";
import toast from "react-hot-toast";

// Service slug to gif mapping (fallback)
const SERVICE_GIF_MAP = {
    "seo-and-optimization": "/assets/giff/market-research.gif",
    "hika-studio": "/assets/giff/green-screen.gif",
    "graphic-design": "/assets/giff/monitor.gif",
    "printing": "/assets/giff/printer.gif",
    "social-media-management": "/assets/giff/social-media.gif",
    "content-production-and-editing": "/assets/giff/trending.gif",
    "logo-design": "/assets/giff/vector.gif",
    "web-design": "/assets/giff/web-developer.gif",
};

const SORT_OPTIONS = [
    { value: "default", label: "پیش‌فرض" },
    { value: "name-asc", label: "نام (الف-ی)" },
    { value: "name-desc", label: "نام (ی-الف)" },
];

const ITEMS_PER_PAGE = 9;

export default function ServicesListingClient({ services = [] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
    const [currentPage, setCurrentPage] = useState(1);
    const [quickViewService, setQuickViewService] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const searchInputRef = useRef(null);
    const filtersRef = useRef(null);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setCurrentPage(1); // Reset to first page on search
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Search suggestions
    const searchSuggestions = useMemo(() => {
        if (!debouncedSearchQuery || debouncedSearchQuery.length < 2) return [];
        const query = debouncedSearchQuery.toLowerCase();
        return services
            .filter(service => {
                const serviceName = typeof service.name === 'string' 
                    ? service.name 
                    : (service.name?.fa || service.name?.en || "");
                return serviceName.toLowerCase().includes(query);
            })
            .slice(0, 5)
            .map(service => ({
                name: typeof service.name === 'string' 
                    ? service.name 
                    : (service.name?.fa || service.name?.en || ""),
                slug: service.slug?.fa || service.slug?.en || service.slug || "",
            }));
    }, [services, debouncedSearchQuery]);

    // Filter and sort services
    const filteredAndSortedServices = useMemo(() => {
        let filtered = services.filter(service => {
            // Search filter
            const serviceName = typeof service.name === 'string' 
                ? service.name 
                : (service.name?.fa || service.name?.en || "");
            const serviceDesc = typeof service.shortDescription === 'string'
                ? service.shortDescription
                : (service.shortDescription?.fa || service.shortDescription?.en || "");
            const searchLower = debouncedSearchQuery.toLowerCase();
            
            const matchesSearch = !debouncedSearchQuery || 
                serviceName.toLowerCase().includes(searchLower) ||
                serviceDesc.toLowerCase().includes(searchLower);

            return matchesSearch;
        });

        // Sort
        filtered = [...filtered].sort((a, b) => {
            const nameA = typeof a.name === 'string' 
                ? a.name 
                : (a.name?.fa || a.name?.en || "");
            const nameB = typeof b.name === 'string' 
                ? b.name 
                : (b.name?.fa || b.name?.en || "");

            switch (sortBy) {
                case "name-asc":
                    return nameA.localeCompare(nameB, 'fa');
                case "name-desc":
                    return nameB.localeCompare(nameA, 'fa');
                default:
                    return 0;
            }
        });

        return filtered;
    }, [services, debouncedSearchQuery, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedServices.length / ITEMS_PER_PAGE);
    const paginatedServices = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedServices.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredAndSortedServices, currentPage]);

    // Active filters count
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (debouncedSearchQuery) count++;
        if (sortBy !== "default") count++;
        return count;
    }, [debouncedSearchQuery, sortBy]);

    // Handlers
    const handleQuickView = useCallback((service) => {
        setQuickViewService(service);
    }, []);

    const handleShare = useCallback(async (service) => {
        const serviceName = typeof service.name === 'string' 
            ? service.name 
            : (service.name?.fa || service.name?.en || "");
        const serviceSlug = service.slug?.fa || service.slug?.en || service.slug || "";
        const url = `${window.location.origin}/service/${serviceSlug}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: serviceName,
                    text: serviceName,
                    url: url,
                });
                toast.success("خدمت به اشتراک گذاشته شد");
            } catch (error) {
                if (error.name !== 'AbortError') {
                    navigator.clipboard.writeText(url);
                    toast.success("لینک خدمت کپی شد");
                }
            }
        } else {
            navigator.clipboard.writeText(url);
            toast.success("لینک خدمت کپی شد");
        }
    }, []);

    const clearAllFilters = useCallback(() => {
        setSearchQuery("");
        setSortBy("default");
        setCurrentPage(1);
        toast.success("همه فیلترها پاک شد");
    }, []);

    // Sticky filters
    useEffect(() => {
        const handleScroll = () => {
            if (filtersRef.current) {
                const rect = filtersRef.current.getBoundingClientRect();
                if (rect.top <= 0) {
                    setShowFilters(true);
                } else {
                    setShowFilters(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setQuickViewService(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="w-full">
            {/* Sticky Filters Bar */}
            {showFilters && (
                <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-lg py-3 px-4">
                    <div className="container mx-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                            <HiMagnifyingGlass className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="جستجوی خدمات..."
                                className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    aria-label="پاک کردن جستجو"
                                >
                                    <HiXMark className="w-4 h-4 text-slate-400" />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                >
                                    پاک کردن ({activeFiltersCount})
                                </button>
                            )}
                            <button
                                onClick={() => setViewMode(prev => prev === "grid" ? "list" : "grid")}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                aria-label={viewMode === "grid" ? "نمایش لیستی" : "نمایش شبکه‌ای"}
                            >
                                {viewMode === "grid" ? (
                                    <HiBars3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                ) : (
                                    <HiSquares2X2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filter Section */}
            <div ref={filtersRef} className="mb-8 md:mb-12 space-y-4" data-aos="fade-up">
                {/* Search Bar with Suggestions */}
                <div className="relative max-w-2xl mx-auto">
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <HiMagnifyingGlass className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="جستجوی خدمات..."
                            className="w-full pr-12 pl-4 py-3 md:py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-teal-400/20 transition-all"
                            aria-label="جستجوی خدمات"
                            aria-describedby="search-suggestions"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                aria-label="پاک کردن جستجو"
                            >
                                <HiXMark className="h-4 w-4 text-slate-400" />
                            </button>
                        )}
                    </div>

                    {/* Search Suggestions */}
                    {searchSuggestions.length > 0 && debouncedSearchQuery && (
                        <div 
                            id="search-suggestions"
                            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-10"
                            role="listbox"
                        >
                            {searchSuggestions.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setSearchQuery(suggestion.name);
                                        setDebouncedSearchQuery(suggestion.name);
                                    }}
                                    className="w-full text-right px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                                    role="option"
                                >
                                    <HiMagnifyingGlass className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <span className="text-slate-700 dark:text-slate-300">{suggestion.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sort and View Controls */}
                <div className="flex items-center justify-between gap-3">
                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none px-4 py-2.5 pl-10 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
                            aria-label="مرتب‌سازی"
                        >
                            {SORT_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <HiArrowsUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded transition-colors ${
                                viewMode === "grid"
                                    ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            }`}
                            aria-label="نمایش شبکه‌ای"
                            aria-pressed={viewMode === "grid"}
                        >
                            <HiSquares2X2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded transition-colors ${
                                viewMode === "list"
                                    ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            }`}
                            aria-label="نمایش لیستی"
                            aria-pressed={viewMode === "list"}
                        >
                            <HiBars3 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Active Filter Chips */}
                {activeFiltersCount > 0 && (
                    <div className="flex flex-wrap items-center gap-2 justify-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">فیلترهای فعال:</span>
                        {debouncedSearchQuery && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm">
                                جستجو: {debouncedSearchQuery}
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="hover:text-teal-900 dark:hover:text-teal-200"
                                    aria-label="حذف فیلتر جستجو"
                                >
                                    <HiXMark className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {sortBy !== "default" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm">
                                مرتب‌سازی: {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                                <button
                                    onClick={() => setSortBy("default")}
                                    className="hover:text-teal-900 dark:hover:text-teal-200"
                                    aria-label="حذف فیلتر مرتب‌سازی"
                                >
                                    <HiXMark className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold"
                        >
                            پاک کردن همه
                        </button>
                    </div>
                )}
            </div>

            {/* Services Grid/List */}
            {isLoading ? (
                <div className="w-full flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                </div>
            ) : paginatedServices.length > 0 ? (
                <>
                    <div className={viewMode === "grid" 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                        : "space-y-4"
                    }>
                        {paginatedServices.map((service, index) => {
                            const serviceSlug = service.slug?.fa || service.slug?.en || service.slug || "";
                            const serviceName = typeof service.name === 'string' 
                                ? service.name 
                                : (service.name?.fa || service.name?.en || "");
                            const gifSrc = SERVICE_GIF_MAP[serviceSlug] || "/assets/giff/market-research.gif";
                            const serviceId = service._id || service.id;
                            
                            return (
                                <ServiceCard
                                    key={serviceId || index}
                                    service={service}
                                    serviceSlug={serviceSlug}
                                    serviceName={serviceName}
                                    gifSrc={gifSrc}
                                    index={index}
                                    viewMode={viewMode}
                                    onQuickView={handleQuickView}
                                    onShare={handleShare}
                                />
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2" data-aos="fade-up">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
                                aria-label="صفحه قبلی"
                            >
                                قبلی
                            </button>
                            
                            {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                                currentPage === page
                                                    ? "bg-teal-600 text-white"
                                                    : "border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-500 dark:hover:border-teal-400"
                                            }`}
                                            aria-label={`صفحه ${page}`}
                                            aria-current={currentPage === page ? "page" : undefined}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (page === currentPage - 2 || page === currentPage + 2) {
                                    return <span key={page} className="px-2 text-slate-400">...</span>;
                                }
                                return null;
                            })}
                            
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
                                aria-label="صفحه بعدی"
                            >
                                بعدی
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12 md:py-20" data-aos="fade-up">
                    <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <HiMagnifyingGlass className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">
                            خدمتی یافت نشد
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            {debouncedSearchQuery
                                ? "لطفاً فیلترهای جستجو را تغییر دهید"
                                : "در حال حاضر خدمتی موجود نیست"}
                        </p>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearAllFilters}
                                className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                            >
                                پاک کردن فیلترها
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Quick View Modal */}
            {quickViewService && (
                <QuickViewModal
                    service={quickViewService}
                    isOpen={!!quickViewService}
                    onClose={() => setQuickViewService(null)}
                />
            )}
        </div>
    );
}
