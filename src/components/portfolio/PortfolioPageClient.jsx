"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiSparkles, HiArrowLeft, HiArrowTopRightOnSquare, HiCheck } from "react-icons/hi2";
import BrandCard from "./BrandCard";

const ITEMS_PER_PAGE = 6;

export default function PortfolioPageClient({ brands = [], services = [] }) {
    const [sortBy, setSortBy] = useState("all"); // "all", "featured", "popular"
    const [selectedService, setSelectedService] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    // Extract unique services from all projects for filtering
    const allServicesInProjects = useMemo(() => {
        const serviceSet = new Set();
        brands.forEach(brand => {
            brand.projects?.forEach(project => {
                if (project.services && Array.isArray(project.services)) {
                    project.services.forEach(service => {
                        if (typeof service === 'object' && service._id) {
                            serviceSet.add(service._id.toString());
                        } else if (typeof service === 'string') {
                            serviceSet.add(service);
                        }
                    });
                }
            });
        });
        return Array.from(serviceSet);
    }, [brands]);

    // Filter brands based on service
    const filteredBrands = useMemo(() => {
        if (selectedService === "all") {
            return brands;
        }

        return brands
            .map(brand => {
                const filteredProjects = brand.projects?.filter(project => {
                    if (!project.services || !Array.isArray(project.services)) return false;
                    return project.services.some(service => {
                        const serviceId = typeof service === 'object' && service._id 
                            ? service._id.toString() 
                            : service?.toString();
                        return serviceId === selectedService;
                    });
                }) || [];

                if (filteredProjects.length === 0) return null;

                return {
                    ...brand,
                    projects: filteredProjects,
                };
            })
            .filter(brand => brand !== null);
    }, [brands, selectedService]);

    // Sort brands based on sortBy
    const sortedBrands = useMemo(() => {
        const sorted = [...filteredBrands];

        switch (sortBy) {
            case "featured":
                return sorted.sort((a, b) => {
                    const aFeatured = a.projects?.filter(p => p.isFeatured).length || 0;
                    const bFeatured = b.projects?.filter(p => p.isFeatured).length || 0;
                    return bFeatured - aFeatured;
                });
            case "popular":
                return sorted.sort((a, b) => {
                    const aViews = a.projects?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
                    const bViews = b.projects?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
                    return bViews - aViews;
                });
            default:
                return sorted;
        }
    }, [filteredBrands, sortBy]);

    // Pagination
    const totalPages = Math.ceil(sortedBrands.length / ITEMS_PER_PAGE);
    const paginatedBrands = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedBrands.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedBrands, currentPage]);

    const totalProjects = useMemo(() => {
        return filteredBrands.reduce((sum, brand) => sum + (brand.projects?.length || 0), 0);
    }, [filteredBrands]);

    // Reset to page 1 when filters change
    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleServiceChange = (value) => {
        setSelectedService(value);
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="w-full py-5 md:py-14 flex flex-col gap-10 md:gap-14">
            {/* Hero Section - Compact */}
            <section className="relative w-full py-8 md:py-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 dark:from-teal-900/20 dark:via-blue-900/20 dark:to-purple-900/20"></div>
                
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
                            نمونه کارهای ما
                        </h1>
                        
                        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                            پروژه‌های انجام شده برای برندهای معتبر
                        </p>

                        {/* Compact Stats */}
                        <div className="flex items-center justify-center gap-4 md:gap-6 mt-4">
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400">
                                    {brands.length}
                                </div>
                                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                    برند
                                </div>
                            </div>
                            <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400">
                                    {brands.reduce((sum, brand) => sum + (brand.projects?.length || 0), 0)}
                                </div>
                                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                    پروژه
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="container mx-auto px-4 md:px-6 py-3">
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                        {/* Sort Filter */}
                        <div className="w-full md:w-auto">
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="w-full md:w-auto px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 text-slate-900 dark:text-white transition-all text-sm"
                            >
                                <option value="all">همه</option>
                                <option value="featured">محبوب‌ترین</option>
                                <option value="popular">پر بازدیدترین</option>
                            </select>
                        </div>

                        {/* Service Filter */}
                        <div className="w-full md:w-auto ml-auto">
                            <select
                                value={selectedService}
                                onChange={(e) => handleServiceChange(e.target.value)}
                                className="w-full md:w-auto px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 text-slate-900 dark:text-white transition-all text-sm"
                            >
                                <option value="all">همه خدمات</option>
                                {services.map((service) => {
                                    const serviceName = typeof service.name === 'string' 
                                        ? service.name 
                                        : (service.name?.fa || service.name?.en || "");
                                    const serviceId = service._id?.toString() || service.id?.toString();
                                    
                                    // Only show services that are actually used in projects
                                    if (!allServicesInProjects.includes(serviceId)) return null;
                                    
                                    return (
                                        <option key={serviceId} value={serviceId}>
                                            {serviceName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Results Count */}
                        <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            {filteredBrands.length} برند • {totalProjects} پروژه
                        </div>
                    </div>
                </div>
            </section>

            {/* Brands Grid */}
            <section className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                {paginatedBrands.length === 0 ? (
                    <div className="text-center py-16" data-aos="fade-up">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            نتیجه‌ای یافت نشد
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            لطفاً فیلترهای دیگری را امتحان کنید.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                            {paginatedBrands.map((brand, index) => {
                                if (!brand || !brand.name) return null;
                                return <BrandCard key={brand.name} brand={brand} index={index} />;
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8" data-aos="fade-up">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    قبلی
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                        // Show first page, last page, current page, and pages around current
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                        currentPage === page
                                                            ? "bg-teal-600 text-white dark:bg-teal-700"
                                                            : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return (
                                                <span key={page} className="px-2 text-slate-400">
                                                    ...
                                                </span>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    بعدی
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* CTA Section */}
            <section className="w-full container mx-auto px-4 md:px-6">
                <div className="bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-700 dark:to-blue-700 rounded-2xl p-6 md:p-10 text-center relative overflow-hidden" data-aos="fade-up">
                    <div className="relative z-10">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3">
                            آماده شروع پروژه خود هستید؟
                        </h2>
                        <p className="text-base md:text-lg text-teal-50 mb-6 max-w-2xl mx-auto">
                            با تیم حرفه‌ای هیکاوب همکاری کنید و پروژه‌های موفق خود را به این مجموعه اضافه کنید.
                        </p>
                        <Link
                            href="/#counseling"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors shadow-lg text-sm md:text-base"
                        >
                            <span>دریافت مشاوره رایگان</span>
                            <HiArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
