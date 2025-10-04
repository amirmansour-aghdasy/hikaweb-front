"use client";
import { useState } from "react";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ServiceProcessCard } from "../cards";

const ServiceProcessSlider = ({ process }) => {
    const [atEnd, setAtEnd] = useState(false);
    const [atStart, setAtStart] = useState(true);

    return (
        <div className="w-full relative" data-aos="zoom-in">
            {!atEnd && <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white/60 to-transparent z-10"></div>}
            {!atStart && <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white/60 to-transparent z-10"></div>}
            <Swiper
                autoplay={true}
                spaceBetween={25}
                slidesPerView={1.4}
                modules={[Autoplay]}
                centeredSlides={false}
                className="w-full max-w-full md:max-w-7xl mx-auto mySwiper11"
                breakpoints={{ 768: { slidesPerView: 5, spaceBetween: 40 } }}
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
