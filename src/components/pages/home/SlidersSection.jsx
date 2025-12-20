"use client";
import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";

const SlidersSection = () => {
    return (
        <section id="sliders-section" className="w-full grid grid-cols-12 lg:gap-x-10">
            <div className="col-span-12 w-full lg:col-span-8" data-aos="fade-left" suppressHydrationWarning>
                <Swiper
                    slidesPerView={1.3}
                    breakpoints={{
                        1024: {
                            slidesPerView: 1,
                            spaceBetween: 7,
                        },
                    }}
                    centeredSlides={true}
                    spaceBetween={20}
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    speed={600}
                    loop={false}
                    watchOverflow={true}
                    className="mySwiper w-full lg:h-80"
                >
                    <SwiperSlide className="rounded-2xl shadow-md dark:shadow-slate-800/50 border border-slate-200 dark:border-slate-700 my-7 lg:my-0 overflow-hidden">
                        <Link href="/service/web-design" title="برنامه نویسی و طراحی سایت هیکاوب" className="block">
                            <Image
                                src="/assets/banners/main-slider-banner-1.webp"
                                width="0"
                                height="0"
                                title="برنامه نویسی و طراحی سایت هیکاوب"
                                alt="برنامه نویسی و طراحی سایت هیکاوب"
                                className="w-full h-32 md:h-auto rounded-2xl object-cover dark:brightness-90 dark:contrast-105"
                                sizes="100vw"
                                priority
                            />
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide className="rounded-2xl shadow-md dark:shadow-slate-800/50 border border-slate-200 dark:border-slate-700 my-7 lg:my-0 overflow-hidden">
                        <Link href="/service/social-media-management" className="block" title="خدمات سوشال مارکتینگ هیکاوب">
                            <Image
                                src="/assets/banners/main-slider-banner-2.webp"
                                width="0"
                                height="0"
                                title="خدمات سوشال مارکتینگ هیکاوب"
                                alt="خدمات سوشال مارکتینگ هیکاوب"
                                className="w-full h-32 md:h-auto rounded-2xl object-cover dark:brightness-90 dark:contrast-105"
                                sizes="100vw"
                            />
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide className="rounded-2xl shadow-md dark:shadow-slate-800/50 border border-slate-200 dark:border-slate-700 my-7 lg:my-0 overflow-hidden">
                        <Link href="/service/graphic-design" className="block" title="خدمات طراحی و گرافیک هیکاوب">
                            <Image
                                src="/assets/banners/main-slider-banner-3.webp"
                                width="0"
                                height="0"
                                title="خدمات طراحی و گرافیک هیکاوب"
                                alt="خدمات طراحی و گرافیک هیکاوب"
                                className="w-full h-32 md:h-auto rounded-2xl object-cover dark:brightness-90 dark:contrast-105"
                                sizes="100vw"
                            />
                        </Link>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div className="hidden lg:flex col-span-12 lg:col-span-4 w-full h-auto md:h-80 relative" data-aos="fade-right" suppressHydrationWarning>
                <Swiper 
                    effect={"cards"} 
                    modules={[EffectCards, Autoplay]} 
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    speed={600}
                    watchOverflow={true}
                    className="mySwiper2 w-11/12 mx-auto md:w-full h-full"
                >
                    <SwiperSlide className="rounded-2xl overflow-hidden w-full shadow-md dark:shadow-slate-800/50 border border-slate-200 dark:border-slate-700" title="خدمات طراحی لوگو و برند سازی هیکاوب">
                        <Link href="/service/logo-design" className="block" title="خدمات طراحی لوگو و برند سازی هیکاوب">
                            <Image
                                src="/assets/banners/small-slider-banner-1.webp"
                                title="خدمات طراحی لوگو و برند سازی هیکاوب"
                                alt="خدمات طراحی لوگو و برند سازی هیکاوب"
                                width="0"
                                height="0"
                                sizes="100vw"
                                className="w-full h-full dark:brightness-90 dark:contrast-105"
                            />
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide className="rounded-2xl overflow-hidden w-full shadow-md dark:shadow-slate-800/50 border border-slate-200 dark:border-slate-700">
                        <Link href="/service/printing" className="block" title="خدمات چاپ و تبلیغات محیطی هیکاوب">
                            <Image
                                src="/assets/banners/small-slider-banner-2.webp"
                                title="خدمات چاپ و تبلیغات محیطی هیکاوب"
                                alt="خدمات چاپ و تبلیغات محیطی هیکاوب"
                                width="0"
                                height="0"
                                sizes="100vw"
                                className="w-full h-full dark:brightness-90 dark:contrast-105"
                            />
                        </Link>
                    </SwiperSlide>
                </Swiper>
            </div>
        </section>
    );
};

export default SlidersSection;
