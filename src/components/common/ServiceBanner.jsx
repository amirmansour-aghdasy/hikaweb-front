"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ServiceBanner({ banner, fallbackImage, fallbackAlt }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // If no banner from system, use fallback (service featuredImage)
    if (!banner) {
        if (!fallbackImage) {
            return null;
        }
        return (
            <Image 
                src={fallbackImage} 
                width={1346} 
                height={298} 
                sizes="100vw" 
                className="w-full h-32 md:h-auto rounded-3xl" 
                alt={fallbackAlt || "بنر خدمت"} 
                title={fallbackAlt || "بنر خدمت"} 
                data-aos="zoom-in" 
                priority
                quality={90}
            />
        );
    }

    // Use banner from system
    const imageUrl = isMobile && banner.mobileImage 
        ? banner.mobileImage 
        : banner.image;
    const linkUrl = banner.link?.url || "#";
    const linkTarget = banner.link?.target || "_self";
    const altText = banner.settings?.altText?.fa || banner.title?.fa || fallbackAlt || "بنر تبلیغاتی";

    // If banner has a link, wrap in Link component
    if (linkUrl && linkUrl !== "#") {
        return (
            <Link 
                href={linkUrl} 
                target={linkTarget}
                className="w-full rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 block" 
                data-aos="zoom-in"
            >
                <Image 
                    src={imageUrl} 
                    width={1346} 
                    height={298} 
                    sizes="100vw" 
                    className="w-full h-32 md:h-auto" 
                    alt={altText} 
                    title={altText}
                    priority
                    quality={90}
                />
            </Link>
        );
    }

    // If no link, just display image
    return (
        <Image 
            src={imageUrl} 
            width={1346} 
            height={298} 
            sizes="100vw" 
            className="w-full h-32 md:h-auto rounded-3xl" 
            alt={altText} 
            title={altText} 
            data-aos="zoom-in" 
            priority
            quality={90}
        />
    );
}

