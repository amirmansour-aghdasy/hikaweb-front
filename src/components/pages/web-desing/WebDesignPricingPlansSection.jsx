"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { webDesignPricingPlans } from "@/__mocks__";
import { PricingPlanCard } from "@/components/cards";

const WebDesignPricingPlansSection = () => {
    return (
        <section id="web-design-pricing-plans" className="w-full md:max-w-6xl mx-auto">
            <Swiper
                className="w-full mySwiper10"
                modules={[Autoplay]}
                slidesPerView={1.3}
                autoplay={true}
                loop={true}
                centeredSlides={true}
                spaceBetween={22.5}
                breakpoints={{ 768: { slidesPerView: 3.5, spaceBetween: 10 } }}
            >
                {webDesignPricingPlans.map((plan, index) => (
                    <SwiperSlide key={index} className="h-full rounded-2xl  shadow-md">
                        <PricingPlanCard plan={plan} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default WebDesignPricingPlansSection;
