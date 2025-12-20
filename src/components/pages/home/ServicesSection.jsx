"use client";

import Link from "next/link";
import Image from "next/image";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { services_list } from "@/lib/constants";

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

const ServicesSection = ({ services = [] }) => {
    // Use API services if available, otherwise fallback to static list
    const displayServices = services.length > 0 
        ? services.map(service => ({
            title: service.name?.fa || service.name,
            giffSrc: SERVICE_GIF_MAP[service.slug?.fa] || SERVICE_GIF_MAP[service.slug?.en] || "/assets/giff/market-research.gif",
            url: `/service/${service.slug?.fa || service.slug?.en || service.slug}`,
            service
        }))
        : services_list;

    return (
        <section id="services-section" className="w-full section-spacing">
            <h4
                className="text-lg relative font-bold flex items-center text-slate-700 dark:text-slate-100 section-heading before:content-[''] before:absolute before:-right-[2015px] before:w-[2000px] before:rounded-full before:h-1 before:bg-teal-100 dark:before:bg-teal-900/30 after:content=[''] after:absolute after:w-[30px] after:h-1 after:bg-teal-500 dark:after:bg-teal-600 after:rounded-full after:-right-[45px]"
                data-aos="fade-right"
            >
                خدمات جامع هیکاوب
            </h4>
            <div className="w-full hidden sm:grid grid-cols-4 gap-5 section-content max-w-5xl mx-auto">
                {displayServices.map(({ giffSrc, url, title }, index) => (
                    <Link
                        href={url}
                        key={index}
                        className="rounded-2xl shadow-md dark:shadow-slate-800/50 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-teal-500/50 dark:hover:shadow-teal-600/30 hover:border-b-teal-500 dark:hover:border-b-teal-600 hover:-translate-y-2 transition-all duration-300 ease-in-out group"
                        data-aos="fade-up"
                        data-aos-delay={index * 150}
                    >
                        <div className="flex justify-center translate-y-0">
                            <div className="w-3/4">
                                <div className="h-[2px] bg-gradient-to-r from-transparent via-teal-500 dark:via-teal-600 to-transparent w-full"></div>
                            </div>
                        </div>
                        <div className="px-1.5 py-3.5 w-full h-full">
                            <Image src={giffSrc} width="0" height="0" sizes="100vw" className="w-4/12 h-auto mx-auto" unoptimized={true} alt={title} title={title} />
                            <span className="w-full inline-block text-sm font-bold text-center text-slate-500 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-slate-100 transition-all duration-300 ease-in-out whitespace-nowrap mt-3.5">
                                {title}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
            {/* In Mobile Screen ( < 768 ) Show as Slider */}
            <div className="w-full sm:hidden relative max-w-5xl mx-auto overflow-hidden">
                {/* Fade overlay on the right (start) - smaller on mobile */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 z-10 pointer-events-none"></div>
                {/* Fade overlay on the left (end) - smaller on mobile */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 z-10 pointer-events-none"></div>
                
                <Swiper 
                    slidesPerView={1.4} 
                    spaceBetween={20} 
                    centeredSlides={true} 
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    speed={600}
                    modules={[Autoplay]} 
                    loop={false}
                    watchOverflow={true}
                    className="w-full mySwiper7 mt-5"
                >
                    {displayServices.map(({ giffSrc, url, title }, index) => (
                        <SwiperSlide
                            key={index}
                            className="rounded-2xl shadow-md dark:shadow-slate-800/50 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-teal-500/50 dark:hover:shadow-teal-600/30 hover:border-b-teal-500 dark:hover:border-b-teal-600 hover:-translate-y-2 transition-all duration-300 ease-in-out group"
                        >
                            <div className="flex justify-center translate-y-0">
                                <div className="w-3/4">
                                    <div className="h-[1.75px] bg-gradient-to-r from-transparent via-teal-500 dark:via-teal-600 to-transparent w-full"></div>
                                </div>
                            </div>
                            <Link href={url} className="block">
                                <div className="px-1.5 py-3.5 w-full h-full">
                                    <Image src={giffSrc} width="0" height="0" sizes="100vw" className="w-4/12 h-auto mx-auto" unoptimized={true} alt={title} title={title} />
                                    <span className="w-full inline-block text-sm font-bold text-center text-slate-500 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-slate-100 transition-all duration-300 ease-in-out whitespace-nowrap mt-3.5">
                                        {title}
                                    </span>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default ServicesSection;
