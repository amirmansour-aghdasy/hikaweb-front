import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { services } from "@/__mocks__/services";
import { PortfolioSlider } from "@/components/common";
import { ServicePricingPlansSlider } from "@/components/sliders";

const SingleServiceDetailsPage = async ({ params }) => {
    const { slug } = await params;

    const {
        title,
        mainBanner,
        mainContent: { firstSection, secondSection },
        pricing,
        subServices,
        process,
    } = services[slug];

    return (
        <main className="w-full py-5 md:py-14 flex flex-col gap-10 md:gap-14" id={`${slug}-service-main-content`}>
            <Image src={mainBanner} width="0" height="0" sizes="100vw" className="w-full h-32 md:h-auto" alt={title} title={title} />
            <section className="w-full grid grid-cols-12 gap-7 place-items-center">
                <div className="w-full col-span-12 md:col-span-5 flex flex-col gap-y-3.5">
                    <h2 className="w-full text-xl md:text-3xl text-slate-700 font-bold">{firstSection?.content?.title && firstSection.content.title}</h2>
                    <p className="w-full p-5 rounded-lg text-xs md:text-base bg-slate-100 text-slate-700 leading-6">{firstSection?.content?.description && firstSection.content.description}</p>
                    <button className="flex justify-center w-6/12 ml-auto rounded-md font-bold text-sm md:text-base py-2 md:py-2.5 bg-teal-900 text-white">
                        {firstSection?.content?.actionBtnText && firstSection.content.actionBtnText}
                    </button>
                </div>
                <div className="w-full col-span-12 md:col-span-7">
                    <PortfolioSlider order={firstSection?.slides && firstSection.slides.length} slides={firstSection?.slides && firstSection.slides} />
                </div>
            </section>
            <section className="w-full grid grid-cols-12 gap-7 place-items-center">
                <div className="w-full col-span-12 md:col-span-7">
                    <PortfolioSlider order={secondSection?.slides && secondSection.slides.length} slides={secondSection?.slides && secondSection.slides} />
                </div>
                <div className="w-full col-span-12 md:col-span-5 flex flex-col gap-y-3.5 order-1 md:order-none">
                    <h2 className="text-xl md:text-3xl text-slate-700 font-bold">{secondSection?.content?.title && secondSection.content.title}</h2>
                    <p className="w-full p-5 rounded-lg text-xs md:text-base bg-slate-100 text-slate-700 leading-6">{secondSection?.content?.description && secondSection.content.description}</p>
                    <button className="flex justify-center w-6/12 ml-auto rounded-md font-bold text-sm md:text-base py-2 md:py-2.5 bg-teal-900 text-white">
                        {secondSection?.content?.actionBtnText && secondSection.content.actionBtnText}
                    </button>
                </div>
            </section>
            {pricing && <ServicePricingPlansSlider order={""} slides={pricing} />}
            {subServices && (
                <section className="w-full" id="logo-design-process-section">
                    <div className="w-full flex items-center justify-start gap-2">
                        <h3 className="text-xl md:text-2xl text-slate-700 font-bold whitespace-nowrap">
                            پرطرفدار ترین خدمات <span className="text-teal-600">{title}</span> هیکاوب
                        </h3>
                        <span className="flex w-full rounded h-0.5 bg-[#0E443C]"></span>
                    </div>
                    <div className="w-full py-7 px-5 md:py-12 md:px-12 bg-[#0E443CB2] rounded-lg grid grid-cols-1 md:grid-cols-4 md:gap-x-12 gap-y-3.5 md:gap-y-7 mt-7 md:mt-14 relative">
                        {subServices?.map(({ iconSrc, text }, index) => (
                            <div
                                className="w-full rounded-md flex justify-start items-center gap-0 md:gap-3.5 bg-[#F1F1F1] shadow-md px-5 py-3.5 transition-all duration-300 ease-in-out hover:-translate-y-1.5 cursor-pointer"
                                key={index}
                            >
                                <Image src={iconSrc} width="0" height="0" className="w-10 h-auto" sizes="100vw" alt="" title="" />
                                <span className="mx-auto">{text}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {process && (
                <section className="w-full" id="logo-design-process-section">
                    <div className="w-full flex items-center justify-start gap-2">
                        <h3 className="text-xl md:text-2xl text-slate-700 font-bold whitespace-nowrap">
                            فرایند <span className="text-teal-600">{title}</span>
                        </h3>
                        <span className="flex w-full rounded h-0.5 bg-[#0E443C]"></span>
                    </div>
                    <div className="w-full flex md:grid md:grid-cols-5 gap-3.5 md:gap-16 mt-7 md:mt-14 overflow-x-scroll md:overflow-x-visible snap-x snap-mandatory scroll-smooth pb-7 md:pb-0">
                        {process.map(({ title, iconHref, text }, index) => (
                            <div className="min-w-[75%] snap-center flex flex-col" key={index}>
                                <span className="flex justify-center rounded-t-2xl items-center text-xl font-bold text-slate-700 text-center py-5 bg-white shadow-inner-2">{title}</span>
                                <div className="flex flex-col w-full h-full rounded-b-2xl shadow-inner-3 gap-y-6 relative bg-[#008987] px-6 py-7 before:content-[''] before:absolute before:-bottom-3.5 before:rotate-45 before:w-7 before:h-7 before:left-1/2 before:-translate-x-1/2 before:bg-[#008987]">
                                    <Image src={iconHref} width="0" height="0" sizes="100vw" className="w-10 h-auto mx-auto" alt="" title="" />
                                    <p className="text-sm text-justify text-white leading-6">{text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
};

export default SingleServiceDetailsPage;
