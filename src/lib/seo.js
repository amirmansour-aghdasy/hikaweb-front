/**
 * SEO utility functions for generating meta tags and structured data
 */

export const defaultMetadata = {
    title: {
        fa: "آژانس دیجیتال مارکتینگ هیکاوب | هیکاوب انرژی هر کسب و کار",
        en: "Hikaweb Digital Marketing Agency | Hikaweb Energy for Every Business"
    },
    description: {
        fa: "آژانس دیجیتال مارکتینگ هیکاوب ارائه دهنده انواع خدمات برندیگ از جمله : طراحی لوگو، مدیریت شبکه های اجتماعی، طراحی سایت، سئو سایت، طراحی تیزر و موشن گرافیک.",
        en: "Hikaweb Digital Marketing Agency offering various branding services including: logo design, social media management, website design, SEO, video and motion graphics design."
    },
    keywords: {
        fa: ["هیکاوب", "دیجیتال مارکتینگ", "طراحی سایت", "سئو", "برندسازی", "طراحی لوگو", "شبکه های اجتماعی"],
        en: ["Hikaweb", "Digital Marketing", "Web Design", "SEO", "Branding", "Logo Design", "Social Media"]
    },
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://hikaweb.ir",
    siteName: "هیکاوب",
    locale: "fa_IR",
    alternateLocale: "en_US"
};

/**
 * Generate service structured data
 */
export function generateServiceSchema(service) {
    // Extract multilingual fields safely
    const serviceName = typeof service.name === 'string' ? service.name : (service.name?.fa || service.name?.en || "");
    const serviceDescription = typeof service.description === 'string' 
        ? service.description 
        : (service.description?.fa || service.shortDescription?.fa || service.description?.en || service.shortDescription?.en || "");
    
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: serviceName,
        description: serviceDescription,
        provider: {
            "@type": "Organization",
            name: "هیکاوب",
            url: defaultMetadata.siteUrl,
            logo: `${defaultMetadata.siteUrl}/assets/logo/large-logo-text.png`
        },
        areaServed: {
            "@type": "Country",
            name: "Iran"
        },
        serviceType: serviceName,
        ...(service.pricing?.packages?.length > 0 && {
            offers: service.pricing.packages.map(pkg => {
                // Handle both static data format (title) and API format (name)
                const pkgName = pkg.title || (typeof pkg.name === 'string' ? pkg.name : (pkg.name?.fa || pkg.name?.en || ""));
                const pkgDesc = typeof pkg.desc === 'string' ? pkg.desc : (pkg.desc?.fa || pkg.desc?.en || "");
                const pkgValue = typeof pkg.value === 'string' ? pkg.value : (pkg.value?.fa || pkg.value?.en || String(pkg.value || "0"));
                
                return {
                    "@type": "Offer",
                    name: pkgName,
                    description: pkgDesc,
                    price: pkgValue,
                    priceCurrency: service.pricing.currency || "IRR"
                };
            })
        })
    };
}

/**
 * Generate organization structured data
 */
export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "هیکاوب",
        url: defaultMetadata.siteUrl,
        logo: `${defaultMetadata.siteUrl}/assets/logo/large-logo-text.png`,
        description: defaultMetadata.description.fa,
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            availableLanguage: ["Persian", "English"]
        },
        sameAs: [
            "https://www.instagram.com/hikaweb.ir/",
            "https://t.me/hikaweb"
        ]
    };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    };
}

/**
 * Generate website structured data
 */
export function generateWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "هیکاوب",
        url: defaultMetadata.siteUrl,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${defaultMetadata.siteUrl}/mag?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };
}

/**
 * Generate navigation menu structured data for SEO
 * Helps search engines understand site structure
 */
export function generateNavigationSchema(navbarItems) {
    const menuItems = [];
    
    navbarItems.forEach((item, index) => {
        if (item.url) {
            menuItems.push({
                "@type": "SiteNavigationElement",
                name: item.title,
                url: item.url.startsWith('http') ? item.url : `${defaultMetadata.siteUrl}${item.url}`,
                position: index + 1
            });
        } else if (item.children && Array.isArray(item.children)) {
            // Add parent menu item
            menuItems.push({
                "@type": "SiteNavigationElement",
                name: item.title,
                position: index + 1,
                hasPart: item.children.map((child, childIndex) => ({
                    "@type": "SiteNavigationElement",
                    name: child.title,
                    url: child.url.startsWith('http') ? child.url : `${defaultMetadata.siteUrl}${child.url}`,
                    position: childIndex + 1
                }))
            });
        }
    });

    return {
        "@context": "https://schema.org",
        "@type": "SiteNavigationElement",
        name: "منوی اصلی",
        url: defaultMetadata.siteUrl,
        hasPart: menuItems
    };
}

