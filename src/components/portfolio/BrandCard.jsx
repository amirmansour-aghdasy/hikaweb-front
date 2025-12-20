"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowTopRightOnSquare, HiCheck, HiArrowLeft, HiSparkles } from "react-icons/hi2";
import ProjectModal from "./ProjectModal";

export default function BrandCard({ brand, index }) {
    const [expanded, setExpanded] = useState(false);
    const [hoveredProject, setHoveredProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Safety checks
    if (!brand || !brand.name) {
        return null;
    }

    const projectCount = brand.projects?.length || 0;
    const projects = brand.projects || [];
    const featuredProjects = projects.filter(p => p?.isFeatured);
    const displayProjects = expanded ? projects : (featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 2));

    // Get unique services across all projects
    const allServices = new Set();
    projects.forEach(project => {
        if (project?.services && Array.isArray(project.services)) {
            project.services.forEach(service => {
                const serviceName = typeof service === 'object' && service?.name
                    ? (typeof service.name === 'string' ? service.name : (service.name?.fa || service.name?.en))
                    : service;
                if (serviceName) {
                    allServices.add(serviceName);
                }
            });
        }
    });
    const uniqueServices = Array.from(allServices);

    return (
        <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700"
            data-aos="fade-up"
            data-aos-delay={index * 100}
        >
            {/* Brand Header - Compact */}
            <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                <div className="flex items-start gap-3 md:gap-4">
                    {/* Brand Logo - Smaller */}
                    {brand.logo ? (
                        <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-slate-700 rounded-lg p-2 shadow-sm border border-slate-200 dark:border-slate-600">
                            <Image
                                src={brand.logo}
                                alt={brand.name}
                                width={56}
                                height={56}
                                className="w-full h-full object-contain"
                                unoptimized
                            />
                        </div>
                    ) : (
                        <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-sm">
                            {brand.name.charAt(0)}
                        </div>
                    )}

                    {/* Brand Info - Compact */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white truncate">
                                {brand.name}
                            </h3>
                            {brand.website && (
                                <a
                                    href={brand.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-shrink-0 p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <HiArrowTopRightOnSquare className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                        
                        {brand.industry && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-[10px] md:text-xs font-medium mb-1.5">
                                <HiSparkles className="w-2.5 h-2.5" />
                                {brand.industry}
                            </div>
                        )}

                        {/* Services Badges - Compact */}
                        {uniqueServices.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {uniqueServices.slice(0, 3).map((service, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] font-medium"
                                    >
                                        <HiCheck className="w-2.5 h-2.5 text-teal-600 dark:text-teal-400" />
                                        {service}
                                    </span>
                                ))}
                                {uniqueServices.length > 3 && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] font-medium">
                                        +{uniqueServices.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Projects List - Compact */}
            <div className="p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white">
                        پروژه‌های انجام شده
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mr-1.5">
                            ({projectCount})
                        </span>
                    </h4>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                    {displayProjects.map((project, projectIdx) => {
                        const projectTitle = typeof project.title === 'string' 
                            ? project.title 
                            : (project.title?.fa || project.title?.en || "بدون عنوان");
                        const projectSlug = project.slug?.fa || project.slug?.en || project.slug || "";
                        const projectDesc = typeof project.shortDescription === 'string'
                            ? project.shortDescription
                            : (project.shortDescription?.fa || project.shortDescription?.en || "");
                        const projectImage = project.featuredImage || "/assets/images/portfolio-placeholder.jpg";

                        return (
                            <div
                                key={project._id}
                                className="block group cursor-pointer"
                                onMouseEnter={() => setHoveredProject(project._id)}
                                onMouseLeave={() => setHoveredProject(null)}
                                onClick={() => {
                                    setSelectedProject(project);
                                    setIsModalOpen(true);
                                }}
                            >
                                <div className="flex gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-300 border border-transparent hover:border-teal-200 dark:hover:border-teal-800">
                                    {/* Project Image - Smaller */}
                                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden bg-slate-200 dark:bg-slate-700 relative">
                                        <Image
                                            src={projectImage}
                                            alt={projectTitle}
                                            fill
                                            sizes="(max-width: 768px) 64px, 80px"
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            loading="lazy"
                                            quality={85}
                                        />
                                        {project.isFeatured && (
                                            <div className="absolute top-1 right-1">
                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-teal-600 text-white rounded text-[9px] font-semibold">
                                                    <HiSparkles className="w-2.5 h-2.5" />
                                                    ویژه
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Project Info - Compact */}
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-sm md:text-base font-semibold text-slate-900 dark:text-white mb-0.5 line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                            {projectTitle}
                                        </h5>
                                        {projectDesc && (
                                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mb-1.5">
                                                {projectDesc}
                                            </p>
                                        )}
                                        
                                        {/* Project Services - Compact */}
                                        {project.services && project.services.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1.5">
                                                {project.services.slice(0, 2).map((service, serviceIdx) => {
                                                    const serviceName = typeof service === 'object' && service.name
                                                        ? (typeof service.name === 'string' ? service.name : (service.name.fa || service.name.en))
                                                        : service;
                                                    return (
                                                        <span
                                                            key={serviceIdx}
                                                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] border border-slate-200 dark:border-slate-700"
                                                        >
                                                            <HiCheck className="w-2 h-2 text-teal-600 dark:text-teal-400" />
                                                            {serviceName}
                                                        </span>
                                                    );
                                                })}
                                                {project.services.length > 2 && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] border border-slate-200 dark:border-slate-700">
                                                        +{project.services.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Arrow Icon - Smaller */}
                                    <div className="flex-shrink-0 flex items-center">
                                        <HiArrowLeft className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${hoveredProject === project._id ? 'translate-x-[-3px] text-teal-600 dark:text-teal-400' : ''}`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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

                {/* Expand/Collapse Button - Compact */}
                {projectCount > displayProjects.length && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full mt-3 px-3 py-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                        {expanded ? (
                            <>
                                <span>نمایش کمتر</span>
                                <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </>
                        ) : (
                            <>
                                <span>مشاهده همه ({projectCount - displayProjects.length})</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
