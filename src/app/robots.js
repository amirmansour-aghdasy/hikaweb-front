export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hikaweb.ir';
    
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/admin/',
                    '/_next/',
                    '/maintenance',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

