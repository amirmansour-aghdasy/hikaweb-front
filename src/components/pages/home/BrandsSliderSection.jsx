"use client";

import Image from "next/image";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const brands = [
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
    "/assets/brands/brand-12.png",
];

const BrandsSliderSection = () => {
    return (
        <section id="home-page-brands-slider" className="w-full">
            <h4
                className="text-lg relative font-bold flex items-center text-slate-700 before:content-[''] before:absolute before:-right-[2015px] before:w-[2000px] before:rounded-full before:h-1 before:bg-teal-100 after:content=[''] after:absolute after:w-[30px] after:h-1 after:bg-teal-500 after:rounded-full after:-right-[45px]"
                data-aos="fade-left"
            >
                افتخار همکاری با بیش از 27 برند
            </h4>
            <div className="w-full relative">
                <Swiper
                    spaceBetween={20}
                    slidesPerView={1.8}
                    centeredSlides={true}
                    autoplay={true}
                    modules={[Autoplay]}
                    loop={true}
                    breakpoints={{
                        640: {
                            slidesPerView: 10,
                            spaceBetween: 0,
                            centeredSlides: false,
                        },
                    }}
                    className="w-full mt-5 md:mt-10 mySwiper8"
                    data-aos="zoom-out"
                >
                    {brands.map((brand, index) => (
                        <SwiperSlide className="flex justify-center items-center h-auto rounded-2xl md:rounded-none md:shadow-none shadow-md" key={index}>
                            <Image
                                src={brand}
                                width="0"
                                height="0"
                                sizes="100vw"
                                alt=""
                                className="w-auto mx-auto h-32 grayscale hover:grayscale-0 trnasition-all duration-500 ease-in-out aspect-square object-contain"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="pointer-events-none absolute left-0 top-0 h-full w-8 md:w-20 bg-gradient-to-r from-white/40 via-white/20 to-transparent z-10"></div>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-8 md:w-20 bg-gradient-to-l from-white/40 via-white/20 to-transparent z-10"></div>
            </div>
        </section>
    );
};

export default BrandsSliderSection;
