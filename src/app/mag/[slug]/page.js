import { notFound } from "next/navigation";
import { serverGet } from "@/lib/api/server";
import { generateBreadcrumbSchema } from "@/lib/seo";
import ArticleDetailClient from "@/components/articles/ArticleDetailClient";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    
    try {
        const data = await serverGet(`/articles/slug/${slug}?lang=fa`);
        const article = data.data?.article;
        
        if (!article) {
            return {
                title: "مقاله یافت نشد | هیکاوب",
            };
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hikaweb.ir";
        const featuredImage = article.featuredImage 
            ? (article.featuredImage.startsWith('http') 
                ? article.featuredImage 
                : `${siteUrl}${article.featuredImage.startsWith('/') ? '' : '/'}${article.featuredImage}`)
            : `${siteUrl}/assets/logo/large-logo-text.png`;

        return {
            title: article.seo?.metaTitle?.fa || `${article.title?.fa || article.title} | هیکاوب`,
            description: article.seo?.metaDescription?.fa || article.excerpt?.fa || article.shortDescription?.fa,
            keywords: article.seo?.metaKeywords?.fa?.join(", ") || "",
            openGraph: {
                title: article.title?.fa || article.title,
                description: article.excerpt?.fa || article.shortDescription?.fa,
                url: `${siteUrl}/mag/${slug}`,
                siteName: "هیکاوب",
                images: [
                    {
                        url: featuredImage,
                        width: 1200,
                        height: 630,
                        alt: article.title?.fa || article.title || "مقاله هیکاوب",
                    },
                ],
                type: "article",
                publishedTime: article.publishedAt,
                modifiedTime: article.updatedAt || article.publishedAt,
                authors: [article.author?.name || "تیم هیکاوب"],
            },
            twitter: {
                card: "summary_large_image",
                title: article.title?.fa || article.title,
                description: article.excerpt?.fa || article.shortDescription?.fa,
                images: [featuredImage],
            },
        };
    } catch (error) {
        return {
            title: "مقاله | هیکاوب",
        };
    }
}

export default async function ArticleDetailPage({ params }) {
    const { slug } = await params;

    let article, relatedArticles = [], relatedVideos = [], relatedPortfolios = [];
    
    try {
        const data = await serverGet(`/articles/slug/${slug}?lang=fa`);
        article = data.data?.article;
        relatedArticles = data.data?.relatedArticles || [];
        relatedVideos = data.data?.relatedVideos || [];
        relatedPortfolios = data.data?.relatedPortfolios || [];

        if (!article) {
            notFound();
        }
    } catch (error) {
        console.error("Error fetching article:", error);
        notFound();
    }

    const title = article.title?.fa || article.title || "";

    // Structured data for SEO
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: article.excerpt?.fa || article.shortDescription?.fa || "",
        image: article.featuredImage,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        author: {
            "@type": "Person",
            name: article.author?.name || "تیم هیکاوب",
        },
        publisher: {
            "@type": "Organization",
            name: "هیکاوب",
            logo: {
                "@type": "ImageObject",
                url: "https://hikaweb.ir/assets/logo/large-logo-text.png",
            },
        },
    };

    // Generate breadcrumb schema
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "صفحه اصلی", url: "https://hikaweb.ir" },
        { name: "هیکا مگ", url: "https://hikaweb.ir/mag" },
        { name: title, url: `https://hikaweb.ir/mag/${slug}` }
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <ArticleDetailClient
                article={article}
                relatedArticles={relatedArticles}
                relatedVideos={relatedVideos}
                relatedPortfolios={relatedPortfolios}
            />
        </>
    );
}
