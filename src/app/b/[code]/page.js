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
        const data = await serverGet(`/shortlinks/${code}/info`);
        const shortLink = data.data?.shortLink;
        
        if (shortLink?.originalUrl) {
            redirect(shortLink.originalUrl);
        } else {
            redirect('/');
        }
    } catch (error) {
        // If short link not found, redirect to home
        redirect('/');
    }
}

