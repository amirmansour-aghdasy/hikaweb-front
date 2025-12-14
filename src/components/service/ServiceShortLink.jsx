"use client";

import { useEffect, useState } from "react";
import ShortLinkBox from "@/components/common/ShortLinkBox";

export default function ServiceShortLink({ slug, serviceId }) {
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, [slug]);

    if (!currentUrl) return null;

    return (
        <div className="mb-6" data-aos="fade-up">
            <ShortLinkBox 
                originalUrl={currentUrl}
                resourceType="service"
                resourceId={serviceId}
                label="لینک کوتاه خدمت"
            />
        </div>
    );
}

