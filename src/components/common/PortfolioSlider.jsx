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
            speed={600}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            spaceBetween={5}
            slidesPerView={1.9}
            centeredSlides={true}
            modules={[Autoplay]}
            className={`w-full relative portfolio-slider`}
            breakpoints={{ 640: { slidesPerView: 4, spaceBetween: 7 } }}
            watchOverflow={true}
        >
            {slides.map(({ imageSrc, alt, title }, i) => (
                <SwiperSlide className="rounded-xl overflow-hidden shadow-md dark:shadow-slate-800/50 border border-slate-200 dark:border-slate-700" key={i}>
                    <Image 
                        src={imageSrc} 
                        width="0" 
                        height="0" 
                        sizes="(max-width: 640px) 50vw, 25vw" 
                        className="w-full h-auto dark:brightness-90 dark:contrast-105" 
                        alt={alt} 
                        title={title}
                        loading="lazy"
                        quality={85}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default PortfolioSlider;
