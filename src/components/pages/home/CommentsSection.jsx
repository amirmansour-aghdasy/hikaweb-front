"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { users_comment } from "@/__mocks__";
import { CommentCard } from "@/components/cards";

const CommentsSection = () => {
    return (
        <section id="comments-section" className="w-full">
            <h4
                className="text-lg relative font-bold flex items-center text-slate-700 before:content-[''] before:absolute before:-right-[2015px] before:w-[2000px] before:rounded-full before:h-1 before:bg-teal-100 after:content=[''] after:absolute after:w-[30px] after:h-1 after:bg-teal-500 after:rounded-full after:-right-[45px]"
                data-aos="fade-left"
            >
                نظرات کاربران درباره هیکاوب
            </h4>
            <div className="w-full relative">
                <Swiper
                    loop={true}
                    autoplay={true}
                    spaceBetween={20}
                    slidesPerView={1.3}
                    modules={[Autoplay]}
                    centeredSlides={true}
                    className="mySwiper3 w-full mt-5"
                    breakpoints={{
                        640: {
                            slidesPerView: 4,
                            spaceBetween: 15,
                            centeredSlides: false,
                        },
                    }}
                    data-aos="zoom-in"
                >
                    {users_comment.map((comment, index) => (
                        <SwiperSlide key={index} className="shadow-md rounded-2xl overflow-hidden">
                            <CommentCard comment={comment} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="pointer-events-none absolute left-0 top-0 h-full w-8 md:w-20 bg-gradient-to-r from-white/40 via-white/20 to-transparent z-10"></div>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-8 md:w-20 bg-gradient-to-l from-white/40 via-white/20 to-transparent z-10"></div>
            </div>
        </section>
    );
};

export default CommentsSection;
