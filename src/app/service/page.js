import { serverGet } from "@/lib/api/server";
import { defaultMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import ServicesListingClient from "@/components/services/ServicesListingClient";
import FeaturedServicesSection from "@/components/services/FeaturedServicesSection";
import StatsSection from "@/components/services/StatsSection";

export const metadata = {
    title: "خدمات هیکاوب | آژانس دیجیتال مارکتینگ",
    description: "مجموعه کامل خدمات دیجیتال مارکتینگ هیکاوب شامل: سئو و بهینه‌سازی، طراحی سایت، طراحی لوگو، مدیریت شبکه‌های اجتماعی، تولید محتوا، طراحی گرافیک و چاپ. مشاوره رایگان دریافت کنید.",
    keywords: "خدمات دیجیتال مارکتینگ, سئو سایت, طراحی وبسایت, طراحی لوگو, مدیریت شبکه های اجتماعی, تولید محتوا, طراحی گرافیک, چاپ و تبلیغات, هیکاوب",
    openGraph: {
        title: "خدمات هیکاوب | آژانس دیجیتال مارکتینگ",
        description: "مجموعه کامل خدمات دیجیتال مارکتینگ هیکاوب. مشاوره رایگان دریافت کنید.",
        type: "website",
        images: [
            {
                url: `${defaultMetadata.siteUrl}/assets/logo/large-logo-text.png`,
                width: 1200,
                height: 630,
                alt: "خدمات هیکاوب",
            },
        ],
    },
    alternates: {
        canonical: `${defaultMetadata.siteUrl}/service`,
    },
};

/**
 * Generate CollectionPage structured data for services listing
 */
function generateServicesCollectionSchema(services) {
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "خدمات هیکاوب",
        description: "مجموعه کامل خدمات دیجیتال مارکتینگ هیکاوب",
        url: `${defaultMetadata.siteUrl}/service`,
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: services.length,
            itemListElement: services.map((service, index) => {
                const serviceName = typeof service.name === 'string' 
                    ? service.name 
                    : (service.name?.fa || service.name?.en || "");
                const serviceSlug = service.slug?.fa || service.slug?.en || service.slug || "";
                
                return {
                    "@type": "ListItem",
                    position: index + 1,
                    item: {
                        "@type": "Service",
                        name: serviceName,
                        url: `${defaultMetadata.siteUrl}/service/${serviceSlug}`,
                        description: typeof service.shortDescription === 'string'
                            ? service.shortDescription
                            : (service.shortDescription?.fa || service.shortDescription?.en || ""),
                        provider: {
                            "@type": "Organization",
                            name: "هیکاوب",
                            url: defaultMetadata.siteUrl,
                        },
                    },
                };
            }),
        },
    };
}

export default async function ServicesPage() {
    // Fetch all active services
    let services = [];
    try {
        const servicesResponse = await serverGet('/services?status=active&limit=100&lang=fa');
        services = servicesResponse.data || [];
    } catch (error) {
        console.error("Error fetching services:", error);
        // Continue with empty array - component will handle gracefully
    }

    // Generate structured data
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "صفحه اصلی", url: defaultMetadata.siteUrl },
        { name: "خدمات", url: `${defaultMetadata.siteUrl}/service` },
    ]);

    const collectionSchema = services.length > 0 ? generateServicesCollectionSchema(services) : null;

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {collectionSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
                />
            )}

            <main className="w-full py-5 md:py-14 flex flex-col gap-10 md:gap-14" id="services-listing-page">
                {/* Hero Section */}
                <section className="w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-teal-100/50 to-transparent dark:from-teal-950/30 dark:via-teal-900/20 dark:to-transparent -z-10"></div>
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl mx-auto text-center py-8 md:py-12" data-aos="fade-up">
                            <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4 md:mb-6">
                                خدمات <span className="text-teal-600 dark:text-teal-400">هیکاوب</span>
                            </h1>
                            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                                مجموعه کامل خدمات دیجیتال مارکتینگ برای رشد و توسعه کسب و کار شما. از طراحی تا بازاریابی، همه چیز در یک مکان.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Featured Services Section */}
                {services.length > 0 && (
                    <section className="w-full container mx-auto px-4 md:px-6">
                        <FeaturedServicesSection services={services} />
                    </section>
                )}

                {/* Stats Section */}
                <section className="w-full container mx-auto px-4 md:px-6">
                    <StatsSection />
                </section>

                {/* Services Listing */}
                <section className="w-full container mx-auto px-4 md:px-6">
                    <ServicesListingClient services={services} />
                </section>

                {/* CTA Section */}
                <section className="w-full container mx-auto px-4 md:px-6">
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-800 dark:to-teal-900 rounded-2xl md:rounded-3xl p-6 md:p-12 text-center" data-aos="zoom-in">
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">
                            آماده شروع هستید؟
                        </h2>
                        <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto">
                            برای دریافت مشاوره رایگان و انتخاب بهترین خدمات برای کسب و کار خود، با ما در ارتباط باشید.
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

