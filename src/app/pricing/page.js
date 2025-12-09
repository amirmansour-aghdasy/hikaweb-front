import { serverGet } from "@/lib/api/server";
import { defaultMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import PricingPageClient from "@/components/pricing/PricingPageClient";

export const metadata = {
    title: "تعرفه خدمات هیکاوب | قیمت‌گذاری شفاف و منصفانه",
    description: "تعرفه کامل و شفاف خدمات دیجیتال مارکتینگ هیکاوب شامل: طراحی سایت، سئو، طراحی لوگو، مدیریت شبکه‌های اجتماعی، تولید محتوا و سایر خدمات. قیمت‌های منصفانه و شفاف برای همه.",
    keywords: "تعرفه خدمات, قیمت طراحی سایت, قیمت سئو, تعرفه دیجیتال مارکتینگ, قیمت طراحی لوگو, تعرفه هیکاوب, قیمت‌گذاری شفاف",
    openGraph: {
        title: "تعرفه خدمات هیکاوب | قیمت‌گذاری شفاف و منصفانه",
        description: "تعرفه کامل و شفاف خدمات دیجیتال مارکتینگ هیکاوب. قیمت‌های منصفانه و شفاف برای همه.",
        type: "website",
        images: [
            {
                url: `${defaultMetadata.siteUrl}/assets/logo/large-logo-text.png`,
                width: 1200,
                height: 630,
                alt: "تعرفه خدمات هیکاوب",
            },
        ],
    },
    alternates: {
        canonical: `${defaultMetadata.siteUrl}/pricing`,
    },
};

/**
 * Generate PricingPage structured data
 */
function generatePricingPageSchema(servicesWithPricing) {
    const offers = [];
    
    servicesWithPricing.forEach(service => {
        const serviceName = typeof service.name === 'string' 
            ? service.name 
            : (service.name?.fa || service.name?.en || "");
        
        if (service.pricing?.packages && service.pricing.packages.length > 0) {
            service.pricing.packages.forEach(pkg => {
                const pkgName = typeof pkg.name === 'string' 
                    ? pkg.name 
                    : (pkg.name?.fa || pkg.name?.en || "");
                const pkgValue = typeof pkg.value === 'string' 
                    ? pkg.value 
                    : (pkg.value?.fa || pkg.value?.en || String(pkg.value || "0"));
                
                offers.push({
                    "@type": "Offer",
                    name: `${serviceName} - ${pkgName}`,
                    price: pkgValue,
                    priceCurrency: service.pricing.currency || "IRR",
                    availability: "https://schema.org/InStock",
                    seller: {
                        "@type": "Organization",
                        name: "هیکاوب",
                        url: defaultMetadata.siteUrl,
                    },
                });
            });
        }
    });

    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "تعرفه خدمات هیکاوب",
        description: "تعرفه کامل و شفاف خدمات دیجیتال مارکتینگ هیکاوب",
        url: `${defaultMetadata.siteUrl}/pricing`,
        mainEntity: {
            "@type": "ItemList",
            itemListElement: offers.map((offer, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: offer,
            })),
        },
    };
}

export default async function PricingPage() {
    // Fetch all active services with pricing
    let services = [];
    try {
        const servicesResponse = await serverGet('/services?status=active&limit=100&lang=fa');
        services = servicesResponse.data || [];
    } catch (error) {
        console.error("Error fetching services for pricing page:", error);
    }

    // Filter services that have pricing packages
    const servicesWithPricing = services.filter(service => 
        service.pricing?.packages && 
        Array.isArray(service.pricing.packages) && 
        service.pricing.packages.length > 0
    );

    // Generate structured data
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "صفحه اصلی", url: defaultMetadata.siteUrl },
        { name: "تعرفه خدمات", url: `${defaultMetadata.siteUrl}/pricing` },
    ]);

    const pricingPageSchema = servicesWithPricing.length > 0 
        ? generatePricingPageSchema(servicesWithPricing) 
        : null;

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {pricingPageSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingPageSchema) }}
                />
            )}

            <main className="w-full py-5 md:py-14 flex flex-col gap-10 md:gap-14" id="pricing-page-main-content">
                {/* Hero Section */}
                <section className="w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-teal-100/50 to-transparent dark:from-teal-950/30 dark:via-teal-900/20 dark:to-transparent -z-10"></div>
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl mx-auto text-center py-8 md:py-12" data-aos="fade-up">
                            <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4 md:mb-6">
                                تعرفه <span className="text-teal-600 dark:text-teal-400">خدمات</span>
                            </h1>
                            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                                قیمت‌گذاری شفاف و منصفانه برای همه خدمات دیجیتال مارکتینگ. هر خدمت با پکیج‌های متنوع و قیمت‌های مشخص ارائه می‌شود.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Pricing Content */}
                <section className="w-full container mx-auto px-4 md:px-6">
                    <PricingPageClient services={servicesWithPricing} />
                </section>

                {/* CTA Section */}
                <section className="w-full container mx-auto px-4 md:px-6">
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-800 dark:to-teal-900 rounded-2xl md:rounded-3xl p-6 md:p-12 text-center" data-aos="zoom-in">
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">
                            نیاز به مشاوره دارید؟
                        </h2>
                        <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto">
                            برای دریافت مشاوره رایگان و انتخاب بهترین پکیج برای کسب و کار خود، با ما در ارتباط باشید.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a
                                href="/#counseling"
                                className="bg-white text-teal-600 px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-teal-50 transition-colors shadow-lg"
                            >
                                دریافت مشاوره رایگان
                            </a>
                            <a
                                href="/contact-us"
                                className="bg-white/10 text-white border-2 border-white/30 px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-white/20 transition-colors"
                            >
                                تماس با ما
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

