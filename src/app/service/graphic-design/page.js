import Link from "next/link";
import Image from "next/image";

import { graphicDesignFaqs } from "@/lib/constants/faq";
import { graphicDesignSubservices } from "@/lib/constants";
import { FaqsSection, PortfolioSlider } from "@/components/common";

const first = [
    {
        src: "/assets/portfolio/graphic-design/graphic-design-1.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-2.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-3.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-4.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-5.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-6.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-7.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-8.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-9.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-10.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-11.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-12.png",
        alt: "",
        title: "",
    },
];
const second = [
    {
        src: "/assets/portfolio/graphic-design/graphic-design-13.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-14.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-15.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-16.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-17.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-18.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-19.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-20.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-21.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-22.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-23.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/graphic-design/graphic-design-24.png",
        alt: "",
        title: "",
    },
];

const GraphicDesignServicePage = () => {
    return (
        <main className="w-full py-5 md:py-14 flex flex-col gap-10 md:gap-14">
            <Image src="/assets/banners/graphic-design.webp" width="0" height="0" sizes="100vw" className="w-full h-32 md:h-auto" alt="طراحی لوگو" title="طراحی لوگو" />
            <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="w-full md:col-span-5 flex flex-col gap-y-3.5">
                    <h3 className="text-xl md:text-3xl font-bold text-slate-700">گرافیک ، هویت دیداری برند شما </h3>
                    <p className="w-full text-xs md:text-base text-slate-700 leading-6 md:leading-7 p-3.5 bg-slate-100 rounded-md">
                        شاید با خودتان بگویید گرافیک کجا میتواند برای برند من و کسب و کار من مفید باشد ، باید بگوییم شما هر محتوا و هر اطلاعاتی از برند خود منتشر کنید پای گرافیک در میان است ! به طور
                        کلی گرافیک کسب و کار شما از کاور پست هایتان در اینستاگرام را شامل میشود تا کارت ویزیت و به طور کلی قالبی از رنگ ها و اشکال که در آن اطلاعات کسب و کارتان را ارائه میدهید .
                        گرافیک را جدی بگیرید چون میتواند بسیار بسیار در دیدگاه مخاطبینتان از برند شما تاثیر گذار باشد ، ما اینجاییم تا با سابقه طولانی در امور گرافیکی خیالتان را از بابت امور گرافیکی
                        کسب و کارتان راحت کنیم .
                    </p>
                    <Link href="" className="flex justify-center w-6/12 ml-auto rounded-md font-bold text-sm md:text-base py-2 md:py-2.5 bg-teal-900 text-white">
                        ثبت سفارش
                    </Link>
                </div>
                <div className="w-full md:col-span-7">
                    <PortfolioSlider order={11} slides={first} />
                </div>
            </section>
            <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="w-full md:col-span-7 order-2 md:order-none">
                    <PortfolioSlider order={12} slides={second} />
                </div>
                <div className="w-full md:col-span-5 flex flex-col gap-y-3.5 order-1 md:order-none">
                    <h3 className="text-xl md:text-3xl font-bold text-slate-700">چرا تیم گرافیک هیکاوب</h3>
                    <p className="w-full text-xs md:text-base text-slate-700 leading-6 md:leading-7 p-3.5 bg-slate-100 rounded-md">
                        در مرحله نخست باید بگوییم تجربه و تضمین در زیبایی بصری کسب و کار شما ! بله تیم هیکاوب مفتخر بوده است تا با بیش از 40 برند ایرانی در زمینه گرافیک و هویت بصری همکاری کند . در
                        مرحله دوم باید دید و باور کرد ! بیش از 130 پروژه در زمینه گرافیک میتواند خیال شمارا از بابت کیفیت کار راحت کند ، در کنار این دو باید به سرعت عمل و تنوع بالای پروژه ها نیز اشاره
                        نمود . امیدواریم بتوانیم بهترین دید مخاطب و مشتری را به کسب و کارتان هدیه بدهیم .
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
                    {graphicDesignSubservices.map(({ iconHref, text }, index) => (
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
            <FaqsSection faqs={graphicDesignFaqs} />
        </main>
    );
};

export default GraphicDesignServicePage;
