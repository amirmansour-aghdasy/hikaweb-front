"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { CommentCard } from "@/components/cards";

const CommentsSection = ({ comments = [] }) => {
    if (!comments || comments.length === 0) {
        return null;
    }

    return (
        <section id="comments-section" className="w-full section-spacing" aria-labelledby="comments-heading">
            <h4
                id="comments-heading"
                className="text-lg relative font-bold flex items-center text-slate-700 dark:text-slate-200 section-heading before:content-[''] before:absolute before:-right-[2015px] before:w-[2000px] before:rounded-full before:h-1 before:bg-teal-100 dark:before:bg-teal-900/30 after:content=[''] after:absolute after:w-[30px] after:h-1 after:bg-teal-500 dark:after:bg-teal-600 after:rounded-full after:-right-[45px]"
                data-aos="fade-left"
            >
                نظرات کاربران درباره هیکاوب
            </h4>
            
            <div className="w-full relative max-w-7xl mx-auto overflow-hidden">
                {/* Fade overlay on the right (start) - responsive and dark mode */}
                <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 lg:w-32 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 z-10 pointer-events-none"></div>
                {/* Fade overlay on the left (end) - responsive and dark mode */}
                <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 lg:w-32 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 z-10 pointer-events-none"></div>
                
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={20}
                    slidesPerView={1.2}
                    centeredSlides={true}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    speed={600}
                    watchOverflow={true}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        el: '.comments-swiper-pagination',
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 1.5,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 24,
                            centeredSlides: false,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 24,
                        },
                    }}
                    className="comments-swiper"
                >
                    {comments.map((comment, index) => (
                        <SwiperSlide key={`comment-${comment.writer}-${index}`}>
                            <CommentCard comment={comment} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                
                {/* Pagination */}
                <div className="comments-swiper-pagination flex items-center justify-center gap-2 mt-6"></div>
            </div>
        </section>
    );
};

export default CommentsSection;

