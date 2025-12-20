"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiSparkles, HiArrowLeft, HiCheck } from "react-icons/hi2";
import { BsEye } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ProjectModal from "@/components/portfolio/ProjectModal";

export default function PortfolioSection({ projects = [] }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!projects || projects.length === 0) {
        return null;
    }

    // Show only featured projects (max 8)
    const featuredProjects = projects
        .filter(p => p.isFeatured)
        .slice(0, 8);

    if (featuredProjects.length === 0) {
        return null;
    }

    return (
        <section id="portfolio-section" className="w-full section-spacing">
            <div className="w-full section-heading">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-10 bg-gradient-to-b from-teal-600 to-cyan-500 rounded-full"></div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                        آخرین پروژه های هیکاوب
                    </h2>
                </div>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 pr-4">
                    پروژه‌های موفق و نمونه کارهای انجام شده توسط تیم هیکاوب
                </p>
            </div>

            <div className="relative overflow-hidden max-w-7xl mx-auto">
                {/* Fade overlay on the right (start) - smaller on mobile */}
                <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 lg:w-32 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 z-10 pointer-events-none"></div>
                {/* Fade overlay on the left (end) - smaller on mobile */}
                <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 lg:w-32 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 z-10 pointer-events-none"></div>
                
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1.4}
                    centeredSlides={true}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        el: '.portfolio-swiper-pagination',
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                            centeredSlides: false,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 24,
                            centeredSlides: false,
                        },
                        1280: {
                            slidesPerView: 4,
                            spaceBetween: 24,
                            centeredSlides: false,
                        },
                    }}
                    className="portfolio-swiper"
                >
                    {featuredProjects.map((project) => {
                        const title = typeof project.title === 'string' 
                            ? project.title 
                            : (project.title?.fa || project.title?.en || "بدون عنوان");
                        
                        const slug = project.slug?.fa || project.slug?.en || project.slug || "";
                        const image = project.featuredImage || "/assets/images/portfolio-placeholder.jpg";
                        const description = typeof project.shortDescription === 'string'
                            ? project.shortDescription
                            : (project.shortDescription?.fa || project.shortDescription?.en || "");
                        
                        const services = project.services || [];
                        const brand = project.brand || project.client || {};

                        return (
                            <SwiperSlide key={project._id}>
                                <div
                                    className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer h-full flex flex-col"
                                    onClick={() => {
                                        setSelectedProject(project);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-700">
                                        <Image
                                            src={image}
                                            alt={title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            loading="lazy"
                                            quality={85}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        {/* Featured Badge */}
                                        {project.isFeatured && (
                                            <div className="absolute top-3 right-3">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-600 text-white rounded-lg text-xs font-semibold shadow-lg">
                                                    <HiSparkles className="w-3 h-3" />
                                                    ویژه
                                                </span>
                                            </div>
                                        )}

                                        {/* Views Badge */}
                                        {project.views > 0 && (
                                            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                <BsEye className="w-3 h-3" />
                                                <span>{project.views.toLocaleString('fa-IR')}</span>
                                            </div>
                                        )}

                                        {/* Brand Logo (if available) */}
                                        {brand.logo && (
                                            <div className="absolute bottom-3 right-3 w-10 h-10 bg-white dark:bg-slate-800 rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Image
                                                    src={brand.logo}
                                                    alt={brand.name || ""}
                                                    width={40}
                                                    height={40}
                                                    className="w-full h-full object-contain"
                                                    unoptimized
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                            {title}
                                        </h3>
                                        
                                        {description && (
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 flex-1">
                                                {description}
                                            </p>
                                        )}

                                        {/* Services */}
                                        {services.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {services.slice(0, 2).map((service, idx) => {
                                                    const serviceName = typeof service === 'object' && service.name
                                                        ? (typeof service.name === 'string' ? service.name : (service.name.fa || service.name.en))
                                                        : service;
                                                    return (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded text-xs font-medium"
                                                        >
                                                            <HiCheck className="w-3 h-3" />
                                                            {serviceName}
                                                        </span>
                                                    );
                                                })}
                                                {services.length > 2 && (
                                                    <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs">
                                                        +{services.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* CTA */}
                                        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-sm font-semibold mt-auto pt-3 border-t border-slate-200 dark:border-slate-700">
                                            <span>مشاهده جزئیات</span>
                                            <HiArrowLeft className="w-4 h-4 group-hover:translate-x-[-3px] transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                {/* Pagination */}
                <div className="flex items-center justify-center mt-6">
                    <div className="portfolio-swiper-pagination flex items-center justify-center gap-2"></div>
                </div>
            </div>

            {/* CTA Button */}
            <div className="w-full flex justify-center mt-8 md:mt-12">
                <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    data-aos="fade-up"
                >
                    <span>مشاهده همه نمونه کارها</span>
                    <HiArrowLeft className="w-5 h-5" />
                </Link>
            </div>

            {/* Project Modal */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setTimeout(() => setSelectedProject(null), 300);
                    }}
                />
            )}
        </section>
    );
}

