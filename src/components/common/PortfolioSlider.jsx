"use client";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

const PortfolioSlider = ({ order, slides }) => {
    return (
        <Swiper
            loop={true}
            speed={1000}
            autoplay={true}
            spaceBetween={5}
            slidesPerView={1.9}
            centeredSlides={true}
            modules={[Autoplay, Navigation]}
            className={`w-full mySwiper${order} relative portfolio-slider`}
            breakpoints={{ 640: { slidesPerView: 4, spaceBetween: 7 } }}
        >
            {slides.map(({ src, alt, title }, i) => (
                <SwiperSlide className="rounded-xl overflow-hidden" key={i}>
                    <Image src={src} width="0" height="0" sizes="100vw" className="w-full h-auto" alt={alt} title={title} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default PortfolioSlider;
