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
            autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            speed={600}
            loop={slides?.length > 3}
            centeredSlides={true}
            spaceBetween={25}
            autoHeight={true}
            watchOverflow={true}
            breakpoints={{ 768: { slidesPerView: slides.length > 3 ? 3.5 : 3, spaceBetween: 25, centeredSlides: slides?.length > 3 } }}
            data-aos="fade-up"
        >
            {slides.map((plan, index) => (
                <SwiperSlide key={index} className={`w-full rounded-2xl shadow-md  ${slides.length <= 3 && "translateUp"} cursor-default`}>
                    <PricingPlanCard plan={plan} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default ServicePricingPlansSlider;
