"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import { ArticleCard } from "@/components/cards";

const MagPreviewSection = ({ articles = [] }) => {
    const displayArticles = articles.slice(0, 6);

    if (displayArticles.length === 0) {
        return null;
    }

    return (
        <section id="mag-preview-section" className="w-full section-spacing">
            <div className="w-full flex justify-between items-center section-heading">
                <h4
                    className="text-lg relative font-bold flex items-center text-slate-700 dark:text-slate-100 before:content-[''] before:absolute before:-right-[2015px] before:w-[2000px] before:rounded-full before:h-1 before:bg-teal-100 dark:before:bg-teal-900/30 after:content=[''] after:absolute after:w-[30px] after:h-1 after:bg-teal-500 dark:after:bg-teal-600 after:rounded-full after:-right-[45px]"
                    data-aos="fade-left"
                >
                    آخرین مقالات هیکامگ
                </h4>
            </div>
            <div className="w-full relative max-w-7xl mx-auto overflow-hidden section-content">
                {/* Fade overlay on the right (start) - smaller on mobile */}
                <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 lg:w-32 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 z-10 pointer-events-none"></div>
                {/* Fade overlay on the left (end) - smaller on mobile */}
                <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 lg:w-32 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 z-10 pointer-events-none"></div>
                
                <Swiper
                    loop={displayArticles.length > 1}
                    slidesPerView={1.4}
                    spaceBetween={20}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    speed={600}
                    centeredSlides={true}
                    breakpoints={{
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 15,
                            centeredSlides: false,
                        },
                    }}
                    watchOverflow={true}
                    className="mySwiper4 w-full mt-5"
                    modules={[Autoplay]}
                    data-aos="zoom-in"
                >
                    {displayArticles.map((article, index) => (
                        <SwiperSlide className="shadow-md w-full rounded-2xl" key={article.id || index}>
                            <ArticleCard article={article} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default MagPreviewSection;
