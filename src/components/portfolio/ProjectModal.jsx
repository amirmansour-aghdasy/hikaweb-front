"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HiXMark, HiArrowTopRightOnSquare, HiSparkles, HiCheck, HiCalendar, HiGlobeAlt } from "react-icons/hi2";
import { BsEye } from "react-icons/bs";
import { sanitizeHTML } from "@/lib/utils/sanitize";

export default function ProjectModal({ project, isOpen, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            // Allow body scroll when modal is closed
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !project) {
        return null;
    }

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300); // Wait for animation to complete
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const title = typeof project.title === 'string' 
        ? project.title 
        : (project.title?.fa || project.title?.en || "بدون عنوان");
    
    const description = typeof project.description === 'string'
        ? project.description
        : (project.description?.fa || project.description?.en || "");
    
    const shortDescription = typeof project.shortDescription === 'string'
        ? project.shortDescription
        : (project.shortDescription?.fa || project.shortDescription?.en || "");
    
    const featuredImage = project.featuredImage || "/assets/images/portfolio-placeholder.jpg";
    const gallery = project.gallery || [];
    const services = project.services || [];
    const brand = project.brand || {};
    const slug = project.slug?.fa || project.slug?.en || project.slug || "";
    const website = project.website || brand.website || "";
    const completedAt = project.completedAt || project.createdAt;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
                    isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-lg hover:scale-110"
                    aria-label="بستن"
                >
                    <HiXMark className="w-5 h-5" />
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[90vh]">
                    {/* Featured Image */}
                    <div className="relative w-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center py-8 px-4 min-h-[300px]">
                        <div className="relative w-full flex items-center justify-center">
                            <Image
                                src={featuredImage}
                                alt={title}
                                width={1200}
                                height={800}
                                className="w-full h-auto max-w-full max-h-[500px] object-contain"
                                sizes="(max-width: 768px) 100vw, 1200px"
                                priority
                                quality={90}
                            />
                        </div>
                        {project.isFeatured && (
                            <div className="absolute top-4 right-4 z-10">
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-semibold shadow-lg">
                                    <HiSparkles className="w-4 h-4" />
                                    پروژه ویژه
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                                {title}
                            </h2>
                            
                            {shortDescription && (
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                                    {shortDescription}
                                </p>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                {project.views > 0 && (
                                    <div className="flex items-center gap-1.5">
                                        <BsEye className="w-4 h-4" />
                                        <span>{project.views.toLocaleString('fa-IR')} بازدید</span>
                                    </div>
                                )}
                                {completedAt && (
                                    <div className="flex items-center gap-1.5">
                                        <HiCalendar className="w-4 h-4" />
                                        <span>{new Date(completedAt).toLocaleDateString('fa-IR')}</span>
                                    </div>
                                )}
                                {brand.name && (
                                    <div className="flex items-center gap-1.5">
                                        <HiGlobeAlt className="w-4 h-4" />
                                        <span>{brand.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Services */}
                        {services.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                    خدمات ارائه شده
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {services.map((service, idx) => {
                                        const serviceName = typeof service === 'object' && service.name
                                            ? (typeof service.name === 'string' ? service.name : (service.name.fa || service.name.en))
                                            : service;
                                        return (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-sm font-medium"
                                            >
                                                <HiCheck className="w-4 h-4" />
                                                {serviceName}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {description && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                    درباره پروژه
                                </h3>
                                <div
                                    className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }}
                                />
                            </div>
                        )}

                        {/* Gallery */}
                        {gallery.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                    گالری تصاویر
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {gallery.map((item, idx) => {
                                        const imageUrl = typeof item === 'string' ? item : item.url;
                                        const imageAlt = typeof item === 'object' ? (item.alt?.fa || item.alt?.en || title) : title;
                                        return (
                                            <div
                                                key={idx}
                                                className="relative rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 group cursor-pointer flex items-center justify-center min-h-[150px]"
                                            >
                                                <Image
                                                    src={imageUrl}
                                                    alt={imageAlt}
                                                    width={400}
                                                    height={400}
                                                    className="w-full h-auto max-h-[300px] object-contain transition-transform duration-300 group-hover:scale-105"
                                                    sizes="(max-width: 768px) 50vw, 33vw"
                                                    loading="lazy"
                                                    quality={85}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        {website && (
                            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <a
                                    href={website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors duration-200"
                                >
                                    <span>مشاهده وب‌سایت</span>
                                    <HiArrowTopRightOnSquare className="w-5 h-5" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

