import { redirect } from 'next/navigation';
import { serverGet } from '@/lib/api/server';

export async function generateMetadata({ params }) {
    const { code } = await params;
    
    try {
        const data = await serverGet(`/shortlinks/${code}/info`);
        const shortLink = data.data?.shortLink;
        
        if (shortLink?.metadata?.title?.fa) {
            return {
                title: shortLink.metadata.title.fa,
                description: shortLink.metadata.description?.fa || '',
            };
        }
    } catch (error) {
        // Silently fail
    }
    
    return {
        title: 'در حال انتقال... | هیکاوب',
    };
}

export default async function ShortLinkRedirectPage({ params }) {
    const { code } = await params;
    
    try {
        const data = await serverGet(`/shortlinks/${code}/info`, { 
            revalidate: 0, // Don't cache redirects
            cache: false 
        });
        const shortLink = data.data?.shortLink;
        
        if (shortLink?.originalUrl) {
            // Ensure URL is absolute
            let redirectUrl = shortLink.originalUrl;
            
            // If relative URL, make it absolute
            if (redirectUrl.startsWith('/')) {
                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hikaweb.ir';
                redirectUrl = `${siteUrl}${redirectUrl}`;
            }
            
            // Validate URL format
            try {
                new URL(redirectUrl);
                redirect(redirectUrl);
            } catch (urlError) {
                console.error('Invalid redirect URL:', redirectUrl);
                redirect('/');
            }
        } else {
            redirect('/');
        }
    } catch (error) {
        console.error('Error fetching short link:', error);
        // If short link not found, redirect to home
        redirect('/');
    }
}

