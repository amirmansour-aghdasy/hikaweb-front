"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { PricingPlanCard } from "@/components/cards";

const ServicePricingPlansSlider = ({ order, slides }) => {
    return (
        <Swiper
            className="w-full max-w-full md:max-w-6xl mx-auto mySwiper10"
            modules={[Autoplay]}
            slidesPerView={1.3}
            autoplay={true}
            loop={slides?.length > 3}
            centeredSlides={slides?.length > 3}
            spaceBetween={25}
            autoHeight={true}
            breakpoints={{ 768: { slidesPerView: slides.length > 3 ? 3.5 : 3, spaceBetween: 10 } }}
        >
            {slides.map((plan, index) => (
                <SwiperSlide key={index} className="w-full rounded-2xl shadow-md">
                    <PricingPlanCard plan={plan} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default ServicePricingPlansSlider;
