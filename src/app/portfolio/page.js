import { serverGet } from "@/lib/api/server";
import { defaultMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import dynamic from "next/dynamic";

const PortfolioPageClient = dynamic(
    () => import("@/components/portfolio/PortfolioPageClient"),
    {
        loading: () => (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        ),
        ssr: true,
    }
);

export const metadata = {
    title: "نمونه کارهای هیکاوب | پروژه‌های انجام شده برای برندهای معتبر",
    description: "نمونه کارهای حرفه‌ای هیکاوب: پروژه‌های موفق طراحی سایت، طراحی لوگو، سئو، مدیریت شبکه‌های اجتماعی و تولید محتوا برای برندهای معتبر. مشاهده پروژه‌های انجام شده برای هر برند.",
    keywords: "نمونه کار هیکاوب, پروژه های انجام شده, طراحی سایت, طراحی لوگو, سئو, مدیریت شبکه های اجتماعی, تولید محتوا, برندهای معتبر, پورتفولیو",
    openGraph: {
        title: "نمونه کارهای هیکاوب | پروژه‌های انجام شده برای برندهای معتبر",
        description: "نمونه کارهای حرفه‌ای هیکاوب برای برندهای معتبر. مشاهده پروژه‌های موفق طراحی سایت، طراحی لوگو، سئو و دیجیتال مارکتینگ.",
        type: "website",
        images: [
            {
                url: `${defaultMetadata.siteUrl}/assets/logo/large-logo-text.png`,
                width: 1200,
                height: 630,
                alt: "نمونه کارهای هیکاوب",
            },
        ],
    },
    alternates: {
        canonical: `${defaultMetadata.siteUrl}/portfolio`,
    },
};

/**
 * Generate CollectionPage structured data for portfolio
 */
function generatePortfolioCollectionSchema(brands) {
    const totalProjects = brands.reduce((sum, brand) => sum + brand.projects.length, 0);
    
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "نمونه کارهای هیکاوب",
        description: "نمونه کارهای حرفه‌ای هیکاوب برای برندهای معتبر",
        url: `${defaultMetadata.siteUrl}/portfolio`,
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: totalProjects,
            itemListElement: brands.flatMap((brand, brandIndex) =>
                brand.projects.map((project, projectIndex) => {
                    const projectTitle = typeof project.title === 'string' 
                        ? project.title 
                        : (project.title?.fa || project.title?.en || "");
                    const projectSlug = project.slug?.fa || project.slug?.en || project.slug || "";
                    
                    return {
                        "@type": "ListItem",
                        position: brandIndex * 100 + projectIndex + 1,
                        item: {
                            "@type": "CreativeWork",
                            name: projectTitle,
                            url: `${defaultMetadata.siteUrl}/portfolio/${projectSlug}`,
                            creator: {
                                "@type": "Organization",
                                name: "هیکاوب",
                                url: defaultMetadata.siteUrl,
                            },
                            client: {
                                "@type": "Organization",
                                name: brand.name,
                            },
                        },
                    };
                })
            ),
        },
    };
}

/**
 * Generate Breadcrumb schema
 */
const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "صفحه اصلی", url: defaultMetadata.siteUrl },
    { name: "نمونه کارها", url: `${defaultMetadata.siteUrl}/portfolio` },
]);

export default async function PortfolioPage() {
    // Fetch portfolios and services in parallel for better performance
    const [portfoliosRes, servicesRes] = await Promise.allSettled([
        serverGet('/portfolio?status=active&limit=1000', { revalidate: 300 }), // 5 minutes cache
        serverGet('/services?status=active&limit=100&lang=fa', { revalidate: 600 }), // 10 minutes cache
    ]);

    // Process portfolios
    let portfolios = [];
    if (portfoliosRes.status === 'fulfilled') {
        try {
            portfolios = portfoliosRes.value.data || [];
        } catch (error) {
            console.error("Error processing portfolios:", error);
        }
    }

    // Process services
    let services = [];
    if (servicesRes.status === 'fulfilled') {
        try {
            services = servicesRes.value.data || [];
        } catch (error) {
            console.error("Error processing services:", error);
        }
    }

    // Group portfolios by client name
    const brandsMap = new Map();
    
    portfolios.forEach((portfolio) => {
        const clientName = portfolio.client?.name || "بدون نام";
        const clientLogo = portfolio.client?.logo || null;
        const clientWebsite = portfolio.client?.website || null;
        const clientIndustry = portfolio.client?.industry?.fa || portfolio.client?.industry?.en || null;
        const clientSize = portfolio.client?.size || null;
        
        if (!brandsMap.has(clientName)) {
            brandsMap.set(clientName, {
                name: clientName,
                logo: clientLogo,
                website: clientWebsite,
                industry: clientIndustry,
                size: clientSize,
                projects: [],
            });
        }
        
        const brand = brandsMap.get(clientName);
        brand.projects.push({
            _id: portfolio._id,
            title: portfolio.title,
            slug: portfolio.slug,
            description: portfolio.description,
            shortDescription: portfolio.shortDescription,
            featuredImage: portfolio.featuredImage,
            services: portfolio.services || [],
            project: portfolio.project,
            completedAt: portfolio.project?.completedAt || portfolio.createdAt,
            isFeatured: portfolio.isFeatured || false,
            views: portfolio.views || 0,
        });
    });

    // Convert map to array and sort by number of projects (descending)
    const brands = Array.from(brandsMap.values())
        .map(brand => ({
            ...brand,
            projects: brand.projects.sort((a, b) => {
                // Featured projects first
                if (a.isFeatured && !b.isFeatured) return -1;
                if (!a.isFeatured && b.isFeatured) return 1;
                // Then by completion date (newest first)
                const dateA = new Date(a.completedAt);
                const dateB = new Date(b.completedAt);
                return dateB - dateA;
            }),
        }))
        .sort((a, b) => b.projects.length - a.projects.length);

    // Generate structured data
    const collectionSchema = generatePortfolioCollectionSchema(brands);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <PortfolioPageClient brands={brands} services={services} />
        </>
    );
}

