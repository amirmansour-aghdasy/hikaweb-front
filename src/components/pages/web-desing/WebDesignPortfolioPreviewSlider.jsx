"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import { webDesignPortfolioPreviewContent } from "@/lib/constants";
import { WebDesignPortfolioPreviewSliderCard } from "@/components/cards";

const WebDesignPortfolioPreviewSlider = () => {
    return (
        <section className="w-full" id="web-design-portfolio-preview-slider">
            <div className="w-full flex items-center justify-start gap-2">
                <h3 className="text-2xl text-slate-700 font-bold whitespace-nowrap">بخشی از نمونه کار های ما</h3>
                <span className="flex w-full rounded h-0.5 bg-[#0E443C]"></span>
            </div>
            <Swiper
                className="w-full mySwiper6"
                slidesPerView={1.3}
                spaceBetween={22.5}
                modules={[Autoplay]}
                centeredSlides={true}
                loop={true}
                autoplay={true}
                breakpoints={{ 640: { slidesPerView: 5.1, spaceBetween: 15 } }}
            >
                {webDesignPortfolioPreviewContent.map((item, index) => (
                    <SwiperSlide key={index} className="rounded-2xl w-full shadow-md">
                        <WebDesignPortfolioPreviewSliderCard item={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default WebDesignPortfolioPreviewSlider;
