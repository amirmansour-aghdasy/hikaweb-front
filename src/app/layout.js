import "./globals.css";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/effect-cards";

import { iranSanse } from "@/lib/fonts";
import StoreProvider from "./StoreProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Footer, Header, Breadcrumb } from "@/components/common";
import { ActionButtonsContainer, ModalsContainer, ScriptsContainer } from "@/containers";
import { generateOrganizationSchema, generateWebsiteSchema, defaultMetadata } from "@/lib/seo";
import ErrorBoundary from "@/components/error/ErrorBoundary";

export const metadata = {
    title: {
        default: defaultMetadata.title.fa,
        template: "%s | هیکاوب"
    },
    description: defaultMetadata.description.fa,
    keywords: defaultMetadata.keywords.fa.join(", "),
    authors: [{ name: "هیکاوب" }],
    creator: "هیکاوب",
    publisher: "هیکاوب",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(defaultMetadata.siteUrl),
    alternates: {
        canonical: "/",
        languages: {
            "fa-IR": "/fa",
            "en-US": "/en",
        },
    },
    openGraph: {
        type: "website",
        locale: "fa_IR",
        url: defaultMetadata.siteUrl,
        siteName: defaultMetadata.siteName,
        title: defaultMetadata.title.fa,
        description: defaultMetadata.description.fa,
        images: [
            {
                url: `${defaultMetadata.siteUrl}/assets/logo/large-logo-text.png`,
                width: 1200,
                height: 630,
                alt: "هیکاوب",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: defaultMetadata.title.fa,
        description: defaultMetadata.description.fa,
        images: [`${defaultMetadata.siteUrl}/assets/logo/large-logo-text.png`],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "هیکاوب",
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#0d9488",
};

export default function RootLayout({ children }) {
    // Generate structured data for organization and website
    const organizationSchema = generateOrganizationSchema();
    const websiteSchema = generateWebsiteSchema();

    return (
        <html lang="fa" dir="rtl" suppressHydrationWarning>
            <head>
                {/* Theme detection script - must run before body to prevent FOUC */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    var theme = localStorage.getItem('theme') || 'system';
                                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                                    var resolvedTheme = theme === 'system' ? systemTheme : theme;
                                    document.documentElement.classList.add(resolvedTheme);
                                } catch (e) {}
                            })();
                        `
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
                />
            </head>
            <body className={`container h-auto min-h-screen py-5 flex flex-col ${iranSanse.className} overflow-x-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300`} suppressHydrationWarning>
                <span className="absolute w-full top-0 right-0 h-1 bg-teal-500 dark:bg-teal-600"></span>
                <StoreProvider>
                    <ThemeProvider>
                        <ErrorBoundary>
                            <ScriptsContainer />
                            <ModalsContainer />
                            <ActionButtonsContainer />
                            <Header />
                            <Breadcrumb />
                            {children}
                            <Footer />
                        </ErrorBoundary>
                    </ThemeProvider>
                </StoreProvider>
            </body>
        </html>
    );
}
