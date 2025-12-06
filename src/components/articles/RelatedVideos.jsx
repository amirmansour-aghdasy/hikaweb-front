"use client";

import Link from "next/link";
import Image from "next/image";
import { HiPlay } from "react-icons/hi2";
import { BsEye } from "react-icons/bs";

export default function RelatedVideos({ videos = [] }) {
    if (!videos || videos.length === 0) {
        return null;
    }

    // Extract videos from portfolio gallery
    const videoItems = videos
        .map(portfolio => {
            const video = portfolio.gallery?.find(item => item.type === 'video');
            if (!video) return null;
            
            return {
                id: portfolio._id,
                title: portfolio.title?.fa || portfolio.title,
                slug: portfolio.slug?.fa || portfolio.slug?.en || portfolio.slug,
                thumbnail: portfolio.featuredImage || video.url,
                videoUrl: video.url,
                views: portfolio.views || 0,
                description: portfolio.shortDescription?.fa || portfolio.description?.fa || ""
            };
        })
        .filter(Boolean);

    if (videoItems.length === 0) {
        return null;
    }

    return (
        <section className="w-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-500 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">ویدئوهای مرتبط</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {videoItems.map((video) => (
                    <Link
                        key={video.id}
                        href={`/portfolio/${video.slug}`}
                        className="group relative block rounded-xl bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700"
                    >
                        <div className="relative h-48 overflow-hidden bg-slate-900">
                            <Image
                                src={video.thumbnail}
                                alt={video.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-70"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            
                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center group-hover:bg-teal-600 group-hover:border-teal-400 transition-all duration-300">
                                    <HiPlay className="w-8 h-8 text-white mr-1" />
                                </div>
                            </div>

                            {/* Views Badge */}
                            {video.views > 0 && (
                                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs">
                                    <BsEye className="w-3 h-3" />
                                    <span>{video.views}</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                {video.title}
                            </h3>
                            {video.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                    {video.description}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

