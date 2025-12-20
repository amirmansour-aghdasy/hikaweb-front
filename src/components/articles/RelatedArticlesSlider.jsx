"use client";

import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { HiOutlineNewspaper } from "react-icons/hi2";
import "swiper/css";

const ArticleCard = dynamic(() => import("@/components/cards").then(mod => mod.ArticleCard), {
    loading: () => <div className="w-full h-64 bg-slate-100 animate-pulse rounded-2xl" />,
    ssr: true,
});

export default function RelatedArticlesSlider({ articles = [] }) {
    if (!articles || articles.length === 0) {
        return null;
    }

    return (
        <section className="w-full">
            <div className="flex items-center gap-3 mb-8">
                <HiOutlineNewspaper className="text-2xl text-teal-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">مقالات مرتبط</h2>
            </div>
            <Swiper
                modules={[Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                speed={600}
                watchOverflow={true}
            >
                {articles.map((article) => {
                    const formattedArticle = {
                        id: article._id,
                        _id: article._id,
                        title: article.title?.fa || article.title,
                        description: article.excerpt?.fa || article.shortDescription?.fa || "",
                        thumbnail: article.featuredImage || "/assets/images/post-thumb-1.webp",
                        createdAt: article.publishedAt || article.createdAt,
                        readTime: `${article.readTime || 5} دقیقه`,
                        slug: article.slug?.fa || article.slug?.en || article.slug,
                        views: article.views || 0,
                        article
                    };
                    
                    return (
                        <SwiperSlide key={article._id}>
                            <div className="h-full">
                                <ArticleCard article={formattedArticle} />
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </section>
    );
}

