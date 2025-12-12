"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { apiClient } from "@/services/api/client";
import { sanitizeHTML } from "@/lib/utils/sanitize";
import useAuthStore from "@/lib/store/authStore";
import ShareButton from "@/components/articles/ShareButton";
import { BsClock, BsCalendar, BsEye, BsHeart, BsBookmark, BsShare } from "react-icons/bs";
import BookmarkButton from "@/components/common/BookmarkButton";
import { HiOutlineFire, HiStar, HiSparkles } from "react-icons/hi";
import { FiArrowRight, FiArrowLeft, FiTag } from "react-icons/fi";
import { MdOutlineMenuBook, MdOutlineArticle } from "react-icons/md";
import toast from "react-hot-toast";

// Progress Bar Component - Client Only
function ProgressBarComponent({ isSticky }) {
    const [progress, setProgress] = useState(0);
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
        
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(Math.min(100, Math.max(0, scrollPercent)));
        };
        
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Only render on client to avoid hydration mismatch
    if (!mounted) {
        return null;
    }
    
    return (
        <div className={`fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50 transition-opacity duration-300 ${isSticky ? 'opacity-100' : 'opacity-0'}`}>
            <div 
                className="h-full bg-gradient-to-r from-teal-600 to-cyan-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
}

// Lazy load components
const GalleryLightbox = dynamic(() => import("@/components/common").then(mod => mod.GalleryLightbox), {
    ssr: false,
});

const RelatedArticlesSlider = dynamic(() => import("@/components/articles/RelatedArticlesSlider"), {
    ssr: true,
});

const RelatedVideos = dynamic(() => import("@/components/articles/RelatedVideos"), {
    ssr: true,
});

const RelatedPortfolios = dynamic(() => import("@/components/articles/RelatedPortfolios"), {
    ssr: true,
});

const ArticleSidebar = dynamic(() => import("@/components/articles/ArticleSidebar"), {
    ssr: true,
});

const TableOfContents = dynamic(() => import("@/components/articles/TableOfContents"), {
    ssr: true,
});

const RatingWidget = dynamic(() => import("@/components/articles/RatingWidget"), {
    ssr: true,
});

// Helper function to format file size
const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export default function ArticleDetailClient({ 
    article: initialArticle, 
    relatedArticles = [], 
    relatedVideos = [], 
    relatedPortfolios = [] 
}) {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const [article, setArticle] = useState({
        ...initialArticle,
        isLiked: false // Will be updated from API response
    });
    const [userRating, setUserRating] = useState(null);
    const contentRef = useRef(null);
    const [isSticky, setIsSticky] = useState(false);

    // Fetch user rating
    useEffect(() => {
        const fetchUserRating = async () => {
            try {
                const ratingResponse = await apiClient.get(`/articles/${article._id}/user-rating`);
                setUserRating(ratingResponse.data?.rating || null);
            } catch (error) {
                // Ignore errors
            }
        };

        fetchUserRating();
    }, [article._id]);

    // Track unique view (without authentication)
    useEffect(() => {
        const trackView = async () => {
            if (typeof window === 'undefined') return;
            
            const articleId = article._id;
            const storageKey = `article_view_${articleId}`;
            
            // Check if view already tracked in this session/browser (24 hours)
            const lastViewTime = localStorage.getItem(storageKey);
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            
            // Only track if not viewed in last 24 hours
            if (!lastViewTime || (now - parseInt(lastViewTime)) > oneDay) {
                try {
                    // Use apiClient for public endpoint (handles CORS properly)
                    // apiClient automatically detects public endpoints and doesn't require token
                    const response = await apiClient.post(`/articles/${articleId}/view`);
                    
                    if (response?.success) {
                        // Mark as viewed in localStorage (with timestamp)
                        localStorage.setItem(storageKey, now.toString());
                        
                        // Update article views count
                        if (response.data?.views !== undefined) {
                            setArticle(prev => ({
                                ...prev,
                                views: response.data.views
                            }));
                        }
                    }
                } catch (error) {
                    // Silently fail - don't interrupt user experience
                    // Don't log CORS or network errors as they're expected in some cases
                    // CORS errors happen when frontend and backend are on different origins
                    // This is expected in development when using production API
                    if (error.status !== 401 && 
                        error.status !== 0 && 
                        !error.message?.includes('Failed to fetch') &&
                        !error.message?.includes('CORS')) {
                        // Only log unexpected errors
                        if (process.env.NODE_ENV === 'development') {
                            console.warn('View tracking failed (non-critical):', error.message);
                        }
                    }
                }
            }
        };

        // Track view after a short delay to ensure page is fully loaded
        const timer = setTimeout(trackView, 1000);
        return () => clearTimeout(timer);
    }, [article._id]);

    // Sticky header effect
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const handleScroll = () => {
            setIsSticky(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleRating = async (rating) => {
        try {
            const response = await apiClient.post(`/articles/${article._id}/rate`, { rating });
            setArticle(prev => ({
                ...prev,
                ratings: response.data?.data || prev.ratings
            }));
            setUserRating(rating);
            toast.success("امتیاز شما ثبت شد");
        } catch (error) {
            toast.error("خطا در ثبت امتیاز");
        }
    };

    const title = article.title?.fa || article.title || "";
    const content = article.content?.fa || article.content || "";
    const featuredImage = article.featuredImage || "";
    const publishedAt = article.publishedAt || article.createdAt;
    const readTime = article.readTime || 5;
    const author = article.author?.name || "تیم هیکاوب";
    const authorAvatar = article.author?.avatar || "";
    const views = article.views || 0;
    const [likes, setLikes] = useState(article.likes || 0);
    const [isLiked, setIsLiked] = useState(article.isLiked || false);
    const averageRating = article.ratings?.average || 0;
    const totalRatings = article.ratings?.count || 0;


    // Format date
    const date = new Date(publishedAt);
    const formattedDate = new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);

    // Extract headings for table of contents
    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        if (typeof window === 'undefined' || !contentRef.current) return;

        const extractHeadings = () => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const headingsElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
            return Array.from(headingsElements).map((heading, index) => {
                const id = `heading-${index}`;
                if (contentRef.current) {
                    const actualHeading = contentRef.current.querySelector(`h${heading.tagName.charAt(1)}:nth-of-type(${index + 1})`);
                    if (actualHeading) {
                        actualHeading.id = id;
                    }
                }
                return {
                    id,
                    text: heading.textContent,
                    level: parseInt(heading.tagName.charAt(1))
                };
            });
        };

        setTimeout(() => {
            const extractedHeadings = extractHeadings();
            setHeadings(extractedHeadings);
        }, 100);
    }, [content]);

    return (
        <main className="w-full min-h-screen">
            {/* Sticky Progress Bar */}
            <ProgressBarComponent isSticky={isSticky} />

            {/* Article Content with Sidebar */}
            <div className="w-full py-8 md:py-12">
                <div className="w-full grid grid-cols-12 gap-6 md:gap-8">
                    {/* Main Content */}
                    <article className="w-full col-span-12 md:col-span-9">
                        {/* Featured Badge */}
                        {article.isFeatured && (
                            <div className="flex items-center gap-3 mb-6" data-aos="fade-up">
                                <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                                    <HiOutlineFire className="text-xl text-white" />
                                </div>
                                <span className="px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 rounded-xl text-sm font-bold border border-orange-200">
                                    مقاله ویژه
                                </span>
                            </div>
                        )}

                        {/* Title Section */}
                        <header className="w-full mb-10" data-aos="fade-up">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight mb-8">
                                {title}
                            </h1>

                            {/* Meta Information - Enhanced */}
                            <div className="grid grid-cols-12 gap-3.5 mb-8 bg-white dark:bg-slate-800 rounded-xl p-2">
                                <div className="w-full col-span-6 md:col-span-3 flex items-center justify-between bg-teal-100 dark:bg-teal-900/30 rounded-xl p-3.5 shadow">
                                    <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-xl">
                                        <BsCalendar className="w-5 md:w-7 h-5 md:h-7 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">تاریخ انتشار</div>
                                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{formattedDate}</div>
                                    </div>
                                </div>
                                <div className="w-full col-span-6 md:col-span-3 flex items-center justify-between bg-cyan-100 dark:bg-cyan-900/30 rounded-xl p-3.5 shadow">
                                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-xl">
                                        <BsClock className="w-5 md:w-7 h-5 md:h-7 text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">زمان مطالعه</div>
                                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{readTime} دقیقه</div>
                                    </div>
                                </div>
                                {views > 0 && (
                                    <div className="w-full col-span-6 md:col-span-3 flex items-center justify-between bg-purple-100 dark:bg-purple-900/30 rounded-xl p-3.5 shadow">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                                            <BsEye className="w-5 md:w-7 h-5 md:h-7 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">بازدید</div>
                                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{views.toLocaleString('fa-IR')}</div>
                                        </div>
                                    </div>
                                )}
                                {averageRating > 0 && (
                                    <div className="w-full col-span-6 md:col-span-3 flex items-center justify-between bg-yellow-100 dark:bg-yellow-900/30 rounded-xl p-3.5 shadow">
                                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl">
                                            <HiStar className="w-5 md:w-7 h-5 md:h-7 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">امتیاز</div>
                                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{averageRating.toFixed(1)} ({totalRatings})</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Featured Image */}
                            {featuredImage && (
                                <div className="w-full relative h-72 md:h-[600px] rounded-3xl overflow-hidden shadow-2xl mb-10 group" data-aos="fade-up">
                                    <Image
                                        src={featuredImage}
                                        alt={title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        priority
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-6 right-6 left-6">
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                                <MdOutlineArticle className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-sm opacity-90">مقاله تخصصی</div>
                                                <div className="text-xs opacity-75">هیکاوب</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Social Share & Actions - Enhanced & Responsive */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-xl shadow mb-8 bg-white dark:bg-slate-800" data-aos="fade-up">
                                <div className="flex-shrink-0">
                                    <RatingWidget
                                        articleId={article._id}
                                        averageRating={averageRating}
                                        totalRatings={totalRatings}
                                        userRating={userRating}
                                        onRate={handleRating}
                                    />
                                </div>
                                <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3 flex-wrap">
                                    <ShareButton 
                                        title={title}
                                        excerpt={article.excerpt?.fa || article.shortDescription?.fa || ""}
                                    />
                                    <BookmarkButton 
                                        articleId={article._id}
                                        variant="default"
                                    />
                                    <button 
                                        onClick={async () => {
                                            if (!isAuthenticated) {
                                                toast.error("لطفا ابتدا وارد شوید");
                                                router.push("/auth?redirect=" + encodeURIComponent(window.location.pathname));
                                                return;
                                            }
                                            
                                            try {
                                                const response = await apiClient.post(`/articles/${article._id}/like`);
                                                const newLikes = response.data?.data?.likes || likes;
                                                const newIsLiked = response.data?.data?.isLiked !== false; // Default to true if not specified
                                                
                                                setLikes(newLikes);
                                                setIsLiked(newIsLiked);
                                                
                                                // Also update article state
                                                setArticle(prev => ({ 
                                                    ...prev, 
                                                    likes: newLikes
                                                }));
                                                
                                                if (newIsLiked) {
                                                    toast.success("مقاله مورد علاقه شما قرار گرفت");
                                                } else {
                                                    toast.success("لایک شما برداشته شد");
                                                }
                                            } catch (error) {
                                                toast.error(error.response?.data?.message || "خطا در لایک کردن مقاله");
                                            }
                                        }}
                                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${
                                            isLiked 
                                                ? "bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 hover:from-red-200 hover:to-pink-200 dark:hover:from-red-900/40 dark:hover:to-pink-900/40 text-red-700 dark:text-red-300" 
                                                : "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 text-red-600 dark:text-red-400"
                                        }`}
                                    >
                                        <BsHeart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                                        <span className="font-semibold text-sm sm:text-base">{likes.toLocaleString('fa-IR')}</span>
                                    </button>
                                </div>
                            </div>
                        </header>

                        {/* Table of Contents - Enhanced */}
                        {headings.length > 0 && (
                            <div className="mb-10" data-aos="fade-up">
                                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
                                            <MdOutlineMenuBook className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">فهرست مطالب</h3>
                                    </div>
                                    <TableOfContents headings={headings} />
                                </div>
                            </div>
                        )}

                        {/* Article Content - Premium Typography with Dark Mode Support */}
                        <div
                            ref={contentRef}
                            className="prose prose-base md:prose-lg max-w-none 
                                /* Headings - Light & Dark Mode */
                                prose-headings:text-slate-900 dark:prose-headings:text-slate-100 
                                prose-headings:font-extrabold prose-headings:mb-5 prose-headings:mt-10
                                /* H1 - Responsive & Smaller */
                                prose-h1:text-3xl sm:prose-h1:text-4xl md:prose-h1:text-4xl lg:prose-h1:text-5xl 
                                prose-h1:mb-6 prose-h1:mt-12 prose-h1:leading-tight
                                dark:prose-h1:text-slate-50
                                /* H2 - Responsive & Smaller */
                                prose-h2:text-2xl sm:prose-h2:text-3xl md:prose-h2:text-3xl lg:prose-h2:text-4xl 
                                prose-h2:mb-5 prose-h2:mt-10 prose-h2:leading-tight
                                dark:prose-h2:text-slate-100
                                /* H3 - Responsive & Smaller */
                                prose-h3:text-xl sm:prose-h3:text-2xl md:prose-h3:text-2xl lg:prose-h3:text-3xl 
                                prose-h3:mb-4 prose-h3:mt-8 prose-h3:leading-tight
                                dark:prose-h3:text-slate-200
                                /* H4 - Responsive & Smaller */
                                prose-h4:text-lg sm:prose-h4:text-xl md:prose-h4:text-xl lg:prose-h4:text-2xl 
                                prose-h4:mb-3 prose-h4:mt-8
                                dark:prose-h4:text-slate-200
                                /* Paragraphs - Responsive, Smaller & Dark Mode */
                                prose-p:text-slate-700 dark:prose-p:text-slate-200 
                                prose-p:leading-relaxed 
                                prose-p:text-base sm:prose-p:text-base md:prose-p:text-lg lg:prose-p:text-lg 
                                prose-p:mb-6
                                /* Links - Enhanced for Dark Mode */
                                prose-a:text-teal-600 dark:prose-a:text-teal-400 
                                prose-a:no-underline hover:prose-a:underline 
                                prose-a:font-semibold prose-a:transition-all
                                /* Strong - Dark Mode Support */
                                prose-strong:text-slate-900 dark:prose-strong:text-slate-100 
                                prose-strong:font-extrabold
                                /* Lists - Responsive & Dark Mode */
                                prose-ul:text-slate-700 dark:prose-ul:text-slate-200 
                                prose-ol:text-slate-700 dark:prose-ol:text-slate-200 
                                prose-ul:mb-6 prose-ol:mb-6 
                                prose-ul:text-base sm:prose-ul:text-base md:prose-ul:text-lg 
                                prose-ol:text-base sm:prose-ol:text-base md:prose-ol:text-lg
                                prose-li:mb-2 prose-li:leading-relaxed prose-li:pl-2
                                /* Images - Dark Mode Border */
                                prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-10 prose-img:w-full 
                                prose-img:border-4 prose-img:border-slate-100 dark:prose-img:border-slate-700
                                /* Blockquotes - Dark Mode Support */
                                prose-blockquote:border-r-4 prose-blockquote:border-teal-500 
                                dark:prose-blockquote:border-teal-400
                                prose-blockquote:bg-gradient-to-r prose-blockquote:from-teal-50 prose-blockquote:to-cyan-50 
                                dark:prose-blockquote:from-teal-900/20 dark:prose-blockquote:to-cyan-900/20
                                prose-blockquote:py-5 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl 
                                prose-blockquote:my-8 
                                prose-blockquote:text-slate-800 dark:prose-blockquote:text-slate-200 
                                prose-blockquote:text-base md:prose-blockquote:text-lg 
                                prose-blockquote:font-medium prose-blockquote:shadow-lg
                                /* Code - Dark Mode Support */
                                prose-code:bg-slate-900 dark:prose-code:bg-slate-800 
                                prose-code:text-teal-300 dark:prose-code:text-teal-400 
                                prose-code:px-3 prose-code:py-1.5 prose-code:rounded-lg 
                                prose-code:text-sm prose-code:font-mono prose-code:shadow-inner
                                /* Pre - Dark Mode Support */
                                prose-pre:bg-slate-900 dark:prose-pre:bg-slate-800 
                                prose-pre:text-slate-100 dark:prose-pre:text-slate-200 
                                prose-pre:rounded-3xl prose-pre:shadow-2xl prose-pre:my-8 
                                prose-pre:border prose-pre:border-slate-700 dark:prose-pre:border-slate-600
                                /* HR - Dark Mode Support */
                                prose-hr:border-slate-300 dark:prose-hr:border-slate-600 
                                prose-hr:my-10 prose-hr:border-t-2"
                            dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }}
                            data-aos="fade-up"
                        />

                        {/* Download Box */}
                        {article.downloadBox && article.downloadBox.isActive && article.downloadBox.fileUrl && (
                            <div className="mt-14" data-aos="fade-up">
                                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-3xl p-8 shadow-xl border-2 border-teal-200 dark:border-teal-800">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-teal-500 rounded-2xl shadow-lg flex-shrink-0">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            {article.downloadBox.title?.fa && (
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                                                    {article.downloadBox.title.fa}
                                                </h3>
                                            )}
                                            {article.downloadBox.description?.fa && (
                                                <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                                                    {article.downloadBox.description.fa}
                                                </p>
                                            )}
                                            <a
                                                href={article.downloadBox.fileUrl}
                                                download={article.downloadBox.fileName || true}
                                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                <span>دانلود فایل</span>
                                                {article.downloadBox.fileSize && (
                                                    <span className="text-sm opacity-90">
                                                        ({formatFileSize(article.downloadBox.fileSize)})
                                                    </span>
                                                )}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Article Gallery if available */}
                        {article.gallery && article.gallery.length > 0 && (
                            <div className="mt-14" data-aos="fade-up">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 bg-purple-100 rounded-xl">
                                        <FiTag className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900">گالری تصاویر</h3>
                                </div>
                                <GalleryLightbox 
                                    images={article.gallery.map((item, index) => ({
                                        url: item.url || "",
                                        alt: item.alt?.fa || item.alt || `تصویر ${index + 1}`,
                                        title: item.caption?.fa || item.caption || "",
                                        caption: item.caption?.fa || item.caption || "",
                                    }))} 
                                />
                            </div>
                        )}

                    </article>

                    {/* Sidebar */}
                    <aside className="w-full col-span-12 md:col-span-3">
                        <div className="sticky top-24">
                            <ArticleSidebar
                                article={article}
                                author={article.author}
                                publishedAt={publishedAt}
                                readTime={readTime}
                                views={views}
                                categories={article.categories || []}
                                tags={article.tags || []}
                            />
                        </div>
                    </aside>
                </div>

                {/* Related Content Sections */}
                <div className="mt-20 space-y-20">
                    {/* Related Articles Slider */}
                    {relatedArticles.length > 0 && (
                        <div data-aos="fade-up">
                            <RelatedArticlesSlider articles={relatedArticles} />
                        </div>
                    )}

                    {/* Related Videos */}
                    {relatedVideos.length > 0 && (
                        <div data-aos="fade-up">
                            <RelatedVideos videos={relatedVideos} />
                        </div>
                    )}

                    {/* Related Portfolios */}
                    {relatedPortfolios.length > 0 && (
                        <div data-aos="fade-up">
                            <RelatedPortfolios portfolios={relatedPortfolios} />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
