"use client";

import Link from "next/link";
import Image from "next/image";
import { BsPlayFill, BsClock, BsEye, BsHeartFill } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";

export default function VideoCard({ video, viewMode = 'grid' }) {
    const title = typeof video.title === 'string' 
        ? video.title 
        : (video.title?.fa || video.title?.en || "بدون عنوان");
    
    const slug = video.slug?.fa || video.slug?.en || video.slug || "";
    const thumbnail = video.thumbnailUrl || "/assets/images/video-placeholder.jpg";
    const description = typeof video.shortDescription === 'string'
        ? video.shortDescription
        : (video.shortDescription?.fa || video.shortDescription?.en || "");
    
    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (viewMode === 'list') {
        return (
            <Link 
                href={`/theater/${slug}`}
                className="group flex gap-4 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700"
            >
                {/* Thumbnail */}
                <div className="relative w-64 h-40 flex-shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-700">
                    <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="256px"
                        loading="lazy"
                        quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl">
                            <BsPlayFill className="w-8 h-8 text-slate-900 ml-1" />
                        </div>
                    </div>

                    {/* Duration Badge */}
                    {video.duration && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-white text-xs font-semibold flex items-center gap-1">
                            <BsClock className="w-3 h-3" />
                            {formatDuration(video.duration)}
                        </div>
                    )}

                    {/* Featured Badge */}
                    {video.isFeatured && (
                        <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-600 text-white rounded-lg text-xs font-semibold shadow-lg">
                                <HiSparkles className="w-3 h-3" />
                                ویژه
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {title}
                        </h3>
                        
                        {description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        {video.views > 0 && (
                            <div className="flex items-center gap-1">
                                <BsEye className="w-4 h-4" />
                                <span>{video.views.toLocaleString('fa-IR')}</span>
                            </div>
                        )}
                        {video.likes > 0 && (
                            <div className="flex items-center gap-1">
                                <BsHeartFill className="w-4 h-4 text-red-500" />
                                <span>{video.likes.toLocaleString('fa-IR')}</span>
                            </div>
                        )}
                        {video.publishedAt && (
                            <span>{formatDate(video.publishedAt)}</span>
                        )}
                    </div>
                </div>
            </Link>
        );
    }

    // Grid view
    return (
        <Link 
            href={`/theater/${slug}`}
            className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700"
        >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-700">
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                    quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl">
                        <BsPlayFill className="w-8 h-8 text-slate-900 ml-1" />
                    </div>
                </div>

                {/* Duration Badge */}
                {video.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-white text-xs font-semibold flex items-center gap-1">
                        <BsClock className="w-3 h-3" />
                        {formatDuration(video.duration)}
                    </div>
                )}

                {/* Featured Badge */}
                {video.isFeatured && (
                    <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-600 text-white rounded-lg text-xs font-semibold shadow-lg">
                            <HiSparkles className="w-3 h-3" />
                            ویژه
                        </span>
                    </div>
                )}

                {/* Views Badge */}
                {video.views > 0 && (
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <BsEye className="w-3 h-3" />
                        <span>{video.views.toLocaleString('fa-IR')}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {title}
                </h3>
                
                {description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-700">
                    {video.likes > 0 && (
                        <div className="flex items-center gap-1">
                            <BsHeartFill className="w-3 h-3 text-red-500" />
                            <span>{video.likes.toLocaleString('fa-IR')}</span>
                        </div>
                    )}
                    {video.publishedAt && (
                        <span>{formatDate(video.publishedAt)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}

