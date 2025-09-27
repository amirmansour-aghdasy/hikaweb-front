import Link from "next/link";
import Image from "next/image";

import { printingFaqs } from "@/lib/constants/faq";
import { printingSubServicesContent } from "@/lib/constants";
import { FaqsSection, PortfolioSlider } from "@/components/common";

const first = [
    {
        src: "/assets/portfolio/printing/printing-1.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-2.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-3.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-4.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-5.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-6.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-7.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-8.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-9.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-10.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-11.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-12.png",
        alt: "",
        title: "",
    },
];
const second = [
    {
        src: "/assets/portfolio/printing/printing-13.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-14.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-15.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-16.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-17.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-18.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-19.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-20.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-21.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-22.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-23.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/printing/printing-24.png",
        alt: "",
        title: "",
    },
];

const PrintingServicePage = () => {
    return (
        <main className="w-full py-5 md:py-14 flex flex-col gap-10 md:gap-14">
            <Image src="/assets/banners/printing.webp" width="0" height="0" sizes="100vw" className="w-full h-32 md:h-auto" alt="چاپ وتبلیغات محیطی" title="چاپ وتبلیغات محیطی" />
            <section id="from-designing-to-printing-section" className="w-full grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="w-full md:col-span-5 flex flex-col gap-y-3.5">
                    <h3 className="text-xl md:text-3xl font-bold text-slate-700">از طراحی تا چاپ کسب و کارت با ما !</h3>
                    <p className="w-full text-xs md:text-base text-slate-700 leading-6 md:leading-7 p-3.5 bg-slate-100 rounded-md">
                        هیکاوب با بیش از 4 سال سابقه در زمینه طراحی و چاپ تبلیغات محیطی به شما این تضمین را میدهد که امور چاپ کسب و کارتان با بهترین کیفیت انجام شود . بیش از 40 نمونه کار در زمینه چاپ
                        و تبلیغات محیطی و همکاری با بیش از 20 برند نشان دهنده اعتبار و سابقه ما در این زمینه است . خلاقیت در طراحی بسیار اهمیت دارد و هدف ما صرفا چاپ نیست ، در مرحله اول طراحی شیک و
                        حرفه ای تاثیر بسیاری زیادی در دید مخاطب شما به کسب و کارتان دارد و در مرحله دوم چاپ و کیفیت رنگ و رعایت اصول استاندارد تکمیل کننده یک چاپ موفق است .
                    </p>
                    <Link href="" className="flex justify-center w-6/12 ml-auto rounded-md font-bold text-base py-2.5 bg-teal-900 text-white">
                        ثبت سفارش
                    </Link>
                </div>
                <div className="w-full md:col-span-7">
                    <PortfolioSlider order={5} slides={first} />
                </div>
            </section>
            <section id="hika-logo-design-difference-section" className="w-full grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="w-full md:col-span-7 order-2 md:order-none">
                    <PortfolioSlider order={5} slides={second} />
                </div>
                <div className="w-full md:col-span-5 flex flex-col gap-y-3.5 order-1 md:order-none">
                    <h3 className="text-xl md:text-3xl font-bold text-slate-700">تفاوت چاپ هیکاوب در چیست؟</h3>
                    <p className="w-full text-xs md:text-base text-slate-700 leading-6 md:leading-7 p-3.5 bg-slate-100 rounded-md">
                        تفاوت ما نظارت دقیق و دلسوزانه بر چاپ و تبلیغات شماست . هدف ما این است که هر کدام از اقلام چاپی مورد نیاز کسب و کارتان مثل : کارت ویزیت ، مجله ، بروشور ، ست اداری و .... با
                        کیفیت بالایی به دست شما برسد . تفاوت دیگر هیکاوب در نظارت دقیق بر فرایند طراحی و شناسایی دقیق هدف شما از چاپ میباشد که در مشاوره رایگان آنالیز میگردد . با به شما مشاوره میدهیم
                        تا بتوانیم بهترین پیشنهاد برای تبلیغات محیطی بر اساس اهداف سب و کارتان را به شما بدهیم .
                    </p>
                    <Link href="" className="flex justify-center w-6/12 ml-auto rounded-md font-bold text-base py-2.5 bg-teal-900 text-white">
                        ثبت سفارش
                    </Link>
                </div>
            </section>
            <section className="w-full" id="logo-design-process-section">
                <div className="w-full flex items-center justify-start gap-2">
                    <h3 className="text-xl md:text-2xl text-slate-700 font-bold whitespace-nowrap">پرطرفدار ترین خدمات چاپ</h3>
                    <span className="flex w-full rounded h-0.5 bg-[#0E443C]"></span>
                </div>
                <div className="w-full py-7 px-5 md:py-12 md:px-12 bg-[#0E443CB2] rounded-lg grid grid-cols-1 md:grid-cols-4 md:gap-x-12 gap-y-3.5 md:gap-y-7 mt-7 md:mt-14 relative">
                    {printingSubServicesContent.map(({ iconHref, text }, index) => (
                        <div
                            className="w-full rounded-md flex justify-start items-center gap-0 md:gap-3.5 bg-[#F1F1F1] shadow-md px-5 py-3.5 transition-all duration-300 ease-in-out hover:-translate-y-1.5 cursor-pointer"
                            key={index}
                        >
                            <Image src={iconHref} width="0" height="0" className="w-8 md:w-auto h-auto" sizes="100vw" alt="" title="" />
                            <span className="mx-auto">{text}</span>
                        </div>
                    ))}
                    <Link
                        href=""
                        className="text-white text-xs md:text-base px-5 py-3.5 bg-[#6E9690] border border-[#0E443C] absolute rounded-md shadow-md -bottom-6 left-1/2 transform -translate-x-1/2"
                    >
                        مشاهده نمونه کار های بیشتر
                    </Link>
                </div>
            </section>
            <FaqsSection faqs={printingFaqs} />
        </main>
    );
};

export default PrintingServicePage;
