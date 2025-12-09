"use client";

import Link from "next/link";
import Image from "next/image";
import { HiArrowLeft, HiSparkles } from "react-icons/hi2";

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

export default function FeaturedServicesSection({ services = [] }) {
    // Get featured services (first 3 or services with isFeatured flag)
    const featuredServices = services
        .filter(service => service.isFeatured !== false)
        .slice(0, 3);

    if (featuredServices.length === 0) return null;

    return (
        <section className="w-full mb-12 md:mb-16" data-aos="fade-up">
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                    <HiSparkles className="w-6 h-6 md:w-8 md:h-8 text-teal-600 dark:text-teal-400" />
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                        خدمات ویژه
                    </h2>
                </div>
                <Link
                    href="/service"
                    className="text-sm md:text-base text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold flex items-center gap-2 transition-colors"
                >
                    مشاهده همه
                    <HiArrowLeft className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {featuredServices.map((service, index) => {
                    const serviceName = typeof service.name === 'string' 
                        ? service.name 
                        : (service.name?.fa || service.name?.en || "");
                    const serviceSlug = service.slug?.fa || service.slug?.en || service.slug || "";
                    const shortDescription = typeof service.shortDescription === 'string'
                        ? service.shortDescription
                        : (service.shortDescription?.fa || service.shortDescription?.en || "");
                    const featuredImage = service.featuredImage || SERVICE_GIF_MAP[serviceSlug] || "/assets/giff/market-research.gif";
                    const serviceUrl = `/service/${serviceSlug}`;

                    return (
                        <Link
                            key={service._id || service.id || index}
                            href={serviceUrl}
                            className="group relative bg-gradient-to-br from-teal-50 via-white to-teal-50 dark:from-teal-950 dark:via-slate-800 dark:to-teal-950 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-teal-500 dark:hover:border-teal-600"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            {/* Badge */}
                            <div className="absolute top-4 right-4 z-10">
                                <span className="px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-full shadow-lg">
                                    ویژه
                                </span>
                            </div>

                            {/* Image */}
                            <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800">
                                <Image
                                    src={featuredImage}
                                    alt={serviceName}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    unoptimized={featuredImage.includes('.gif')}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="p-5 md:p-6">
                                <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                    {serviceName}
                                </h3>
                                {shortDescription && (
                                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-4">
                                        {shortDescription}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-sm md:text-base">
                                    <span>مطالعه بیشتر</span>
                                    <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

