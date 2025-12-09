"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
    HiCheck, 
    HiXMark, 
    HiArrowLeft,
    HiSparkles,
    HiCurrencyDollar,
    HiPhone
} from "react-icons/hi2";
import { PiSealCheckBold } from "react-icons/pi";

export default function PricingPageClient({ services = [] }) {
    const [selectedService, setSelectedService] = useState(null);
    const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"

    // Transform service data
    const transformedServices = useMemo(() => {
        return services.map(service => {
            const serviceName = typeof service.name === 'string' 
                ? service.name 
                : (service.name?.fa || service.name?.en || "");
            const serviceSlug = service.slug?.fa || service.slug?.en || service.slug || "";
            const serviceShortDesc = typeof service.shortDescription === 'string'
                ? service.shortDescription
                : (service.shortDescription?.fa || service.shortDescription?.en || "");
            const featuredImage = service.featuredImage || "/assets/giff/market-research.gif";

            const packages = (service.pricing?.packages || []).map(pkg => ({
                name: typeof pkg.name === 'string' 
                    ? pkg.name 
                    : (pkg.name?.fa || pkg.name?.en || ""),
                value: typeof pkg.value === 'string' 
                    ? pkg.value 
                    : (pkg.value?.fa || pkg.value?.en || String(pkg.value || "")),
                subTitle: typeof pkg.subTitle === 'string'
                    ? pkg.subTitle
                    : (pkg.subTitle?.fa || pkg.subTitle?.en || ""),
                features: (pkg.features || []).map(f => 
                    typeof f === 'string' ? f : (f?.fa || f?.en || String(f || ""))
                ),
                desc: typeof pkg.desc === 'string'
                    ? pkg.desc
                    : (pkg.desc?.fa || pkg.desc?.en || ""),
                actionBtnText: typeof pkg.actionBtnText === 'string'
                    ? pkg.actionBtnText
                    : (pkg.actionBtnText?.fa || pkg.actionBtnText?.en || "درخواست مشاوره"),
                duration: pkg.duration || "",
                isPopular: pkg.isPopular || false,
            }));

            return {
                id: service._id || service.id,
                name: serviceName,
                slug: serviceSlug,
                shortDescription: serviceShortDesc,
                featuredImage,
                packages,
                currency: service.pricing?.currency || "IRR",
            };
        });
    }, [services]);

    const displayedService = selectedService 
        ? transformedServices.find(s => s.id === selectedService)
        : transformedServices[0];

    // Get all unique features for displayed service packages
    const displayedServiceFeatures = useMemo(() => {
        if (!displayedService) return [];
        const featuresSet = new Set();
        displayedService.packages.forEach(pkg => {
            if (pkg.features && Array.isArray(pkg.features)) {
                pkg.features.forEach(feature => {
                    if (feature && typeof feature === 'string' && feature.trim()) {
                        featuresSet.add(feature);
                    }
                });
            }
        });
        return Array.from(featuresSet).sort();
    }, [displayedService]);

    if (services.length === 0) {
        return (
            <div className="text-center py-12 md:py-20" data-aos="fade-up">
                <div className="max-w-md mx-auto">
                    <HiCurrencyDollar className="w-24 h-24 mx-auto mb-6 text-slate-400" />
                    <h3 className="text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">
                        تعرفه‌ای موجود نیست
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                        در حال حاضر تعرفه‌ای برای نمایش وجود ندارد.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 md:space-y-12">
            {/* Service Selector */}
            {transformedServices.length > 1 && (
                <div className="w-full" data-aos="fade-up">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">
                        انتخاب خدمت
                    </h2>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {transformedServices.map(service => (
                            <button
                                key={service.id}
                                onClick={() => setSelectedService(service.id)}
                                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all ${
                                    (selectedService === service.id || (!selectedService && service.id === transformedServices[0].id))
                                        ? "bg-teal-600 text-white shadow-lg scale-105"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                            >
                                {service.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center justify-center gap-2" data-aos="fade-up">
                <button
                    onClick={() => setViewMode("cards")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        viewMode === "cards"
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                >
                    نمایش کارتی
                </button>
                <button
                    onClick={() => setViewMode("table")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        viewMode === "table"
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                >
                    نمایش جدولی
                </button>
            </div>

            {/* Service Info */}
            {displayedService && (
                <div className="w-full" data-aos="fade-up">
                    <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 rounded-2xl p-6 md:p-8 mb-6">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                            {displayedService.featuredImage && (
                                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-white dark:bg-slate-800 flex-shrink-0">
                                    <Image
                                        src={displayedService.featuredImage}
                                        alt={displayedService.name}
                                        fill
                                        sizes="96px"
                                        className="object-cover"
                                        unoptimized={displayedService.featuredImage.includes('.gif')}
                                    />
                                </div>
                            )}
                            <div className="flex-1 text-center md:text-right">
                                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                                    {displayedService.name}
                                </h3>
                                {displayedService.shortDescription && (
                                    <p className="text-slate-600 dark:text-slate-300">
                                        {displayedService.shortDescription}
                                    </p>
                                )}
                            </div>
                            <Link
                                href={`/service/${displayedService.slug}`}
                                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 text-white rounded-lg font-semibold transition-colors"
                            >
                                <span>مطالعه بیشتر</span>
                                <HiArrowLeft className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Pricing Cards View */}
                    {viewMode === "cards" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {displayedService.packages.map((pkg, index) => (
                                <div
                                    key={index}
                                    className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${
                                        pkg.isPopular
                                            ? "border-teal-500 dark:border-teal-600 scale-105 md:scale-110"
                                            : "border-slate-200 dark:border-slate-700"
                                    }`}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    {pkg.isPopular && (
                                        <div className="absolute top-0 right-0 bg-teal-600 text-white px-4 py-1 rounded-bl-lg text-xs font-bold">
                                            محبوب‌ترین
                                        </div>
                                    )}
                                    
                                    {/* Header */}
                                    <div className={`p-6 text-center border-b-2 ${
                                        pkg.isPopular
                                            ? "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900 dark:to-teal-950 border-teal-200 dark:border-teal-700"
                                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                                    }`}>
                                        <h4 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                                            {pkg.name}
                                        </h4>
                                        <div className="text-3xl md:text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                                            {pkg.value}
                                        </div>
                                        {pkg.subTitle && (
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {pkg.subTitle}
                                            </p>
                                        )}
                                        {pkg.duration && (
                                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                                مدت زمان: {pkg.duration}
                                            </p>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <div className="p-6">
                                        <ul className="space-y-3 mb-6">
                                            {pkg.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <PiSealCheckBold className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm md:text-base text-slate-600 dark:text-slate-300">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        {pkg.desc && (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                                {pkg.desc}
                                            </p>
                                        )}
                                    </div>

                                    {/* CTA */}
                                    <div className="p-6 pt-0">
                                        <a
                                            href={`/#counseling?service=${displayedService.slug}&package=${encodeURIComponent(pkg.name)}`}
                                            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                                                pkg.isPopular
                                                    ? "bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 text-white"
                                                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200"
                                            }`}
                                        >
                                            <HiPhone className="w-4 h-4" />
                                            <span>{pkg.actionBtnText}</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Comparison Table View */}
                    {viewMode === "table" && (
                        <div className="overflow-x-auto -mx-4 md:mx-0" data-aos="fade-up">
                            <div className="inline-block min-w-full align-middle px-4 md:px-0">
                                <table className="w-full border-collapse bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden text-xs md:text-base">
                                    <thead>
                                        <tr className="bg-teal-600 dark:bg-teal-700 text-white">
                                            <th className="text-right p-2 md:p-4 font-semibold text-xs md:text-base">ویژگی / پکیج</th>
                                            {displayedService.packages.map((pkg, idx) => (
                                                <th key={idx} className="text-center p-2 md:p-4 font-semibold border-r border-teal-500 dark:border-teal-600 last:border-r-0 text-xs md:text-base min-w-[120px] md:min-w-0">
                                                    <div className="space-y-1 md:space-y-2 flex justify-center items-center gap-x-1 flex-nowrap">
                                                        <div className="text-xs md:text-lg leading-tight text-nowrap">{pkg.name}</div>
                                                        <div className="text-sm md:text-xl font-bold">{pkg.value}</div>
                                                        {pkg.isPopular && (
                                                            <span className="inline-block px-1.5 md:px-2 py-0.5 md:py-1 bg-white/20 rounded text-[10px] md:text-xs">
                                                                محبوب‌ترین
                                                            </span>
                                                        )}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedServiceFeatures.map((feature, idx) => (
                                            <tr 
                                                key={idx} 
                                                className={`border-b border-slate-200 dark:border-slate-700 text-nowrap ${
                                                    idx % 2 === 0 
                                                        ? "bg-slate-50 dark:bg-slate-900/50" 
                                                        : "bg-white dark:bg-slate-800"
                                                }`}
                                            >
                                                <td className="p-2 md:p-4 font-medium text-slate-700 dark:text-slate-300 text-xs md:text-base leading-relaxed">
                                                    {feature}
                                                </td>
                                                {displayedService.packages.map((pkg, pkgIdx) => {
                                                    const hasFeature = pkg.features.includes(feature);
                                                    return (
                                                        <td key={pkgIdx} className="text-center p-2 md:p-4 border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                                                            {hasFeature ? (
                                                                <HiCheck className="w-4 h-4 md:w-6 md:h-6 text-teal-600 dark:text-teal-400 mx-auto" />
                                                            ) : (
                                                                <HiXMark className="w-4 h-4 md:w-6 md:h-6 text-slate-300 dark:text-slate-600 mx-auto" />
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-100 dark:bg-slate-900">
                                            <td className="p-2 md:p-4 font-semibold text-slate-800 dark:text-slate-200 text-xs md:text-base">
                                                اقدام
                                            </td>
                                            {displayedService.packages.map((pkg, idx) => (
                                                <td key={idx} className="p-2 md:p-4 text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                                                    <a
                                                        href={`/#counseling?service=${displayedService.slug}&package=${encodeURIComponent(pkg.name)}`}
                                                        className={`inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-semibold text-[10px] md:text-sm transition-colors whitespace-nowrap ${
                                                            pkg.isPopular
                                                                ? "bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 text-white"
                                                                : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200"
                                                        }`}
                                                    >
                                                        <HiPhone className="w-3 h-3 md:w-4 md:h-4" />
                                                        <span className="hidden sm:inline">{pkg.actionBtnText}</span>
                                                        <span className="sm:hidden">مشاوره</span>
                                                    </a>
                                                </td>
                                            ))}
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Info Note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 md:p-6" data-aos="fade-up">
                <div className="flex items-start gap-3">
                    <HiSparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            نکته مهم
                        </h4>
                        <p className="text-sm md:text-base text-blue-800 dark:text-blue-200 leading-relaxed">
                            قیمت‌های نمایش داده شده قیمت‌های پایه هستند. قیمت نهایی بر اساس نیازهای خاص پروژه شما محاسبه می‌شود. 
                            برای دریافت قیمت دقیق و مشاوره رایگان، با ما تماس بگیرید.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

