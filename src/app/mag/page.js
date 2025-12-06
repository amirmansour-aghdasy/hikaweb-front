import { notFound } from "next/navigation";
import { serverGet } from "@/lib/api/server";
import { generateBreadcrumbSchema } from "@/lib/seo";
import ArticlesListClient from "@/components/articles/ArticlesListClient";

export const metadata = {
    title: "هیکا مگ | مرجع تخصصی مقالات و اخبار",
    description: "مرجع تخصصی مقالات و اخبار دنیای تکنولوژی، طراحی و توسعه وب",
    keywords: "مقالات, اخبار, تکنولوژی, طراحی وب, توسعه وب, هیکاوب",
    openGraph: {
        title: "هیکا مگ | مرجع تخصصی مقالات",
        description: "مرجع تخصصی مقالات و اخبار دنیای تکنولوژی",
        type: "website",
    },
};

export default async function MagHomePage({ searchParams }) {
    // In Next.js 15, searchParams must be awaited
    const params = await searchParams;
    const page = parseInt(params?.page) || 1;
    const limit = 9; // تعداد پیش‌فرض 9
    const search = params?.search || '';
    const category = params?.category || '';
    
    // Fetch articles
    let articlesData = { data: [], pagination: { page: 1, limit, total: 0, totalPages: 1 } };
    try {
        const queryParams = new URLSearchParams({
            lang: "fa",
            isPublished: "true",
            page: page.toString(),
            limit: limit.toString(),
        });
        
        if (search && search !== 'undefined' && search.trim() !== '') {
            queryParams.append('search', search);
        }
        
        if (category && category !== 'undefined' && category !== 'all' && category.trim() !== '') {
            const objectIdPattern = /^[0-9a-fA-F]{24}$/;
            if (objectIdPattern.test(category)) {
                queryParams.append('category', category);
            }
        }
        
        const response = await serverGet(`/articles?${queryParams.toString()}`);
        
        articlesData = {
            data: response.data || [],
            pagination: response.pagination || { page: 1, limit, total: 0, totalPages: 1 }
        };
    } catch (error) {
        console.error("Error fetching articles:", error);
    }

    // Fetch categories
    let categories = [];
    try {
        const categoriesResponse = await serverGet('/categories?type=article&status=active&limit=50');
        categories = categoriesResponse.data || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
    }

    // Fetch featured articles
    let featuredArticles = [];
    try {
        const featuredResponse = await serverGet('/articles/featured?limit=3');
        featuredArticles = featuredResponse.data?.articles || [];
    } catch (error) {
        console.error('Error fetching featured articles:', error);
    }

    // Fetch popular articles for sidebar
    let popularArticles = [];
    try {
        const popularResponse = await serverGet('/articles/popular?limit=5');
        popularArticles = popularResponse.data?.articles || [];
    } catch (error) {
        console.error('Error fetching popular articles:', error);
    }

    // Generate breadcrumb schema
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "صفحه اصلی", url: "https://hikaweb.ir" },
        { name: "هیکا مگ", url: "https://hikaweb.ir/mag" }
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <ArticlesListClient
                initialArticles={articlesData.data}
                initialPagination={articlesData.pagination}
                categories={categories}
                featuredArticles={featuredArticles}
                popularArticles={popularArticles}
                searchParams={params}
            />
        </>
    );
}
