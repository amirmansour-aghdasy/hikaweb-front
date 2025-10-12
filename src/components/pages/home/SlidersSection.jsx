"use client";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";

const SlidersSection = () => {
    return (
        <section id="sliders-section" className="w-full grid grid-cols-12 lg:gap-x-10">
            <div className="col-span-12 w-full lg:col-span-8" data-aos="fade-left">
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
                    autoplay={true}
                    loop={true}
                    className="mySwiper w-full lg:h-80"
                >
                    <SwiperSlide className="rounded-2xl shadow-md my-7 lg:my-0 overflow-hidden">
                        <Image src="/assets/banners/main-slider-banner-1.webp" width="0" height="0" title="" alt="" className="w-full h-32 md:h-auto rounded-2xl object-cover" sizes="100vw" />
                    </SwiperSlide>
                    <SwiperSlide className="rounded-2xl shadow-md my-7 lg:my-0 overflow-hidden">
                        <Image src="/assets/banners/main-slider-banner-2.webp" width="0" height="0" title="" alt="" className="w-full h-32 md:h-auto rounded-2xl object-cover" sizes="100vw" />
                    </SwiperSlide>
                    <SwiperSlide className="rounded-2xl shadow-md my-7 lg:my-0 overflow-hidden">
                        <Image src="/assets/banners/main-slider-banner-3.webp" width="0" height="0" title="" alt="" className="w-full h-32 md:h-auto rounded-2xl object-cover" sizes="100vw" />
                    </SwiperSlide>
                    <SwiperSlide className="rounded-2xl shadow-md my-7 lg:my-0 overflow-hidden">
                        <Image src="/assets/banners/main-slider-banner-3.webp" width="0" height="0" title="" alt="" className="w-full h-32 md:h-auto rounded-2xl object-cover" sizes="100vw" />
                    </SwiperSlide>
                </Swiper>
            </div>
            <div className="hidden lg:flex col-span-12 lg:col-span-4 w-full h-auto md:h-80 relative" data-aos="fade-right">
                <Swiper effect={"cards"} modules={[EffectCards, Autoplay]} autoplay={true} className="mySwiper2 w-11/12 mx-auto md:w-full h-full">
                    <SwiperSlide className="rounded-2xl overflow-hidden w-full">
                        <Image src="/assets/banners/small-slider-banner-1.webp" title="" alt="" width="0" height="0" sizes="100vw" className="w-full h-full" />
                    </SwiperSlide>
                    <SwiperSlide className="rounded-2xl overflow-hidden w-full">
                        <Image src="/assets/banners/small-slider-banner-2.webp" title="" alt="" width="0" height="0" sizes="100vw" className="w-full h-full" />
                    </SwiperSlide>
                    <SwiperSlide className="rounded-2xl overflow-hidden w-full">
                        <Image src="/assets/banners/small-slider-banner-1.webp" title="" alt="" width="0" height="0" sizes="100vw" className="w-full h-full" />
                    </SwiperSlide>
                </Swiper>
            </div>
        </section>
    );
};

export default SlidersSection;
