"use client";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const PortfolioSlider = ({ order, slides }) => {
    // Enable loop only if we have enough slides
    // For slidesPerView=1.9, we need at least 4 slides
    // For slidesPerView=4 (breakpoint), we need at least 8 slides
    const hasEnoughSlides = slides && slides.length >= 8;
    
    return (
        <Swiper
            loop={hasEnoughSlides}
            speed={1000}
            autoplay={true}
            spaceBetween={5}
            slidesPerView={1.9}
            centeredSlides={true}
            modules={[Autoplay]}
            className={`w-full relative portfolio-slider`}
            breakpoints={{ 640: { slidesPerView: 4, spaceBetween: 7 } }}
        >
            {slides.map(({ imageSrc, alt, title }, i) => (
                <SwiperSlide className="rounded-xl overflow-hidden" key={i}>
                    <Image src={imageSrc} width="0" height="0" sizes="100vw" className="w-full h-auto" alt={alt} title={title} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default PortfolioSlider;
