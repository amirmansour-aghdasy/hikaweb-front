import Link from "next/link";
import Image from "next/image";

import { logoDesignFaqs } from "@/lib/constants/faq";
import { logoDesignProcessContent } from "@/lib/constants";
import { FaqsSection, PortfolioSlider } from "@/components/common";

const first = [
    {
        src: "/assets/portfolio/logo/logo-design-1.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-2.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-3.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-4.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-5.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-6.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-7.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-8.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-9.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-10.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-11.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-12.png",
        alt: "",
        title: "",
    },
];
const second = [
    {
        src: "/assets/portfolio/logo/logo-design-13.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-14.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-15.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-16.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-17.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-18.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-19.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-20.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-21.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-22.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-23.png",
        alt: "",
        title: "",
    },
    {
        src: "/assets/portfolio/logo/logo-design-24.png",
        alt: "",
        title: "",
    },
];

const LogoDesignServicePage = () => {
    return (
        <main className="w-full py-5 md:py-14 flex flex-col gap-10 md:gap-14">
            <Image src="/assets/banners/logo-design.webp" width="0" height="0" sizes="100vw" className="w-full h-32 md:h-auto" alt="طراحی لوگو" title="طراحی لوگو" />
            <section id="standard-logo-experience-section" className="w-full grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="w-full md:col-span-5 flex flex-col gap-y-3.5">
                    <h3 className="text-xl md:text-3xl font-bold text-slate-700">تجربه ی داشتن لوگوی استاندارد و حرفه ای</h3>
                    <p className="w-full text-xs md:text-base text-slate-700 leading-6 md:leading-7 p-3.5 bg-slate-100 rounded-md">
                        طراحی لوگو قدم اول کسب و کار شما برای شروع برندسازی هستش! ما همواره به کسب و کارها توصیه میکنیم طراحی لوگوی خودرا بسیار جدی بگیرن چون قراره این لوگو سالیان سالیان کسب و کار
                        شمارو به مخاطبتون یادآوری کنه ! هیکاوب در کنار شماست تا با سابقه طراحی لوگوی بیش از 60 برند ایرانی این قدم رو برای شما محکم برداره ! در کنار تجربه ما در زمینه طراحی لوگو و
                        برندسازی ، رعایت استاندارد های طراحی و استفاده از ابزار اصلی طراحی لوگو یعنی ایلوستریتور و توجه به هویت برند و رنگ سازمانی میتونه تضمین یه همکاری خوب بین ما و شما باشه برای
                        دریافت مشاوره رایگان میتونید با ما در ارتباط باشید .
                    </p>
                    <Link href="" className="flex justify-center w-6/12 ml-auto rounded-md font-bold text-sm md:text-base py-2 md:py-2.5 bg-teal-900 text-white">
                        ثبت سفارش
                    </Link>
                </div>
                <div className="w-full md:col-span-7">
                    <PortfolioSlider order={5} slides={first} />
                </div>
            </section>
            <section id="hika-printing-difference-section" className="w-full grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="w-full md:col-span-7 order-2 md:order-none">
                    <PortfolioSlider order={5} slides={second} />
                </div>
                <div className="w-full md:col-span-5 flex flex-col gap-y-3.5 order-1 md:order-none">
                    <h3 className="text-xl md:text-3xl font-bold text-slate-700">تفاوت طراحی لوگوی هیکاوب</h3>
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
                    <h3 className="text-xl md:text-2xl text-slate-700 font-bold whitespace-nowrap">فرایند طراحی لوگو</h3>
                    <span className="flex w-full rounded h-0.5 bg-[#0E443C]"></span>
                </div>
                <div className="w-full flex md:grid md:grid-cols-5 gap-3.5 md:gap-16 mt-7 md:mt-14 overflow-x-scroll md:overflow-x-visible snap-x snap-mandatory scroll-smooth pb-7 md:pb-0">
                    {logoDesignProcessContent.map(({ title, iconHref, text }, index) => (
                        <div className="min-w-[75%] snap-center flex flex-col" key={index}>
                            <span className="flex justify-center rounded-t-2xl items-center text-xl font-bold text-slate-700 text-center py-5 bg-white shadow-inner-2">{title}</span>
                            <div className="flex flex-col w-full h-full rounded-b-2xl shadow-inner-3 gap-y-6 relative bg-[#008987] px-6 py-7 before:content-[''] before:absolute before:-bottom-3.5 before:rotate-45 before:w-7 before:h-7 before:left-1/2 before:-translate-x-1/2 before:bg-[#008987]">
                                <Image src={iconHref} width="0" height="0" sizes="100vw" className="w-10 h-10 mx-auto" alt="" title="" />
                                <p className="text-sm text-justify text-white leading-6">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <FaqsSection faqs={logoDesignFaqs} />
        </main>
    );
};

export default LogoDesignServicePage;
