"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function BannersSection({ banners = [] }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!banners || banners.length === 0) {
        return null;
    }

    return (
        <section id="home-page-banners" className="w-full grid grid-cols-1 md:grid-cols-2 place-items-center gap-5">
            {banners.map((banner, index) => {
                const imageUrl = isMobile && banner.mobileImage 
                    ? banner.mobileImage 
                    : banner.image;
                const linkUrl = banner.link?.url || "#";
                const linkTarget = banner.link?.target || "_self";
                const altText = banner.settings?.altText?.fa || banner.title?.fa || "بنر تبلیغاتی";
                
                return (
                    <Link 
                        key={banner._id || index} 
                        href={linkUrl} 
                        target={linkTarget}
                        className="w-full rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300" 
                        data-aos={index === 0 ? "fade-left" : "fade-right"}
                    >
                        <Image 
                            src={imageUrl} 
                            width="0" 
                            height="0" 
                            alt={altText} 
                            title={altText}
                            sizes="100vw" 
                            className="w-full h-auto" 
                            priority={index < 2}
                        />
                    </Link>
                );
            })}
        </section>
    );
}

