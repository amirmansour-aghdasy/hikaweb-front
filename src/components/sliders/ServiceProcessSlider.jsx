"use client";
import { useState } from "react";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ServiceProcessCard } from "../cards";

const ServiceProcessSlider = ({ process }) => {
    const [atEnd, setAtEnd] = useState(false);
    const [atStart, setAtStart] = useState(true);

    if (!process || process.length === 0) {
        return null;
    }

    return (
        <div className="w-full relative max-w-7xl mx-auto overflow-hidden py-5" data-aos="zoom-in">
            {/* Fade overlay on the right (start) - responsive and dark mode */}
            {!atEnd && (
                <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 lg:w-32 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 z-10 pointer-events-none"></div>
            )}
            {/* Fade overlay on the left (end) - responsive and dark mode */}
            {!atStart && (
                <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 lg:w-32 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 z-10 pointer-events-none"></div>
            )}
            <Swiper
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                speed={600}
                spaceBetween={20}
                slidesPerView={1.4}
                modules={[Autoplay]}
                centeredSlides={true}
                watchOverflow={true}
                className="w-full mySwiper11"
                breakpoints={{ 
                    768: { 
                        slidesPerView: 5, 
                        spaceBetween: 20,
                        centeredSlides: false
                    } 
                }}
                onSlideChange={(swiper) => {
                    setAtStart(swiper.isBeginning);
                    setAtEnd(swiper.isEnd);
                }}
            >
                {process.map((item, index) => (
                    <SwiperSlide className="w-full h-full" key={index}>
                        <ServiceProcessCard item={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ServiceProcessSlider;
