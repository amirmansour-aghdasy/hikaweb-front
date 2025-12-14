import Image from "next/image";
import { notFound } from "next/navigation";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";

import { FaqOutlined } from "@/lib/icons/svg";
import { PortfolioSlider, GalleryLightbox } from "@/components/common";
import { ServicePricingPlansSlider, ServiceProcessSlider } from "@/components/sliders";
import { generateServiceSchema, generateBreadcrumbSchema } from "@/lib/seo";
import ServiceConsultationBox from "@/components/service/ServiceConsultationBox";
import ServiceShortLink from "@/components/service/ServiceShortLink";
import { serverGet } from "@/lib/api/server";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    
    try {
        const data = await serverGet(`/services/slug/${slug}?lang=fa`);
        const service = data.data?.service;
        
        if (!service) {
            return {
                title: "خدمت یافت نشد | هیکاوب",
            };
        }

        const title = service.name?.fa || service.name || "";
        const description = service.description?.fa || service.shortDescription?.fa || "";
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hikaweb.ir";
        const featuredImage = service.featuredImage 
            ? (service.featuredImage.startsWith('http') 
                ? service.featuredImage 
                : `${siteUrl}${service.featuredImage.startsWith('/') ? '' : '/'}${service.featuredImage}`)
            : `${siteUrl}/assets/logo/large-logo-text.png`;

        return {
            title: service.seo?.metaTitle?.fa || `${title} | آژانس دیجیتال مارکتینگ هیکاوب`,
            description: service.seo?.metaDescription?.fa || description.substring(0, 160),
            keywords: service.seo?.metaKeywords?.fa?.join(", ") || "",
            openGraph: {
                title: title,
                description: description.substring(0, 160),
                url: `${siteUrl}/service/${slug}`,
                siteName: "هیکاوب",
                images: [
                    {
                        url: featuredImage,
                        width: 1200,
                        height: 630,
                        alt: title || "خدمت هیکاوب",
                    },
                ],
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: title,
                description: description.substring(0, 160),
                images: [featuredImage],
            },
            alternates: {
                canonical: `${siteUrl}/service/${slug}`,
            },
        };
    } catch (error) {
        console.error("Error generating metadata for service:", error);
        return {
            title: "خدمت | هیکاوب",
        };
    }
}

const SingleServiceDetailsPage = async ({ params }) => {
    const { slug } = await params;

    let service;
    try {
        const data = await serverGet(`/services/slug/${slug}?lang=fa`);
        service = data.data?.service;
        
        if (!service) {
            notFound();
        }
    } catch (error) {
        console.error("Error fetching service:", error);
        notFound();
    }

    // Transform service data to component structure
    const title = service.name?.fa || service.name || "";
    const mainBanner = service.featuredImage || "";
    const mainContent = service.mainContent || {
        firstSection: { content: {}, slides: [] },
        secondSection: { content: {}, slides: [] },
    };
    const firstSection = mainContent.firstSection || { content: {}, slides: [] };
    const secondSection = mainContent.secondSection || { content: {}, slides: [] };
    
    // Extract multilingual content for sections
    const firstSectionContent = {
        title: firstSection.content?.title?.fa || firstSection.content?.title || "",
        description: firstSection.content?.description?.fa || firstSection.content?.description || "",
        actionBtnText: firstSection.content?.actionBtnText?.fa || firstSection.content?.actionBtnText || "",
    };
    
    const secondSectionContent = {
        title: secondSection.content?.title?.fa || secondSection.content?.title || "",
        description: secondSection.content?.description?.fa || secondSection.content?.description || "",
        actionBtnText: secondSection.content?.actionBtnText?.fa || secondSection.content?.actionBtnText || "",
    };

    // Transform pricing packages
    const pricing = (service.pricing?.packages || []).map((pkg) => {
        const name = pkg.name;
        const value = pkg.value;
        const subTitle = pkg.subTitle;
        const desc = pkg.desc;
        const actionBtnText = pkg.actionBtnText;
        
        return {
            title: typeof name === 'string' ? name : (name?.fa || name?.en || ""),
            value: typeof value === 'string' ? value : (value?.fa || value?.en || String(value || "")),
            subTitle: typeof subTitle === 'string' ? subTitle : (subTitle?.fa || subTitle?.en || ""),
            features: (pkg.features || []).map((feature) => 
                typeof feature === 'string' ? feature : (feature?.fa || feature?.en || String(feature || ""))
            ),
            desc: typeof desc === 'string' ? desc : (desc?.fa || desc?.en || ""),
            actionBtnText: typeof actionBtnText === 'string' ? actionBtnText : (actionBtnText?.fa || actionBtnText?.en || ""),
        };
    });

    // Transform subServices
    const subServices = (service.subServices || []).map((sub) => {
        const title = sub.title;
        return {
            iconSrc: sub.icon || "",
            text: typeof title === 'string' ? title : (title?.fa || title?.en || ""),
        };
    });

    // Transform process steps
    const process = (service.processSteps || [])
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((step) => {
            const stepTitle = step.title;
            const stepDescription = step.description;
            return {
                title: typeof stepTitle === 'string' ? stepTitle : (stepTitle?.fa || stepTitle?.en || ""),
                iconHref: step.icon || "",
                text: typeof stepDescription === 'string' ? stepDescription : (stepDescription?.fa || stepDescription?.en || ""),
            };
        });

    // Transform finalDesc
    const finalDesc = service.finalDesc
        ? (() => {
              const finalTitle = service.finalDesc.content?.title;
              const finalText = service.finalDesc.content?.text;
              return {
                  content: {
                      title: typeof finalTitle === 'string' ? finalTitle : (finalTitle?.fa || finalTitle?.en || ""),
                      text: typeof finalText === 'string' ? finalText : (finalText?.fa || finalText?.en || ""),
                  },
                  image: service.finalDesc.image || "",
              };
          })()
        : null;

    // Transform slides for PortfolioSlider
    const transformSlides = (slides) => {
        if (!Array.isArray(slides)) return [];
        return slides.map((slide) => {
            const slideTitle = slide.title;
            const titleStr = typeof slideTitle === 'string' ? slideTitle : (slideTitle?.fa || slideTitle?.en || "");
            return {
                imageSrc: slide.featuredImage || slide.image || "",
                title: titleStr,
                alt: titleStr,
            };
        });
    };

    const firstSectionSlides = transformSlides(firstSection.slides);
    const secondSectionSlides = transformSlides(secondSection.slides);

    // Transform gallery for lightbox
    const galleryImages = (service.gallery || []).map((item, index) => {
        const itemAlt = item.alt;
        const itemTitle = item.title;
        const itemCaption = item.caption;
        
        const altStr = typeof itemAlt === 'string' ? itemAlt : (itemAlt?.fa || itemAlt?.en || "");
        const titleStr = typeof itemTitle === 'string' ? itemTitle : (itemTitle?.fa || itemTitle?.en || "");
        const captionStr = typeof itemCaption === 'string' ? itemCaption : (itemCaption?.fa || itemCaption?.en || "");
        
        return {
            url: item.url || item.imageSrc || "",
            alt: altStr || titleStr || `تصویر ${index + 1}`,
            title: titleStr || captionStr || "",
            caption: captionStr || "",
        };
    });

    // Fetch FAQs (if available from service or separate endpoint)
    let faqs = [];
    if (service._id) {
        try {
            // Use correct endpoint: /faq/service/:serviceId (public route)
            const faqData = await serverGet(`/faq/service/${service._id}`);
            faqs = (faqData.data?.faqs || []).map((faq) => ({
                question: faq.question?.fa || faq.question || "",
                answer: faq.answer?.fa || faq.answer || "",
            }));
        } catch (error) {
            // Silently fail if FAQs endpoint doesn't exist or returns error
            // This is optional data
            console.error("Error fetching FAQs:", error);
        }
    }

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };

    // Generate structured data
    const serviceSchema = generateServiceSchema(service);
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "صفحه اصلی", url: "https://hikaweb.ir" },
        { name: "خدمات", url: "https://hikaweb.ir/#services-section" },
        { name: title, url: `https://hikaweb.ir/service/${slug}` }
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {faqs.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            <main className="w-full py-5 md:py-14 flex flex-col gap-10 md:gap-14 overflow-hidden md:overflow-visible" id={`${slug}-service-main-content`}>
                {mainBanner && mainBanner.trim() && (
                    <Image src={mainBanner} width={1346} height={298} sizes="100vw" className="w-full h-32 md:h-auto rounded-3xl" alt={title} title={title} data-aos="zoom-in" priority />
                )}
                
                {/* Short Link Box */}
                <ServiceShortLink slug={slug} serviceId={service?._id || service?.id} />
                {firstSectionContent.title && (
                    <section className="w-full grid grid-cols-12 gap-7 place-items-center overflow-hidden">
                        <div className="w-full col-span-12 md:col-span-5 flex flex-col gap-y-3.5">
                            <h2 className="w-full text-xl md:text-3xl text-slate-700 dark:text-slate-200 font-bold" data-aos="fade-left">
                                {firstSectionContent.title}
                            </h2>
                            {firstSectionContent.description && (
                                <p className="w-full p-5 rounded-lg text-xs md:text-base bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 leading-6" data-aos="zoom-in">
                                    {firstSectionContent.description}
                                </p>
                            )}
                            {firstSectionContent.actionBtnText && (
                                <button className="flex justify-center w-6/12 mx-auto rounded-md font-bold text-sm md:text-base py-2 md:py-2.5 bg-teal-900 dark:bg-teal-800 text-white hover:bg-teal-800 dark:hover:bg-teal-700 transition-colors" data-aos="fade-right">
                                    {firstSectionContent.actionBtnText}
                                </button>
                            )}
                        </div>
                        {firstSectionSlides.length > 0 && (
                            <div className="w-full col-span-12 md:col-span-7" data-aos="zoom-out">
                                <PortfolioSlider order={firstSectionSlides.length} slides={firstSectionSlides} />
                            </div>
                        )}
                    </section>
                )}
                {secondSectionContent.title && (
                    <section className="w-full grid grid-cols-12 gap-7 place-items-center overflow-hidden">
                        {secondSectionSlides.length > 0 && (
                            <div className="w-full col-span-12 md:col-span-7 order-2 md:order-none" data-aos="zoom-in">
                                <PortfolioSlider order={secondSectionSlides.length} slides={secondSectionSlides} />
                            </div>
                        )}
                        <div className="w-full col-span-12 md:col-span-5 flex flex-col gap-y-3.5 order-1 md:order-none">
                            <h2 className="w-full text-xl md:text-3xl text-slate-700 dark:text-slate-200 font-bold" data-aos="fade-right">
                                {secondSectionContent.title}
                            </h2>
                            {secondSectionContent.description && (
                                <p className="w-full p-5 rounded-lg text-xs md:text-base bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 leading-6" data-aos="zoom-out">
                                    {secondSectionContent.description}
                                </p>
                            )}
                            {secondSectionContent.actionBtnText && (
                                <button className="flex justify-center w-6/12 mx-auto rounded-md font-bold text-sm md:text-base py-2 md:py-2.5 bg-teal-900 dark:bg-teal-800 text-white hover:bg-teal-800 dark:hover:bg-teal-700 transition-colors" data-aos="fade-left">
                                    {secondSectionContent.actionBtnText}
                                </button>
                            )}
                        </div>
                    </section>
                )}
                {pricing.length > 0 && <ServicePricingPlansSlider order={""} slides={pricing} />}
                {subServices.length > 0 && (
                    <section className="w-full" id="logo-design-process-section">
                        <div className="w-full flex items-center justify-start gap-2">
                            <h3 className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 font-bold whitespace-nowrap" data-aos="fade-left">
                                پرطرفدار ترین خدمات <span className="text-teal-600 dark:text-teal-400">{title}</span> هیکاوب
                            </h3>
                            <span className="flex w-full rounded h-0.5 bg-[#0E443C] dark:bg-teal-600" data-aos="fade-right"></span>
                        </div>
                        <div
                            className="w-full py-7 px-5 md:py-12 md:px-12 bg-[#0E443CB2] dark:bg-slate-800/80 rounded-lg grid grid-cols-1 md:grid-cols-4 md:gap-x-12 gap-y-3.5 md:gap-y-7 mt-7 md:mt-14 relative"
                            data-aos="zoom-in"
                            data-aos-duration="1000"
                        >
                            {subServices?.map(({ iconSrc, text }, index) => (
                                <div
                                    className="w-full rounded-md flex justify-start items-center gap-0 md:gap-3.5 bg-[#F1F1F1] dark:bg-slate-700 shadow-md px-5 py-3.5 transition-all duration-300 ease-in-out hover:-translate-y-1.5 cursor-pointer"
                                    key={index}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 150}
                                >
                                    {iconSrc && iconSrc.trim() && (
                                        <Image src={iconSrc} width="0" height="0" className="w-10 h-auto mix-blend-multiply dark:mix-blend-normal" sizes="100vw" alt="" title="" />
                                    )}
                                    <span className="mx-auto text-slate-800 dark:text-slate-200">{text}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {process.length > 0 && (
                    <section className="w-full relative" id="logo-design-process-section">
                        <div className="w-full flex items-center justify-start gap-2">
                            <h3 className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 font-bold whitespace-nowrap" data-aos="fade-left">
                                فرایند <span className="text-teal-600 dark:text-teal-400">{title}</span>
                            </h3>
                            <span className="flex w-full rounded h-0.5 bg-[#0E443C] dark:bg-teal-600" data-aos="fade-right"></span>
                        </div>
                        <ServiceProcessSlider process={process} />
                    </section>
                )}
                {galleryImages.length > 0 && (
                    <section className="w-full relative" id="service-gallery-section">
                        <div className="w-full flex items-center justify-start gap-2 mb-5">
                            <h3 className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 font-bold whitespace-nowrap" data-aos="fade-left">
                                گالری تصاویر <span className="text-teal-600 dark:text-teal-400">{title}</span>
                            </h3>
                            <span className="flex w-full rounded h-0.5 bg-[#0E443C] dark:bg-teal-600" data-aos="fade-right"></span>
                        </div>
                        <div data-aos="zoom-in">
                            <GalleryLightbox images={galleryImages} />
                        </div>
                    </section>
                )}
                {finalDesc && (
                    <section className="w-full rounded-3xl bg-teal-500 dark:bg-teal-700" id="installment-terms" data-aos="zoom-out" data-aos-duration="1000">
                        <div className="w-full h-full p-3.5 md:py-7 md:px-14 grid grid-cols-12 gap-y-10 md:gap-y-0 gap-x-0 md:gap-x-10 place-items-center justify-between">
                            <div className="w-full col-span-12 md:col-span-7 flex flex-col justify-center items-start gap-3.5 rounded-3xl bg-white dark:bg-slate-800 p-3.5 md:px-12 md:py-7">
                                <h2 className="w-full text-xl md:text-3xl font-bold text-slate-700 dark:text-slate-200" data-aos="fade-down">
                                    {finalDesc.content.title}
                                </h2>
                                <p className="w-full text-sm md:text-lg text-slate-700 dark:text-slate-300 leading-7 md:leading-8" data-aos="fade-up">
                                    {finalDesc.content.text}
                                </p>
                            </div>
                            {finalDesc.image && finalDesc.image.trim() && (
                                <div className="w-full col-span-12 grid place-items-center md:col-span-5" data-aos="zoom-in">
                                    <Image src={finalDesc.image} width="0" height="0" sizes="100vw" className="w-full md:w-auto h-auto" alt={finalDesc.content.title} title={finalDesc.content.title} />
                                </div>
                            )}
                        </div>
                    </section>
                )}
                <section id="faqs-section" className="w-full flex flex-col items-center">
                    <h4
                        className="w-auto inline-flex gap-4 items-center justify-between rounded-xl text-base md:text-lg relative font-bold text-center p-2 text-white bg-[#005756] dark:bg-teal-800"
                        data-aos="fade-left"
                    >
                        شاید اینا سوالت باشه
                        <FaqOutlined />
                    </h4>
                    <div className="w-full md:max-w-4xl mx-auto mt-5 md:mt-10 flex flex-col gap-y-3">
                        {faqs.length > 0 ? (
                            faqs.map(({ question, answer }, index) => (
                                <Disclosure as="div" className="shadow-inner bg-[#F4F4F4] dark:bg-slate-800 rounded-xl" defaultOpen={index === 0 ? true : false} key={index} data-aos="fade-up" data-aos-delay={index * 150}>
                                    <DisclosureButton className="bg-[#A5D1D1] dark:bg-teal-700 rounded-xl py-2.5 md:py-3 px-3 text-base md:text-lg text-slate-800 dark:text-slate-100 hover:bg-[#8fc0c0] dark:hover:bg-teal-600 transition-colors">{question}</DisclosureButton>
                                    <DisclosurePanel className="p-3 text-sm h-auto md:text-base text-[#0E443C] dark:text-slate-300 leading-7">{answer}</DisclosurePanel>
                                </Disclosure>
                            ))
                        ) : (
                            <p className="text-center text-slate-500 dark:text-slate-400 py-5">سوالات متداول در حال حاضر موجود نیست</p>
                        )}
                    </div>
                </section>
                
                {/* Sticky Consultation Box */}
                <ServiceConsultationBox serviceName={title} serviceSlug={slug} serviceId={service?._id || service?.id} />
            </main>
        </>
    );
};

export default SingleServiceDetailsPage;
