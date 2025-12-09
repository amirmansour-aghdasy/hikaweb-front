import { serverGet } from '@/lib/api/server';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hikaweb.ir';
    
    // Static routes
    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/mag`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/about-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/service`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/portfolio`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    try {
        // Fetch services (with longer cache for sitemap)
        const servicesData = await serverGet('/services?lang=fa&limit=100', { revalidate: 3600 });
        const services = servicesData.data || [];
        
        const serviceRoutes = services.map((service) => ({
            url: `${baseUrl}/service/${service.slug?.fa || service.slug?.en || service.slug}`,
            lastModified: service.updatedAt ? new Date(service.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        // Fetch articles (with longer cache for sitemap)
        const articlesData = await serverGet('/articles?isPublished=true&lang=fa&limit=500', { revalidate: 3600 });
        const articles = articlesData.data || [];
        
        const articleRoutes = articles.map((article) => ({
            url: `${baseUrl}/mag/${article.slug?.fa || article.slug?.en || article.slug}`,
            lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(article.updatedAt || article.createdAt),
            changeFrequency: 'weekly',
            priority: 0.6,
        }));

        // Fetch portfolios (with longer cache for sitemap)
        const portfoliosData = await serverGet('/portfolio?status=active&limit=500', { revalidate: 3600 });
        const portfolios = portfoliosData.data || [];
        
        const portfolioRoutes = portfolios.map((portfolio) => ({
            url: `${baseUrl}/portfolio/${portfolio.slug?.fa || portfolio.slug?.en || portfolio.slug}`,
            lastModified: portfolio.updatedAt ? new Date(portfolio.updatedAt) : new Date(portfolio.createdAt),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));

        return [...staticRoutes, ...serviceRoutes, ...articleRoutes, ...portfolioRoutes];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        // Return static routes if API fails
        return staticRoutes;
    }
}

