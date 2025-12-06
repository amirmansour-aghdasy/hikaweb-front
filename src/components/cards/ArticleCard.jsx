"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import toast from "react-hot-toast";
import { BsClock, BsEye } from "react-icons/bs";
import { GoShareAndroid } from "react-icons/go";
import { FiArrowLeft } from "react-icons/fi";
import { HiOutlineFire } from "react-icons/hi";
import BookmarkButton from "@/components/common/BookmarkButton";

const ArticleCard = ({ article, ...otherProps }) => {
    const { title, description, thumbnail, createdAt, readTime, slug, views = 0 } = article;
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // Extract article ID from various possible structures
    const articleId = article.id || article._id || (article.article?._id) || (article.article?.id);
    const isFeatured = article.article?.isFeatured || article.isFeatured;

    const date = new Date(createdAt);
    const day = new Intl.DateTimeFormat("fa-IR", { day: "numeric" }).format(date);
    const month = new Intl.DateTimeFormat("fa-IR", { month: "short" }).format(date);

    const handleShare = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const articleUrl = slug ? `${window.location.origin}/mag/${slug}` : window.location.origin;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: description,
                    url: articleUrl,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("خطا در اشتراک‌گذاری:", err);
                }
            }
        } else {
            navigator.clipboard.writeText(articleUrl);
            toast.success(`لینک مقاله کپی شد.`);
        }
    };

    return (
        <Link 
            href={`/mag/${slug || '#'}`}
            className="group relative flex flex-col w-full h-full rounded-3xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600"
            {...otherProps}
        >
            {/* Image Container - Enhanced */}
            <div className="relative w-full h-52 md:h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 animate-pulse"></div>
                )}
                <Image 
                    src={thumbnail || "/assets/images/post-thumb-1.webp"} 
                    alt={title}
                    fill
                    className={`object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onLoad={() => setImageLoaded(true)}
                />
                
                {/* Gradient Overlay - Enhanced */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Featured Badge */}
                {isFeatured && (
                    <div className="absolute top-5 right-5 z-10">
                        <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xl">
                            <HiOutlineFire className="w-4 h-4" />
                            ویژه
                        </span>
                    </div>
                )}
                
                {/* Date Badge - Enhanced */}
                <div className="absolute bottom-5 right-5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-2xl border border-white/50 dark:border-slate-700/50 z-10 group-hover:scale-105 transition-transform duration-300">
                    <div className="text-center">
                        <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-none">{day}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 font-semibold">{month}</div>
                    </div>
                </div>

                {/* Action Buttons - Enhanced */}
                <div className="absolute top-5 left-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 z-10">
                    <BookmarkButton 
                        articleId={articleId}
                        variant="icon-only"
                    />
                    <button
                        onClick={handleShare}
                        className="w-11 h-11 flex items-center justify-center bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-teal-600 hover:to-cyan-600 hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110"
                        title="اشتراک‌گذاری"
                    >
                        <GoShareAndroid className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content - Enhanced */}
            <div className="p-6 md:p-7 flex flex-col flex-grow bg-white dark:bg-slate-800">
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300 leading-tight">
                    {title}
                </h3>
                
                {description && (
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 flex-grow leading-relaxed">
                        {description}
                    </p>
                )}

                {/* Footer - Enhanced */}
                <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-700 mt-auto">
                    <div className="flex items-center gap-5 text-xs md:text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <BsClock className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            </div>
                            <span className="font-semibold">{readTime || '5'} دقیقه</span>
                        </div>
                        {views > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                    <BsEye className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                                </div>
                                <span className="font-semibold">{views.toLocaleString('fa-IR')}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors font-semibold">
                        <span className="text-sm md:text-base">مطالعه</span>
                        <FiArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-teal-300 dark:group-hover:border-teal-600 transition-all duration-500 pointer-events-none"></div>
        </Link>
    );
};

export default ArticleCard;
