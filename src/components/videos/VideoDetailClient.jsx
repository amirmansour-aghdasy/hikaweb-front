"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { apiClient } from "@/services/api/client";
import { getBrowserFingerprint } from "@/lib/utils/browserFingerprint";
import useAuthStore from "@/lib/store/authStore";
import VideoPlayer from "./VideoPlayer";
import toast from "react-hot-toast";
import { 
    BsEye, BsHeart, BsHeartFill, BsBookmark, BsBookmarkFill, BsClock, 
    BsCalendar, BsShare, BsPlayFill 
} from "react-icons/bs";
import { HiSparkles, HiOutlineFire } from "react-icons/hi";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { RiShareLine } from "react-icons/ri";

// Lazy load components
const CommentsSection = dynamic(() => import("@/components/comments/CommentsSection"), {
    ssr: true,
});

const RelatedVideos = dynamic(() => import("@/components/videos/RelatedVideos"), {
    ssr: true,
});

const RelatedArticles = dynamic(() => import("@/components/articles/RelatedArticlesSlider"), {
    ssr: true,
});

const RelatedPortfolios = dynamic(() => import("@/components/articles/RelatedPortfolios"), {
    ssr: true,
});

// RelatedServices component removed - using ServicesListingClient instead
const ServicesListingClient = dynamic(() => import("@/components/services/ServicesListingClient"), {
    ssr: true,
});

export default function VideoDetailClient({ 
    video: initialVideo, 
    relatedContent = {} 
}) {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const [video, setVideo] = useState(initialVideo);
    const [likes, setLikes] = useState(initialVideo?.likes || 0);
    const [views, setViews] = useState(initialVideo?.views || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [watchTime, setWatchTime] = useState(0);
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const title = video?.title?.fa || video?.title || "";
    const description = video?.description?.fa || video?.description || "";
    const shortDescription = video?.shortDescription?.fa || video?.shortDescription || "";
    const videoUrl = video?.videoUrl || "";
    const thumbnailUrl = video?.thumbnailUrl || "";
    const duration = video?.duration || 0;
    const author = video?.author?.name || "تیم هیکاوب";
    const authorAvatar = video?.author?.avatar || "";
    const publishedAt = video?.publishedAt || video?.createdAt;
    const categories = video?.categories || [];

    // Format date
    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Check like and bookmark status
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const browserFingerprint = getBrowserFingerprint();
                
                // Check like status
                const likeResponse = await apiClient.get(`/videos/${video._id}/like/check`, {
                    headers: {
                        'X-Browser-Fingerprint': browserFingerprint
                    }
                });
                setIsLiked(likeResponse.data?.data?.liked || false);

                // Check bookmark status (requires auth)
                if (isAuthenticated) {
                    const bookmarkResponse = await apiClient.get(`/videos/${video._id}/bookmark/check`);
                    setIsBookmarked(bookmarkResponse.data?.data?.bookmarked || false);
                }
            } catch (error) {
                // Ignore errors
            }
        };

        checkStatus();
    }, [video._id, isAuthenticated]);

    // Track view on mount
    useEffect(() => {
        const trackView = async () => {
            try {
                const browserFingerprint = getBrowserFingerprint();
                const response = await apiClient.post(`/videos/${video._id}/view`, {
                    browserFingerprint,
                    watchTime: 0,
                    completionPercentage: 0
                }, {
                    headers: {
                        'X-Browser-Fingerprint': browserFingerprint
                    }
                });
                
                if (response.data?.data?.views) {
                    setViews(response.data.data.views);
                }
            } catch (error) {
                // Ignore errors
            }
        };

        trackView();
    }, [video._id]);

    // Track watch time periodically
    useEffect(() => {
        if (!isPlaying || !duration) return;

        const interval = setInterval(async () => {
            if (watchTime > 0 && duration > 0) {
                const percentage = Math.min(100, Math.round((watchTime / duration) * 100));
                setCompletionPercentage(percentage);

                // Update view tracking every 10 seconds
                if (Math.floor(watchTime) % 10 === 0) {
                    try {
                        const browserFingerprint = getBrowserFingerprint();
                        await apiClient.post(`/videos/${video._id}/view`, {
                            browserFingerprint,
                            watchTime: Math.floor(watchTime),
                            completionPercentage: percentage
                        }, {
                            headers: {
                                'X-Browser-Fingerprint': browserFingerprint
                            }
                        });
                    } catch (error) {
                        // Ignore errors
                    }
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, watchTime, duration, video._id]);

    const handleLike = async () => {
        try {
            const browserFingerprint = getBrowserFingerprint();
            const response = await apiClient.post(`/videos/${video._id}/like`, {
                browserFingerprint
            }, {
                headers: {
                    'X-Browser-Fingerprint': browserFingerprint
                }
            });

            const { liked, likes: newLikes } = response.data?.data || {};
            setIsLiked(liked);
            setLikes(newLikes || likes);
            setVideo(prev => ({ ...prev, likes: newLikes || likes }));

            if (liked) {
                toast.success("ویدئو به لیست علاقه‌مندی‌ها اضافه شد");
            } else {
                toast.info("ویدئو از لیست علاقه‌مندی‌ها حذف شد");
            }
        } catch (error) {
            toast.error("خطا در ثبت لایک");
        }
    };

    const handleBookmark = async () => {
        if (!isAuthenticated) {
            toast.error("برای بوکمارک کردن باید وارد حساب کاربری خود شوید");
            router.push("/auth?redirect=/theater/" + (video.slug?.fa || video.slug));
            return;
        }

        try {
            const response = await apiClient.post(`/videos/${video._id}/bookmark`);
            const { bookmarked } = response.data?.data || {};
            setIsBookmarked(bookmarked);

            if (bookmarked) {
                toast.success("ویدئو بوکمارک شد");
            } else {
                toast.info("بوکمارک حذف شد");
            }
        } catch (error) {
            toast.error("خطا در بوکمارک کردن");
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: shortDescription || description,
                    url: window.location.href
                });
            } catch (error) {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            toast.success("لینک کپی شد");
        }
    };

    const handleProgress = (state) => {
        setWatchTime(state.playedSeconds);
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    return (
        <main className="w-full min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 mb-6 transition-colors"
                >
                    <FiArrowRight className="w-5 h-5" />
                    <span>بازگشت</span>
                </button>

                <div className="grid grid-cols-12 gap-6 md:gap-8">
                    {/* Main Content */}
                    <article className="w-full col-span-12 lg:col-span-8">
                        {/* Featured Badge */}
                        {video?.isFeatured && (
                            <div className="flex items-center gap-3 mb-6" data-aos="fade-up">
                                <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                                    <HiOutlineFire className="text-xl text-white" />
                                </div>
                                <span className="px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 rounded-xl text-sm font-bold border border-orange-200">
                                    ویدئو ویژه
                                </span>
                            </div>
                        )}

                        {/* Title */}
                        <header className="w-full mb-6" data-aos="fade-up">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight mb-4">
                                {title}
                            </h1>

                            {/* Meta Information */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                                <div className="flex items-center gap-2">
                                    <BsCalendar className="w-4 h-4" />
                                    <span>{formatDate(publishedAt)}</span>
                                </div>
                                {duration > 0 && (
                                    <div className="flex items-center gap-2">
                                        <BsClock className="w-4 h-4" />
                                        <span>{formatDuration(duration)}</span>
                                    </div>
                                )}
                                {views > 0 && (
                                    <div className="flex items-center gap-2">
                                        <BsEye className="w-4 h-4" />
                                        <span>{views.toLocaleString('fa-IR')} بازدید</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 mt-4">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                        isLiked
                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {isLiked ? (
                                        <BsHeartFill className="w-5 h-5" />
                                    ) : (
                                        <BsHeart className="w-5 h-5" />
                                    )}
                                    <span>{likes.toLocaleString('fa-IR')}</span>
                                </button>

                                <button
                                    onClick={handleBookmark}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                        isBookmarked
                                            ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {isBookmarked ? (
                                        <BsBookmarkFill className="w-5 h-5" />
                                    ) : (
                                        <BsBookmark className="w-5 h-5" />
                                    )}
                                    <span>بوکمارک</span>
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <RiShareLine className="w-5 h-5" />
                                    <span>اشتراک</span>
                                </button>
                            </div>
                        </header>

                        {/* Video Player */}
                        <div className="w-full mb-8" data-aos="fade-up">
                            <VideoPlayer
                                ref={playerRef}
                                videoUrl={videoUrl}
                                thumbnailUrl={thumbnailUrl}
                                title={title}
                                onProgress={handleProgress}
                                onPlay={handlePlay}
                                onPause={handlePause}
                                className="w-full"
                            />
                        </div>

                        {/* Description */}
                        {description && (
                            <div className="w-full mb-8" data-aos="fade-up">
                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    <div 
                                        className="text-slate-700 dark:text-slate-300 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Info Box */}
                        {video?.infoBox?.isActive && video?.infoBox?.content && (
                            <div className="w-full mb-8 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl" data-aos="fade-up">
                                {video.infoBox.title?.fa && (
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                                        {video.infoBox.title.fa}
                                    </h3>
                                )}
                                <div 
                                    className="text-slate-700 dark:text-slate-300"
                                    dangerouslySetInnerHTML={{ __html: video.infoBox.content.fa || video.infoBox.content }}
                                />
                            </div>
                        )}

                        {/* Categories */}
                        {categories.length > 0 && (
                            <div className="w-full mb-8" data-aos="fade-up">
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => {
                                        const categoryName = typeof category === 'object' 
                                            ? (category.name?.fa || category.name?.en || category.name)
                                            : category;
                                        return (
                                            <Link
                                                key={category._id || category}
                                                href={`/theater?category=${category._id || category}`}
                                                className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-sm font-medium hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
                                            >
                                                {categoryName}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Comments Section */}
                        <div className="w-full mb-8" data-aos="fade-up">
                            <CommentsSection
                                resourceType="Video"
                                resourceId={video._id}
                                resourceTitle={title}
                            />
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="w-full col-span-12 lg:col-span-4">
                        {/* Author Info */}
                        {author && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md mb-6" data-aos="fade-up">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                                    درباره سازنده
                                </h3>
                                <div className="flex items-center gap-4">
                                    {authorAvatar && (
                                        <Image
                                            src={authorAvatar}
                                            alt={author}
                                            width={60}
                                            height={60}
                                            className="rounded-full"
                                        />
                                    )}
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                                            {author}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Video Stats */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md mb-6" data-aos="fade-up">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                                آمار ویدئو
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 dark:text-slate-400">بازدید</span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                        {views.toLocaleString('fa-IR')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 dark:text-slate-400">لایک</span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                        {likes.toLocaleString('fa-IR')}
                                    </span>
                                </div>
                                {video?.bookmarks > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400">بوکمارک</span>
                                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                                            {video.bookmarks.toLocaleString('fa-IR')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Related Content */}
                <div className="w-full mt-12">
                    {/* Related Videos */}
                    {relatedContent?.videos && relatedContent.videos.length > 0 && (
                        <div className="mb-12" data-aos="fade-up">
                            <RelatedVideos videos={relatedContent.videos} />
                        </div>
                    )}

                    {/* Related Articles */}
                    {relatedContent?.articles && relatedContent.articles.length > 0 && (
                        <div className="mb-12" data-aos="fade-up">
                            <RelatedArticles articles={relatedContent.articles} />
                        </div>
                    )}

                    {/* Related Portfolios */}
                    {relatedContent?.portfolios && relatedContent.portfolios.length > 0 && (
                        <div className="mb-12" data-aos="fade-up">
                            <RelatedPortfolios portfolios={relatedContent.portfolios} />
                        </div>
                    )}

                    {/* Related Services */}
                    {relatedContent?.services && relatedContent.services.length > 0 && (
                        <div className="mb-12" data-aos="fade-up">
                            <ServicesListingClient services={relatedContent.services} />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

