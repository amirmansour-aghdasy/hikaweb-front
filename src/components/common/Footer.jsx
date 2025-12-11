import Link from "next/link";
import Image from "next/image";

import { BsInstagram } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { FiPhoneCall, FiMail, FiMapPin } from "react-icons/fi";
import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { serverGet } from "@/lib/api/server";

const Footer = async () => {
    // Fetch latest articles, portfolios, and services
    const [articlesRes, portfoliosRes, servicesRes] = await Promise.allSettled([
        serverGet('/articles?isPublished=true&lang=fa&limit=5&sort=-publishedAt', { revalidate: 300 }),
        serverGet('/portfolio?status=active&limit=5&sort=-createdAt', { revalidate: 300 }),
        serverGet('/services?status=active&limit=5&lang=fa&sort=-createdAt', { revalidate: 300 }),
    ]);

    const latestArticles = articlesRes.status === 'fulfilled' ? (articlesRes.value.data || []) : [];
    const latestPortfolios = portfoliosRes.status === 'fulfilled' ? (portfoliosRes.value.data || []) : [];
    const latestServices = servicesRes.status === 'fulfilled' ? (servicesRes.value.data || []) : [];

    // Schema.org structured data for SEO
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "آژانس دیجیتال مارکتینگ هیکاوب",
        "alternateName": "هیکاوب",
        "url": "https://hikaweb.ir",
        "logo": "https://hikaweb.ir/assets/logo/large-logo-text.png",
        "description": "آژانس دیجیتال مارکتینگ هیکاوب با 4 سال سابقه فعالیت در زمینه تبلیغات و مدیریت کسب و کار",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+98-912-099-7935",
            "contactType": "customer service",
            "email": "info@hikaweb.ir",
            "areaServed": "IR",
            "availableLanguage": ["fa", "en"]
        },
        "sameAs": [
            "https://www.instagram.com/hikaweb.ir/",
            "https://t.me/hikaweb",
            "https://wa.me/9120997935"
        ],
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "IR"
        }
    };

    return (
        <>
            {/* Schema.org structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />

            <footer 
                id="main-footer" 
                className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200"
                role="contentinfo"
                aria-label="پاورقی سایت"
            >
                {/* Main Footer Content */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {/* Brand Section */}
                        <section className="lg:col-span-1" aria-labelledby="footer-brand">
                            <div className="mb-6" data-aos="fade-up">
                                <Link href="/" className="inline-block mb-4">
                                    <Image 
                                        src="/assets/logo/logo-text.png" 
                                        width={150} 
                                        height={40} 
                                        alt="هیکاوب - آژانس دیجیتال مارکتینگ" 
                                        title="هیکاوب"
                                        className="h-10 w-auto"
                                        style={{ width: 'auto', height: '40px' }}
                                        priority={false}
                                    />
                                </Link>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-300 mb-6" data-aos="fade-up" data-aos-delay="100">
                                <span className="font-bold text-teal-400">آژانس دیجیتال مارکتینگ هیکاوب</span> با 4 سال سابقه فعالیت در زمینه تبلیغات و مدیریت کسب و کار و یک تیم مجرب و متخصص به دنبال توسعه و پیشرفت در کسب و کار شماست.
                            </p>
                            
                            {/* Quick Links */}
                            <nav aria-label="دسترسی سریع" className="mb-6">
                                <ul className="flex flex-wrap gap-3">
                                    <li>
                                        <Link 
                                            href="/mag" 
                                            className="text-sm text-teal-400 hover:text-teal-300 transition-colors duration-200 hover:underline"
                                            data-aos="fade-up"
                                            data-aos-delay="200"
                                        >
                                            مجله
                                        </Link>
                                    </li>
                                    <li className="text-slate-500">|</li>
                                    <li>
                                        <Link 
                                            href="/portfolio" 
                                            className="text-sm text-teal-400 hover:text-teal-300 transition-colors duration-200 hover:underline"
                                            data-aos="fade-up"
                                            data-aos-delay="250"
                                        >
                                            نمونه کارها
                                        </Link>
                                    </li>
                                    <li className="text-slate-500">|</li>
                                    <li>
                                        <Link 
                                            href="/service" 
                                            className="text-sm text-teal-400 hover:text-teal-300 transition-colors duration-200 hover:underline"
                                            data-aos="fade-up"
                                            data-aos-delay="300"
                                        >
                                            خدمات
                                        </Link>
                                    </li>
                                    <li className="text-slate-500">|</li>
                                    <li>
                                        <Link 
                                            href="/contact-us" 
                                            className="text-sm text-teal-400 hover:text-teal-300 transition-colors duration-200 hover:underline"
                                            data-aos="fade-up"
                                            data-aos-delay="350"
                                        >
                                            تماس با ما
                                        </Link>
                                    </li>
                                </ul>
                            </nav>

                            {/* Social Media Links */}
                            <div className="flex items-center gap-3" data-aos="fade-up" data-aos-delay="400">
                                <a 
                                    href="https://www.instagram.com/hikaweb.ir/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    aria-label="اینستاگرام هیکاوب"
                                    className="p-2.5 bg-slate-700/50 hover:bg-teal-600 transition-all duration-300 rounded-lg group hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/20"
                                >
                                    <BsInstagram className="text-xl text-teal-400 group-hover:text-white transition-colors duration-300" />
                                </a>
                                <a 
                                    href="https://t.me/hikaweb" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    aria-label="تلگرام هیکاوب"
                                    className="p-2.5 bg-slate-700/50 hover:bg-teal-600 transition-all duration-300 rounded-lg group hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/20"
                                >
                                    <FaTelegramPlane className="text-xl text-teal-400 group-hover:text-white transition-colors duration-300" />
                                </a>
                                <a 
                                    href="https://wa.me/9120997935" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    aria-label="واتساپ هیکاوب"
                                    className="p-2.5 bg-slate-700/50 hover:bg-teal-600 transition-all duration-300 rounded-lg group hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/20"
                                >
                                    <FaWhatsapp className="text-xl text-teal-400 group-hover:text-white transition-colors duration-300" />
                                </a>
                                <a 
                                    href="#" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    aria-label="لینکدین هیکاوب"
                                    className="p-2.5 bg-slate-700/50 hover:bg-teal-600 transition-all duration-300 rounded-lg group hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/20"
                                >
                                    <FaLinkedinIn className="text-xl text-teal-400 group-hover:text-white transition-colors duration-300" />
                                </a>
                            </div>
                        </section>

                        {/* Latest Portfolios */}
                        <section className="lg:col-span-1" aria-labelledby="footer-portfolios">
                            <h2 
                                id="footer-portfolios"
                                className="text-lg font-bold text-white mb-4 pb-3 border-b border-slate-700" 
                                data-aos="fade-up"
                            >
                                آخرین نمونه کارها
                            </h2>
                            <nav aria-label="لیست نمونه کارها">
                                <ul className="space-y-3">
                                    {latestPortfolios.length > 0 ? (
                                        latestPortfolios.slice(0, 5).map((portfolio, index) => {
                                            const title = portfolio.title?.fa || portfolio.title || portfolio.client?.name || "نمونه کار";
                                            const slug = portfolio.slug?.fa || portfolio.slug?.en || portfolio.slug || portfolio._id;
                                            return (
                                                <li key={portfolio._id || index} data-aos="fade-left" data-aos-delay={index * 50}>
                                                    <Link 
                                                        href={`/portfolio/${slug}`}
                                                        className="text-sm text-slate-300 hover:text-teal-400 transition-colors duration-200 block group"
                                                        title={title}
                                                    >
                                                        <span className="group-hover:underline line-clamp-1">{title}</span>
                                                    </Link>
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <li className="text-sm text-slate-400">در حال بارگذاری...</li>
                                    )}
                                </ul>
                            </nav>
                        </section>

                        {/* Latest Articles */}
                        <section className="lg:col-span-1" aria-labelledby="footer-articles">
                            <h2 
                                id="footer-articles"
                                className="text-lg font-bold text-white mb-4 pb-3 border-b border-slate-700" 
                                data-aos="fade-up"
                            >
                                آخرین مقالات
                            </h2>
                            <nav aria-label="لیست مقالات">
                                <ul className="space-y-3">
                                    {latestArticles.length > 0 ? (
                                        latestArticles.slice(0, 5).map((article, index) => {
                                            const title = article.title?.fa || article.title || "مقاله";
                                            const slug = article.slug?.fa || article.slug?.en || article.slug || article._id;
                                            return (
                                                <li key={article._id || index} data-aos="fade-left" data-aos-delay={index * 50}>
                                                    <Link 
                                                        href={`/mag/${slug}`}
                                                        className="text-sm text-slate-300 hover:text-teal-400 transition-colors duration-200 block group"
                                                        title={title}
                                                    >
                                                        <span className="group-hover:underline line-clamp-1">{title}</span>
                                                    </Link>
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <li className="text-sm text-slate-400">در حال بارگذاری...</li>
                                    )}
                                </ul>
                            </nav>
                        </section>

                        {/* Contact Information */}
                        <section className="lg:col-span-1" aria-labelledby="footer-contact">
                            <h2 
                                id="footer-contact"
                                className="text-lg font-bold text-white mb-4 pb-3 border-b border-slate-700" 
                                data-aos="fade-up"
                            >
                                ارتباط با ما
                            </h2>
                            <address className="not-italic space-y-3">
                                <div className="flex items-start gap-3" data-aos="fade-left" data-aos-delay="0">
                                    <FiPhoneCall className="text-teal-400 mt-1 flex-shrink-0" aria-hidden="true" />
                                    <div className="flex flex-col">
                                        <a 
                                            href="tel:09120997935" 
                                            className="text-sm text-slate-300 hover:text-teal-400 transition-colors duration-200"
                                            title="تماس با هیکاوب"
                                        >
                                            09120997935
                                        </a>
                                        <a 
                                            href="tel:09053737016" 
                                            className="text-sm text-slate-300 hover:text-teal-400 transition-colors duration-200"
                                            title="تماس با هیکاوب"
                                        >
                                            09053737016
                                        </a>
                                        <a 
                                            href="tel:09191393479" 
                                            className="text-sm text-slate-300 hover:text-teal-400 transition-colors duration-200"
                                            title="تماس با هیکاوب"
                                        >
                                            09191393479
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3" data-aos="fade-left" data-aos-delay="100">
                                    <FiMail className="text-teal-400 mt-1 flex-shrink-0" aria-hidden="true" />
                                    <a 
                                        href="mailto:info@hikaweb.ir" 
                                        className="text-sm text-slate-300 hover:text-teal-400 transition-colors duration-200 break-all"
                                        title="ارسال ایمیل به هیکاوب"
                                    >
                                        info@hikaweb.ir
                                    </a>
                                </div>
                            </address>

                            {/* Latest Services */}
                            <div className="mt-6 pt-6 border-t border-slate-700">
                                <h3 className="text-base font-semibold text-white mb-3" data-aos="fade-up">
                                    آخرین خدمات
                                </h3>
                                <nav aria-label="لیست خدمات">
                                    <ul className="space-y-2">
                                        {latestServices.length > 0 ? (
                                            latestServices.slice(0, 4).map((service, index) => {
                                                const title = typeof service.name === 'string' 
                                                    ? service.name 
                                                    : (service.name?.fa || service.name?.en || service.title?.fa || service.title || "خدمت");
                                                const slug = service.slug?.fa || service.slug?.en || service.slug || service._id;
                                                return (
                                                    <li key={service._id || index} data-aos="fade-left" data-aos-delay={index * 50}>
                                                        <Link 
                                                            href={`/service/${slug}`}
                                                            className="text-sm text-slate-300 hover:text-teal-400 transition-colors duration-200 block group"
                                                            title={title}
                                                        >
                                                            <span className="group-hover:underline line-clamp-1">{title}</span>
                                                        </Link>
                                                    </li>
                                                );
                                            })
                                        ) : (
                                            <li className="text-sm text-slate-400">در حال بارگذاری...</li>
                                        )}
                                    </ul>
                                </nav>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-700/50 bg-slate-900/50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Trust Badges */}
                            <div className="flex items-center justify-center gap-4" data-aos="fade-up">
                                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center overflow-hidden">
                                    <a 
                                        referrerPolicy='origin' 
                                        target='_blank' 
                                        href='https://trustseal.enamad.ir/?id=484418&Code=ggyy9tDcF2QAiZ9R0qGpEQp6jNRJkozr'
                                        className="block w-full h-full"
                                    >
                                        <img 
                                            referrerPolicy='origin' 
                                            src='https://trustseal.enamad.ir/logo.aspx?id=484418&Code=ggyy9tDcF2QAiZ9R0qGpEQp6jNRJkozr' 
                                            alt='' 
                                            style={{cursor:'pointer', width: '100%', height: '100%', objectFit: 'contain'}} 
                                            code='ggyy9tDcF2QAiZ9R0qGpEQp6jNRJkozr'
                                        />
                                    </a>
                                </div>
                            </div>

                            {/* Copyright */}
                            <div className="text-center md:text-right">
                                <p className="text-xs text-slate-400" data-aos="fade-up" data-aos-delay="100">
                                    تمامی حقوق محفوظ است © {new Date().getFullYear()} هیکاوب
                                </p>
                                <p className="text-xs text-slate-500 mt-1" data-aos="fade-up" data-aos-delay="200">
                                    طراحی و توسعه توسط تیم هیکاوب
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
