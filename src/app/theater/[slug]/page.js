import { notFound } from "next/navigation";
import { serverGet } from "@/lib/api/server";
import VideoDetailClient from "@/components/videos/VideoDetailClient";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    
    try {
        const data = await serverGet(`/videos/slug/${slug}?lang=fa`);
        const video = data.data?.video;
        
        if (!video) {
            return {
                title: "ویدئو یافت نشد | هیکاوب",
            };
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hikaweb.ir";
        const thumbnail = video.thumbnailUrl 
            ? (video.thumbnailUrl.startsWith('http') 
                ? video.thumbnailUrl 
                : `${siteUrl}${video.thumbnailUrl.startsWith('/') ? '' : '/'}${video.thumbnailUrl}`)
            : `${siteUrl}/assets/logo/large-logo-text.png`;

        const title = video.title?.fa || video.title || "";
        const description = video.seo?.metaDescription?.fa || video.shortDescription?.fa || video.description?.fa || "";

        return {
            title: video.seo?.metaTitle?.fa || `${title} | تماشاخانه هیکاوب`,
            description,
            keywords: video.seo?.metaKeywords?.fa?.join(", ") || "",
            openGraph: {
                title,
                description,
                url: `${siteUrl}/theater/${slug}`,
                siteName: "هیکاوب",
                images: [
                    {
                        url: thumbnail,
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
                type: "video.other",
                publishedTime: video.publishedAt,
                modifiedTime: video.updatedAt || video.publishedAt,
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [thumbnail],
            },
        };
    } catch (error) {
        return {
            title: "ویدئو | تماشاخانه هیکاوب",
        };
    }
}

export default async function VideoDetailPage({ params }) {
    const { slug } = await params;

    let video, relatedContent = {};
    
    try {
        // Get video first to get its ID
        const videoData = await serverGet(`/videos/slug/${slug}?lang=fa`, { revalidate: 60 });
        video = videoData.data?.video;
        
        if (!video) {
            notFound();
        }

        // Then get related content using video ID
        let relatedContent = {};
        try {
            const relatedRes = await serverGet(`/videos/${video._id}/related?limit=4`, { revalidate: 300 });
            relatedContent = relatedRes.data || {};
        } catch (error) {
            console.error("Error fetching related content:", error);
        }

    } catch (error) {
        console.error("Error fetching video:", error);
        notFound();
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hikaweb.ir";
    const thumbnail = video.thumbnailUrl 
        ? (video.thumbnailUrl.startsWith('http') 
            ? video.thumbnailUrl 
            : `${siteUrl}${video.thumbnailUrl.startsWith('/') ? '' : '/'}${video.thumbnailUrl}`)
        : `${siteUrl}/assets/logo/large-logo-text.png`;

    // Structured data for SEO
    const videoSchema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: video.title?.fa || video.title || "",
        description: video.description?.fa || video.shortDescription?.fa || "",
        thumbnailUrl: thumbnail,
        uploadDate: video.publishedAt,
        duration: `PT${video.duration || 0}S`,
        contentUrl: video.videoUrl,
        embedUrl: video.videoUrl,
        publisher: {
            "@type": "Organization",
            name: "هیکاوب",
            logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/assets/logo/large-logo-text.png`
            }
        },
        author: {
            "@type": "Person",
            name: video.author?.name || "تیم هیکاوب"
        },
        interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: { "@type": "WatchAction" },
            userInteractionCount: video.views || 0
        },
        aggregateRating: video.ratings?.count > 0 ? {
            "@type": "AggregateRating",
            ratingValue: video.ratings.average || 0,
            ratingCount: video.ratings.count || 0,
            bestRating: 5,
            worstRating: 1
        } : undefined
    };

    // Breadcrumb schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "خانه",
                item: siteUrl
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "تماشاخانه",
                item: `${siteUrl}/theater`
            },
            {
                "@type": "ListItem",
                position: 3,
                name: video.title?.fa || video.title || "",
                item: `${siteUrl}/theater/${slug}`
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <VideoDetailClient 
                video={video}
                relatedContent={relatedContent}
            />
        </>
    );
}

