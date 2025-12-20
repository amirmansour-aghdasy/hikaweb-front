import { serverGet } from "@/lib/api/server";
import VideoListClient from "@/components/videos/VideoListClient";
import { defaultMetadata } from "@/lib/seo";

export const metadata = {
  title: "تماشاخانه هیکاوب | ویدئوهای آموزشی و تخصصی",
  description: "تماشای ویدئوهای آموزشی و تخصصی هیکاوب. آموزش‌های کوتاه، استریم حرفه‌ای و محتوای ویدئویی با کیفیت بالا.",
  keywords: "ویدئو, آموزش, تماشاخانه, ویدئو آموزشی, استریم, هیکاوب",
  openGraph: {
    title: "تماشاخانه هیکاوب | ویدئوهای آموزشی و تخصصی",
    description: "تماشای ویدئوهای آموزشی و تخصصی هیکاوب",
    url: `${defaultMetadata.siteUrl}/theater`,
    type: "website",
    images: [
      {
        url: `${defaultMetadata.siteUrl}/assets/logo/large-logo-text.png`,
        width: 1200,
        height: 630,
        alt: "تماشاخانه هیکاوب",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "تماشاخانه هیکاوب",
    description: "ویدئوهای آموزشی و تخصصی",
  },
  alternates: {
    canonical: `${defaultMetadata.siteUrl}/theater`,
  },
};

export default async function TheaterPage({ searchParams }) {
  // In Next.js 15, searchParams must be awaited
  const params = await searchParams;
  const page = parseInt(params?.page) || 1;
  const search = params?.search || "";
  const category = params?.category || "";
  const sortBy = params?.sortBy || "publishedAt";
  const sortOrder = params?.sortOrder || "desc";

  const videosData = await serverGet("/videos", {
    page,
    limit: 12,
    search,
    category,
    isPublished: true,
    sortBy,
    sortOrder,
    language: "fa"
  });

  const videos = videosData?.data || [];
  const pagination = videosData?.pagination || {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  };

  // CollectionPage schema for SEO
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "تماشاخانه هیکاوب",
    description: "ویدئوهای آموزشی و تخصصی هیکاوب",
    url: `${defaultMetadata.siteUrl}/theater`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: pagination.total,
      itemListElement: videos.slice(0, 10).map((video, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "VideoObject",
          name: video.title?.fa || video.title || "",
          description: video.shortDescription?.fa || video.description?.fa || "",
          thumbnailUrl: video.thumbnailUrl,
          uploadDate: video.publishedAt
        }
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <VideoListClient 
          initialVideos={videos}
          initialPagination={pagination}
          initialSearch={search}
          initialCategory={category}
          initialSortBy={sortBy}
          initialSortOrder={sortOrder}
        />
      </div>
    </>
  );
}

