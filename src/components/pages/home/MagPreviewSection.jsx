"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import { articles } from "@/__mocks__";
import { ArticleCard } from "@/components/cards";

const MagPreviewSection = () => {
    return (
        <section id="mag-preview-section" className="w-full">
            <div className="w-full flex justify-between items-center">
                <h4
                    className="text-lg relative font-bold flex items-center text-slate-700 before:content-[''] before:absolute before:-right-[2015px] before:w-[2000px] before:rounded-full before:h-1 before:bg-teal-100 after:content=[''] after:absolute after:w-[30px] after:h-1 after:bg-teal-500 after:rounded-full after:-right-[45px]"
                    data-aos="fade-left"
                >
                    آخرین مقالات هیکامگ
                </h4>
            </div>
            <div className="relative w-full">
                <Swiper
                    loop={true}
                    slidesPerView={1.3}
                    spaceBetween={25}
                    autoplay={true}
                    centeredSlides={true}
                    breakpoints={{
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 15,
                            centeredSlides: false
                        },
                    }}
                    className="mySwiper4 w-full mt-5"
                    modules={[Autoplay]}
                    data-aos="zoom-in"
                >
                    {articles.map((article, index) => (
                        <SwiperSlide className="shadow-md w-full rounded-2xl" key={index}>
                            <ArticleCard article={article} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="pointer-events-none absolute left-0 top-0 h-full w-8 md:w-20 bg-gradient-to-r from-white/40 via-white/20 to-transparent z-10"></div>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-8 md:w-20 bg-gradient-to-l from-white/40 via-white/20 to-transparent z-10"></div>
            </div>
        </section>
    );
};

export default MagPreviewSection;
