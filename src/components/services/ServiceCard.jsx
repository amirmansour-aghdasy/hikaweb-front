"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { 
    HiArrowLeft, 
    HiPhone, 
    HiShare, 
    HiEye,
    HiSparkles
} from "react-icons/hi2";

export default function ServiceCard({ 
    service, 
    serviceSlug, 
    serviceName, 
    gifSrc, 
    index,
    onQuickView,
    onShare,
    viewMode = "grid" // "grid" or "list"
}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const shortDescription = typeof service.shortDescription === 'string'
        ? service.shortDescription
        : (service.shortDescription?.fa || service.shortDescription?.en || "");
    
    const description = typeof service.description === 'string'
        ? service.description
        : (service.description?.fa || service.description?.en || "");
    
    // Use shortDescription if available, otherwise truncate description
    const displayDescription = shortDescription || 
        (description ? description.substring(0, 150) + (description.length > 150 ? "..." : "") : "");
    
    const featuredImage = service.featuredImage || gifSrc;
    const serviceUrl = `/service/${serviceSlug}`;

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onShare) {
            onShare(service);
        }
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onQuickView) {
            onQuickView(service);
        }
    };

    // Icon mapping for services
    const getServiceIcon = () => {
        const iconMap = {
            "seo-and-optimization": "🔍",
            "hika-studio": "🎬",
            "graphic-design": "🎨",
            "printing": "🖨️",
            "social-media-management": "📱",
            "content-production-and-editing": "✍️",
            "logo-design": "✨",
            "web-design": "💻",
        };
        return iconMap[serviceSlug] || "⭐";
    };

    if (viewMode === "list") {
        return (
            <article
                className="group bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-600"
                data-aos="fade-up"
                data-aos-delay={index * 50}
            >
                <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 flex-shrink-0">
                        <Link href={serviceUrl} className="block w-full h-full">
                            <Image
                                src={featuredImage}
                                alt={serviceName}
                                title={serviceName}
                                width={400}
                                height={300}
                                sizes="(max-width: 768px) 100vw, 256px"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                unoptimized={gifSrc.includes('.gif')}
                                onLoad={() => setImageLoaded(true)}
                            />
                            {!imageLoaded && (
                                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                            )}
                        </Link>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col p-5 md:p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">{getServiceIcon()}</span>
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                        <Link href={serviceUrl} className="hover:underline">
                                            {serviceName}
                                        </Link>
                                    </h2>
                                </div>
                                {displayDescription && (
                                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                                        {displayDescription}
                                    </p>
                                )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={handleQuickView}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    aria-label="پیش‌نمایش سریع"
                                    title="پیش‌نمایش سریع"
                                >
                                    <HiEye className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    aria-label="اشتراک‌گذاری"
                                    title="اشتراک‌گذاری"
                                >
                                    <HiShare className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Features Preview */}
                        {service.subServices && service.subServices.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                {service.subServices.slice(0, 3).map((subService, idx) => {
                                    const subTitle = typeof subService.title === 'string'
                                        ? subService.title
                                        : (subService.title?.fa || subService.title?.en || "");
                                    
                                    return subTitle ? (
                                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-md text-xs">
                                            <HiSparkles className="w-3 h-3" />
                                            {subTitle}
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                            <Link
                                href={serviceUrl}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 text-white rounded-lg font-semibold text-sm md:text-base transition-colors group/btn"
                            >
                                <span>مطالعه بیشتر</span>
                                <HiArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href={`/#counseling?service=${serviceSlug}`}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 border-2 border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-lg font-semibold text-sm md:text-base hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                            >
                                <HiPhone className="w-4 h-4" />
                                <span>مشاوره</span>
                            </a>
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    // Grid View (default)
    return (
        <article
            className="group bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-600 flex flex-col relative"
            data-aos="fade-up"
            data-aos-delay={index * 100}
        >
            {/* Action Buttons Overlay */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleQuickView}
                    className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-md"
                    aria-label="پیش‌نمایش سریع"
                    title="پیش‌نمایش سریع"
                >
                    <HiEye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
                <button
                    onClick={handleShare}
                    className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-md"
                    aria-label="اشتراک‌گذاری"
                    title="اشتراک‌گذاری"
                >
                    <HiShare className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
            </div>

            {/* Image Section */}
            <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gradient-to-br from-teal-50 via-teal-100 to-teal-50 dark:from-teal-950 dark:via-teal-900 dark:to-teal-950">
                <Link href={serviceUrl} className="block w-full h-full">
                    <Image
                        src={featuredImage}
                        alt={serviceName}
                        title={serviceName}
                        width={400}
                        height={300}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized={gifSrc.includes('.gif')}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                
                {/* Icon Badge */}
                <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-2xl">
                    {getServiceIcon()}
                </div>
                
                {/* Category Badge */}
                {service.categories && service.categories.length > 0 && (
                    <div className="absolute bottom-3 right-3">
                        <span className="px-3 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-xs font-semibold text-teal-600 dark:text-teal-400 shadow-md">
                            {typeof service.categories[0] === 'object' && service.categories[0].name
                                ? (typeof service.categories[0].name === 'string' 
                                    ? service.categories[0].name 
                                    : (service.categories[0].name?.fa || service.categories[0].name?.en || ""))
                                : ""}
                        </span>
                    </div>
                )}

                {/* Pricing Badge */}
                {service.pricing && service.pricing.packages && service.pricing.packages.length > 0 && (
                    <div className="absolute top-3 left-3">
                        <div className="px-3 py-1 bg-teal-600/90 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg">
                            {(() => {
                                const prices = service.pricing.packages
                                    .map(pkg => {
                                        const value = typeof pkg.value === 'string' 
                                            ? pkg.value 
                                            : (pkg.value?.fa || pkg.value?.en || String(pkg.value || "0"));
                                        return parseInt(value.replace(/[^0-9]/g, '')) || 0;
                                    })
                                    .filter(p => p > 0);
                                return prices.length > 0 
                                    ? `از ${Math.min(...prices).toLocaleString('fa-IR')} تومان`
                                    : "تماس بگیرید";
                            })()}
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col p-5 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    <Link href={serviceUrl} className="hover:underline">
                        {serviceName}
                    </Link>
                </h2>

                {displayDescription && (
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4 flex-1 line-clamp-3">
                        {displayDescription}
                    </p>
                )}

                {/* Features Preview */}
                {service.subServices && service.subServices.length > 0 && (
                    <div className="mb-4">
                        <ul className="space-y-1">
                            {service.subServices.slice(0, 3).map((subService, idx) => {
                                const subTitle = typeof subService.title === 'string'
                                    ? subService.title
                                    : (subService.title?.fa || subService.title?.en || "");
                                
                                return subTitle ? (
                                    <li key={idx} className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                        {subTitle}
                                    </li>
                                ) : null;
                            })}
                        </ul>
                    </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Link
                        href={serviceUrl}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 text-white rounded-lg font-semibold text-sm md:text-base transition-colors group/btn"
                    >
                        <span>مطالعه بیشتر</span>
                        <HiArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Link>
                    <a
                        href={`/#counseling?service=${serviceSlug}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 border-2 border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-lg font-semibold text-sm md:text-base hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                    >
                        <HiPhone className="w-4 h-4" />
                        <span>مشاوره</span>
                    </a>
                </div>
            </div>
        </article>
    );
}
