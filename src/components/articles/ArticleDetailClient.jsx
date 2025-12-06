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
    loading: () => <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse rounded-3xl" />,
    ssr: false,
});

const RelatedArticlesSlider = dynamic(() => import("@/components/articles/RelatedArticlesSlider"), {
    loading: () => <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse rounded-3xl" />,
    ssr: true,
});

const RelatedVideos = dynamic(() => import("@/components/articles/RelatedVideos"), {
    loading: () => <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse rounded-3xl" />,
    ssr: true,
});

const RelatedPortfolios = dynamic(() => import("@/components/articles/RelatedPortfolios"), {
    loading: () => <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse rounded-3xl" />,
    ssr: true,
});

const ArticleSidebar = dynamic(() => import("@/components/articles/ArticleSidebar"), {
    loading: () => <div className="w-80 h-96 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse rounded-3xl" />,
    ssr: true,
});

const TableOfContents = dynamic(() => import("@/components/articles/TableOfContents"), {
    loading: () => <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse rounded-3xl" />,
    ssr: true,
});

const RatingWidget = dynamic(() => import("@/components/articles/RatingWidget"), {
    loading: () => <div className="w-full h-20 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse rounded-3xl" />,
    ssr: true,
});

export default function ArticleDetailClient({ 
    article: initialArticle, 
    relatedArticles = [], 
    relatedVideos = [], 
    relatedPortfolios = [] 
}) {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const [article, setArticle] = useState(initialArticle);
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
    const likes = article.likes || 0;
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

                            {/* Social Share & Actions - Enhanced */}
                            <div className="flex items-center justify-between p-3.5 rounded-xl shadow mb-8 bg-white dark:bg-slate-800" data-aos="fade-up">
                                <RatingWidget
                                    articleId={article._id}
                                    averageRating={averageRating}
                                    totalRatings={totalRatings}
                                    userRating={userRating}
                                    onRate={handleRating}
                                />
                                <div className="flex items-center gap-3">
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
                                                setArticle(prev => ({ 
                                                    ...prev, 
                                                    likes: response.data?.data?.likes || (prev.likes || 0) + 1 
                                                }));
                                                toast.success("مقاله مورد علاقه شما قرار گرفت");
                                            } catch (error) {
                                                toast.error("خطا در لایک کردن مقاله");
                                            }
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-600 transition-all duration-300 shadow-sm hover:shadow-md"
                                    >
                                        <BsHeart className="w-5 h-5" />
                                        <span className="font-semibold">{likes.toLocaleString('fa-IR')}</span>
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

                        {/* Article Content - Premium Typography */}
                        <div
                            ref={contentRef}
                            className="prose prose-lg prose-slate max-w-none 
                                prose-headings:text-slate-900 prose-headings:font-extrabold prose-headings:mb-6 prose-headings:mt-12
                                prose-h1:text-5xl prose-h1:mb-8 prose-h1:mt-16 prose-h1:leading-tight
                                prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-14 prose-h2:leading-tight
                                prose-h3:text-3xl prose-h3:mb-5 prose-h3:mt-12 prose-h3:leading-tight
                                prose-h4:text-2xl prose-h4:mb-4 prose-h4:mt-10
                                prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-lg md:prose-p:text-xl prose-p:mb-8
                                prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold prose-a:transition-all
                                prose-strong:text-slate-900 prose-strong:font-extrabold
                                prose-ul:text-slate-700 prose-ol:text-slate-700 prose-ul:mb-8 prose-ol:mb-8 prose-ul:text-lg prose-ol:text-lg
                                prose-li:mb-3 prose-li:leading-relaxed prose-li:pl-2
                                prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-12 prose-img:w-full prose-img:border-4 prose-img:border-slate-100
                                prose-blockquote:border-r-4 prose-blockquote:border-teal-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-teal-50 prose-blockquote:to-cyan-50 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:my-10 prose-blockquote:text-slate-800 prose-blockquote:text-lg prose-blockquote:font-medium prose-blockquote:shadow-lg
                                prose-code:bg-slate-900 prose-code:text-teal-300 prose-code:px-3 prose-code:py-1.5 prose-code:rounded-lg prose-code:text-sm prose-code:font-mono prose-code:shadow-inner
                                prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-3xl prose-pre:shadow-2xl prose-pre:my-10 prose-pre:border prose-pre:border-slate-700
                                prose-hr:border-slate-300 prose-hr:my-12 prose-hr:border-t-2"
                            dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }}
                            data-aos="fade-up"
                        />

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
