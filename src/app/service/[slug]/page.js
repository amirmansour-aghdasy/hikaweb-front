import Head from "next/head";
import Image from "next/image";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";

import { FaqOutlined } from "@/lib/icons/svg";
import { services } from "@/__mocks__/services";
import { PortfolioSlider } from "@/components/common";
import { ServicePricingPlansSlider, ServiceProcessSlider } from "@/components/sliders";

const SingleServiceDetailsPage = async ({ params }) => {
    const { slug } = await params;

    const {
        title,
        mainBanner,
        mainContent: { firstSection, secondSection },
        pricing,
        subServices,
        process,
        finalDesc,
        faqs,
    } = services[slug];

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

    return (
        <>
            <Head>
                <title>خدمات ${title} - آژانس دیجیتال مارکتینگ هیکاوب</title>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            </Head>
            <main className="w-full py-5 md:py-14 flex flex-col gap-10 md:gap-14" id={`${slug}-service-main-content`}>
                <Image src={mainBanner} width={1346} height={298} sizes="100vw" className="w-full h-32 md:h-auto" alt={title} title={title} data-aos="zoom-in" priority />
                <section className="w-full grid grid-cols-12 gap-7 place-items-center">
                    <div className="w-full col-span-12 md:col-span-5 flex flex-col gap-y-3.5">
                        <h2 className="w-full text-xl md:text-3xl text-slate-700 font-bold" data-aos="fade-left">
                            {firstSection?.content?.title && firstSection.content.title}
                        </h2>
                        <p className="w-full p-5 rounded-lg text-xs md:text-base bg-slate-100 text-slate-700 leading-6" data-aos="zoom-in">
                            {firstSection?.content?.description && firstSection.content.description}
                        </p>
                        <button className="flex justify-center w-6/12 ml-auto rounded-md font-bold text-sm md:text-base py-2 md:py-2.5 bg-teal-900 text-white" data-aos="fade-right">
                            {firstSection?.content?.actionBtnText && firstSection.content.actionBtnText}
                        </button>
                    </div>
                    <div className="w-full col-span-12 md:col-span-7" data-aos="zoom-out">
                        <PortfolioSlider order={firstSection?.slides && firstSection.slides.length} slides={firstSection?.slides && firstSection.slides} />
                    </div>
                </section>
                <section className="w-full grid grid-cols-12 gap-7 place-items-center">
                    <div className="w-full col-span-12 md:col-span-7 order-2 md:order-none" data-aos="zoom-in">
                        <PortfolioSlider order={secondSection?.slides && secondSection.slides.length} slides={secondSection?.slides && secondSection.slides} />
                    </div>
                    <div className="w-full col-span-12 md:col-span-5 flex flex-col gap-y-3.5 order-1 md:order-none">
                        <h2 className="w-full text-xl md:text-3xl text-slate-700 font-bold" data-aos="fade-right">
                            {secondSection?.content?.title && secondSection.content.title}
                        </h2>
                        <p className="w-full p-5 rounded-lg text-xs md:text-base bg-slate-100 text-slate-700 leading-6" data-aos="zoom-out">
                            {secondSection?.content?.description && secondSection.content.description}
                        </p>
                        <button className="flex justify-center w-6/12 ml-auto rounded-md font-bold text-sm md:text-base py-2 md:py-2.5 bg-teal-900 text-white" data-aos="fade-left">
                            {secondSection?.content?.actionBtnText && secondSection.content.actionBtnText}
                        </button>
                    </div>
                </section>
                {pricing.length > 1 && <ServicePricingPlansSlider order={""} slides={pricing} />}
                {subServices.length > 1 && (
                    <section className="w-full" id="logo-design-process-section">
                        <div className="w-full flex items-center justify-start gap-2">
                            <h3 className="text-xl md:text-2xl text-slate-700 font-bold whitespace-nowrap" data-aos="fade-left">
                                پرطرفدار ترین خدمات <span className="text-teal-600">{title}</span> هیکاوب
                            </h3>
                            <span className="flex w-full rounded h-0.5 bg-[#0E443C]" data-aos="fade-right"></span>
                        </div>
                        <div className="w-full py-7 px-5 md:py-12 md:px-12 bg-[#0E443CB2] rounded-lg grid grid-cols-1 md:grid-cols-4 md:gap-x-12 gap-y-3.5 md:gap-y-7 mt-7 md:mt-14 relative" data-aos="zoom-in" data-aos-duration="1000">
                            {subServices?.map(({ iconSrc, text }, index) => (
                                <div
                                    className="w-full rounded-md flex justify-start items-center gap-0 md:gap-3.5 bg-[#F1F1F1] shadow-md px-5 py-3.5 transition-all duration-300 ease-in-out hover:-translate-y-1.5 cursor-pointer"
                                    key={index}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 150}
                                >
                                    <Image src={iconSrc} width="0" height="0" className="w-10 h-auto mix-blend-multiply" sizes="100vw" alt="" title="" />
                                    <span className="mx-auto">{text}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {process.length > 1 && (
                    <section className="w-full relative" id="logo-design-process-section">
                        <div className="w-full flex items-center justify-start gap-2">
                            <h3 className="text-xl md:text-2xl text-slate-700 font-bold whitespace-nowrap" data-aos="fade-left">
                                فرایند <span className="text-teal-600">{title}</span>
                            </h3>
                            <span className="flex w-full rounded h-0.5 bg-[#0E443C]" data-aos="fade-right"></span>
                        </div>
                        <ServiceProcessSlider process={process} />
                    </section>
                )}
                {finalDesc && (
                    <section className="w-full rounded-3xl bg-teal-500" id="installment-terms" data-aos="zoom-out" data-aos-duration="1000">
                        <div className="w-full h-full p-3.5 md:py-7 md:px-14 grid grid-cols-12 gap-y-10 md:gap-y-0 gap-x-0 md:gap-x-10 place-items-center justify-between">
                            <div className="w-full col-span-12 md:col-span-7 flex flex-col justify-center items-start gap-3.5 rounded-3xl bg-white p-3.5 md:px-12 md:py-7">
                                <h2 className="w-full text-xl md:text-3xl font-bold text-slate-700" data-aos="fade-down">{finalDesc.content.title}</h2>
                                <p className="w-full text-sm md:text-lg text-slate-700 leading-7 md:leading-8" data-aos="fade-up">{finalDesc.content.text}</p>
                            </div>
                            <div className="w-full col-span-12 grid place-items-center md:col-span-5" data-aos="zoom-in">
                                <Image src={finalDesc.image} width="0" height="0" sizes="100vw" className="w-full md:w-auto h-auto" alt={finalDesc.content.title} title={finalDesc.content.title} />
                            </div>
                        </div>
                    </section>
                )}
                <section id="faqs-section" className="w-full flex flex-col items-center">
                    <h4
                        className="w-auto inline-flex gap-4 items-center justify-between rounded-xl text-base md:text-lg relative font-bold text-center p-2 text-white bg-[#005756]"
                        data-aos="fade-left"
                    >
                        شاید اینا سوالت باشه
                        <FaqOutlined />
                    </h4>
                    <div className="w-full md:max-w-4xl mx-auto mt-5 md:mt-10 flex flex-col gap-y-3">
                        {faqs.map(({ question, answer }, index) => (
                            <Disclosure as="div" className="shadow-inner bg-[#F4F4F4] rounded-xl" defaultOpen={index === 0 ? true : false} key={index} data-aos="fade-up" data-aos-delay={index * 150}>
                                <DisclosureButton className="bg-[#A5D1D1] rounded-xl py-2.5 md:py-3 px-3 text-base md:text-lg">{question}</DisclosureButton>
                                <DisclosurePanel className="p-3 text-sm h-auto md:text-base text-[#0E443C] leading-7">{answer}</DisclosurePanel>
                            </Disclosure>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
};

export default SingleServiceDetailsPage;
