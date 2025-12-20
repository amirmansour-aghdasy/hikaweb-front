"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { MagCategoryIcon_1, MagCategoryIcon_2, MagCategoryIcon_3, MagCategoryIcon_4, MagCategoryIcon_5 } from "@/lib/icons/svg";

const mag_categories = [
    {
        title: "پیشنهاد و ایده کسب و کار",
        icon: <MagCategoryIcon_1 />,
    },
    {
        title: "اخبار روز تکنولوژی ",
        icon: <MagCategoryIcon_2 />,
    },
    {
        title: "تبلیغات و مارکتینگ",
        icon: <MagCategoryIcon_3 />,
    },
    {
        title: "اخبار وب و برنامه نویسی",
        icon: <MagCategoryIcon_4 />,
    },
    {
        title: "مقالات برندسازی",
        icon: <MagCategoryIcon_5 />,
    },
];

const MagCategoriesSlider = () => {
    return (
        <Swiper
            className="w-full"
            slidesPerView={1.5}
            modules={[Autoplay]}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            speed={600}
            loop={true}
            spaceBetween={7}
            centeredSlides={true}
            watchOverflow={true}
            breakpoints={{ 1024: { slidesPerView: 5.5 } }}
            data-aos="fade-up"
        >
            <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white/60 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white/60 to-transparent z-10"></div>
            {[...mag_categories, ...mag_categories].map(({ title, icon }, index) => (
                <SwiperSlide style={{ display: "flex" }} className="w-full p-2.5 flex items-center justify-between rounded-xl text-sm sm:text-base bg-teal-600 text-white" key={index}>
                    <span>{title}</span>
                    <span>{icon}</span>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default MagCategoriesSlider;
