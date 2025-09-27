"use client";

import Link from "next/link";
import Image from "next/image";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { services_list } from "@/lib/constants";

const ServicesSection = () => {
    return (
        <section id="services-section" className="w-full">
            <h4
                className="text-lg relative font-bold flex items-center text-slate-700 before:content-[''] before:absolute before:-right-[2015px] before:w-[2000px] before:rounded-full before:h-1 before:bg-teal-100 after:content=[''] after:absolute after:w-[30px] after:h-1 after:bg-teal-500 after:rounded-full after:-right-[45px]"
                data-aos="fade-right"
            >
                خدمات جامع هیکاوب
            </h4>
            <div className="w-full hidden sm:grid grid-cols-4 gap-5 mt-10 max-w-5xl mx-auto">
                {services_list.map(({ giffSrc, url, title }, index) => (
                    <Link
                        href={url}
                        key={index}
                        className="rounded-2xl shadow-md hover:shadow hover:shadow-teal-500 hover:border-b-teal-500 hover:-translate-y-2 transition-all duration-300 ease-in-out group"
                        data-aos="fade-up"
                        data-aos-delay={index * 150}
                    >
                        <div className="flex justify-center translate-y-0">
                            <div className="w-3/4">
                                <div className="h-[2px] bg-gradient-to-r from-transparent via-teal-500 to-transparent w-full"></div>
                            </div>
                        </div>
                        <div className="px-1.5 py-3.5 w-full h-full">
                            <Image src={giffSrc} width="0" height="0" sizes="100vw" className="w-4/12 h-auto mx-auto" unoptimized={true} alt={title} title={title} />
                            <span className="w-full inline-block text-sm font-bold text-center text-slate-500 group-hover:text-slate-700 transition-all duration-300 ease-in-out whitespace-nowrap mt-3.5">
                                {title}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
            {/* In Mobile Screen ( < 768 ) Show as Slider */}
            <div className="w-full sm:hidden">
                <Swiper slidesPerView={1.4} spaceBetween={25} centeredSlides={true} autoplay={true} modules={[Autoplay]} loop={true} className="w-full mySwiper7 mt-5">
                    {services_list.map(({ giffSrc, url, title }, index) => (
                        <SwiperSlide
                            key={index}
                            className="rounded-2xl shadow-md hover:shadow hover:shadow-teal-500 hover:border-b-teal-500 hover:-translate-y-2 transition-all duration-300 ease-in-out group"
                        >
                            <div className="flex justify-center translate-y-0">
                                <div className="w-3/4">
                                    <div className="h-[1.75px] bg-gradient-to-r from-transparent via-teal-500 to-transparent w-full"></div>
                                </div>
                            </div>
                            <Link href={url} className="block">
                                <div className="px-1.5 py-3.5 w-full h-full">
                                    <Image src={giffSrc} width="0" height="0" sizes="100vw" className="w-4/12 h-auto mx-auto" unoptimized={true} alt={title} title={title} />
                                    <span className="w-full inline-block text-sm font-bold text-center text-slate-500 group-hover:text-slate-700 transition-all duration-300 ease-in-out whitespace-nowrap mt-3.5">
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
