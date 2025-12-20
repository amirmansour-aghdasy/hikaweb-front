"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Fallback brands if API fails
const fallbackBrands = [
    "/assets/brands/brand-1.png",
    "/assets/brands/brand-2.png",
    "/assets/brands/brand-3.png",
    "/assets/brands/brand-4.png",
    "/assets/brands/brand-5.png",
    "/assets/brands/brand-6.png",
    "/assets/brands/brand-7.png",
    "/assets/brands/brand-8.png",
    "/assets/brands/brand-9.png",
    "/assets/brands/brand-10.png",
    "/assets/brands/brand-11.png",
    "/assets/brands/brand-12.png"
];

const BrandsSection = ({ brands = [] }) => {
    const displayBrands = brands.length > 0 ? brands : fallbackBrands;
    // Enable loop only if we have enough slides for seamless scrolling
    const hasEnoughSlides = displayBrands.length >= 6;

    return (
        <section id="home-page-brands-slider" className="w-full section-spacing">
            <h4
                className="text-lg relative font-bold flex items-center text-slate-700 dark:text-slate-100 section-heading before:content-[''] before:absolute before:-right-[2015px] before:w-[2000px] before:rounded-full before:h-1 before:bg-teal-100 dark:before:bg-teal-900/30 after:content=[''] after:absolute after:w-[30px] after:h-1 after:bg-teal-500 dark:after:bg-teal-600 after:rounded-full after:-right-[45px]"
                data-aos="fade-left"
            >
                افتخار همکاری با بیش از 27 برند
            </h4>

            <div className="w-full relative max-w-7xl mx-auto overflow-hidden section-content">
                {/* Fade overlay on the right (start) */}
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 z-10 pointer-events-none"></div>
                {/* Fade overlay on the left (end) */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 z-10 pointer-events-none"></div>
                
                <Swiper
                    modules={[Autoplay]}
                    loop={hasEnoughSlides}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                        stopOnLastSlide: false,
                    }}
                    speed={3000}
                    spaceBetween={14}
                    slidesPerView="auto"
                    freeMode={true}
                    allowTouchMove={false}
                    watchSlidesProgress={true}
                    className="brands-swiper w-full"
                    breakpoints={{
                        768: {
                            spaceBetween: 20,
                            speed: 4000,
                        },
                    }}
                >
                    {displayBrands.map((brand, index) => (
                        <SwiperSlide
                            key={`brand-${index}`}
                            className="!w-auto"
                            style={{ width: 'auto' }}
                        >
                            <div
                                className="brand-slide-wrapper flex flex-col justify-center items-center h-auto rounded-2xl md:rounded-none dark:md:rounded-2xl shadow-md dark:shadow-slate-800/50 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 md:bg-transparent dark:md:bg-slate-800/80 md:border-0 dark:md:border dark:md:border-slate-700 md:shadow-none dark:md:shadow-md dark:md:shadow-slate-800/50 py-2.5 px-11 md:p-0 dark:md:p-4 relative transition-all duration-500"
                                data-aos="fade-up"
                                data-aos-delay={index * 150}
                            >
                                <Image
                                    src={brand}
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    alt=""
                                    className="brand-logo-image w-full mx-auto h-32 grayscale hover:grayscale-0 transition-all duration-500 ease-in-out aspect-square object-contain"
                                />
                                {/* Bottom gradient line - light effect from bottom */}
                                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                                    <div className="w-3/4">
                                        <div className="h-[2px] bg-gradient-to-r from-transparent via-teal-500 dark:via-teal-600 to-transparent w-full"></div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default BrandsSection;

