import Link from "next/link";
import Image from "next/image";

import { FaqsSection } from "@/components/common";
import { webDesignFaqs } from "@/lib/constants/faq";
import { webDesignProcessContent, webDesignSubServicesContent } from "@/lib/constants";
import { WebDesignPortfolioPreviewSlider, WebDesignPricingPlansSection } from "@/components/pages/web-desing";

const WebDesignServicePage = () => {
    return (
        <main className="w-full py-5 md:py-14 flex flex-col gap-10 md:gap-14">
            <Image
                src="/assets/banners/web-design.webp"
                width="0"
                height="0"
                sizes="100vw"
                className="w-full h-32 md:h-auto"
                alt="طراحی سایت و برنامه نویسی وب"
                title="طراحی سایت و برنامه نویسی وب"
            />
            <section id="web-design-page-first-section" className="w-full grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-20">
                <div className="w-full h-full flex justify-center items-center">
                    <Image
                        src="/assets/images/web-design-page-first-section-img.jpg"
                        width="0"
                        height="0"
                        className="w-full h-auto"
                        sizes="100vw"
                        alt="سایت ، شناسنامه کسب و کار شماست"
                        title="سایت ، شناسنامه کسب و کار شماست"
                    />
                </div>
                <div className="w-full h-full flex flex-col justify-center gap-y-3.5">
                    <h3 className="text-xl md:text-3xl font-bold text-slate-700">سایت ، شناسنامه کسب و کار شما</h3>
                    <p className="w-full text-justify text-sm text-slate-700 leading-6 p-3.5 bg-slate-100 rounded-md">
                        طراحی سایت دیگر برای کسب و کار شما آپشن نیست ! بلکه ضرورتی برای کسب و کارتان است ، امروزه رقابت میان شما و رقبا صرفا به صورت سنتی نیست و شما باید در حوزه وب و دیجیتال نیز با
                        رقبا رقابت کنید ، ما بررسی کرده ایم و متوجه شدیم طبق آمار کسب و کارهایی که در حوزه وب فعالیت دارند و دارای وبسایتی استاندارد هستند تا 50 درصد اعتماد بییشتری در برابر مشتری بدست
                        می آورند . به همین دلیل و بر مبنای تجربه میگوییم سایت شناسنامه کسب و کار شماست و برای رقابت با رقبا بر سر مشتریان در حوزه وب باید وبسایتی استاندارد و حرفه ای داشته باشید.
                    </p>
                    <Link href="" className="flex justify-center w-5/12 ml-auto rounded-md font-bold text-base py-2.5 bg-teal-900 text-white">
                        ثبت سفارش
                    </Link>
                </div>
            </section>
            <section id="web-design-page-second-section" className="w-full grid grid-cols-1 md:grid-cols-2 gap-20">
                <div className="w-full h-full flex flex-col justify-center gap-y-3.5 order-2 md:order-none">
                    <h3 className="text-xl md:text-3xl font-bold text-slate-700">هر وبسایتی وب سایت نیست !</h3>
                    <p className="w-full text-justify text-sm text-slate-700 leading-6 p-3.5 bg-slate-100 rounded-md">
                        خلاصه بگوییم ، سعی کنید به هر قیمتی سایت نداشته باشید . برخی کسب و کارها برای داشتن صرفا یک صفحه در وب به قالب های آماده و سایت ساز ها روی می آورند در صورتی که این وبسایت شاید
                        به برند شما و کلاس کاری شما ضربه زننده باشه ، حالا چرا ؟ به دلیل محدودیت ها ی این سایت ها و مشکلات سئو و نداشتن رابط کاربری و محدودیت در ارائه خدمات و محصولات شما به مخاطب ! یک
                        وبسایت حرفه ای در قدم اول رابط کاربری مناسب رو در کنار گرافیکی حرفه ای دارد و نباید هیچگونه محدودیتی در نشان دادن خدمات شما به مخاطب و سئو داشته باشد و مخاطب از ورود به آن لذت
                        ببرد .
                    </p>
                    <Link href="" className="flex justify-center w-5/12 ml-auto rounded-md font-bold text-base py-2.5 bg-teal-900 text-white">
                        ثبت سفارش
                    </Link>
                </div>
                <div className="w-full h-full flex justify-center items-center order-1 md:order-none">
                    <Image
                        src="/assets/images/web-design-page-second-section-img.jpg"
                        width="0"
                        height="0"
                        className="w-full h-auto"
                        sizes="100vw"
                        alt="هر وبسایتی وب سایت نیست !"
                        title="هر وبسایتی وب سایت نیست !"
                    />
                </div>
            </section>
            <WebDesignPricingPlansSection />
            <section className="w-full" id="logo-design-process-section">
                <div className="w-full flex items-center justify-start gap-2">
                    <h3 className="text-xl md:text-2xl text-slate-700 font-bold whitespace-nowrap">پرطرفدار ترین خدمات وب هیکاوب</h3>
                    <span className="flex w-full rounded h-0.5 bg-[#0E443C]"></span>
                </div>
                <div className="w-full py-7 px-5 md:py-12 md:px-12 bg-[#0E443CB2] rounded-lg grid grid-cols-1 md:grid-cols-4 md:gap-x-12 gap-y-3.5 md:gap-y-7 mt-7 md:mt-14 relative">
                    {webDesignSubServicesContent.map(({ iconHref, text }, index) => (
                        <div
                            className="w-full rounded-md flex justify-start items-center gap-0 md:gap-3.5 bg-[#F1F1F1] shadow-md px-5 py-3.5 transition-all duration-300 ease-in-out hover:-translate-y-1.5 cursor-pointer"
                            key={index}
                        >
                            <Image src={iconHref} width="0" height="0" className="w-8 md:w-auto h-auto" sizes="100vw" alt="" title="" />
                            <span className="mx-auto">{text}</span>
                        </div>
                    ))}
                </div>
            </section>
            <section className="w-full" id="logo-design-process-section">
                <div className="w-full flex items-center justify-start gap-2">
                    <h3 className="text-xl md:text-2xl text-slate-700 font-bold whitespace-nowrap">فرایند طراحی و برنامه نویسی وب</h3>
                    <span className="flex w-full rounded h-0.5 bg-[#0E443C]"></span>
                </div>
                <div className="w-full flex md:grid md:grid-cols-5 gap-3.5 md:gap-16 mt-7 md:mt-14 overflow-x-scroll md:overflow-x-visible snap-x snap-mandatory scroll-smooth pb-7 md:pb-0">
                    {webDesignProcessContent.map(({ title, iconHref, text }, index) => (
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
            <section className="w-full flex flex-wrap items-center justify-center md:justify-between gap-0 md:gap-10 rounded-2xl md:rounded-[43px] bg-teal-500 pt-3.5 md:pt-0" id="installment-terms">
                <div className="w-11/12 md:w-5/12 flex flex-col justify-center items-start gap-2.5 rounded-2xl md:rounded-[41px] bg-white p-3.5 md:px-20 md:py-7 md:mr-28">
                    <h2 className="text-xl md:text-3xl font-bold text-slate-700">شرایط اقساط هیکاوب</h2>
                    <p className="text-sm md:text-lg text-slate-700 leading-7 md:leading-6">
                        شاید خیلیامون از هزینه های گزاف طراحی وبسایت و نحوه پرداختش دید خوبی نداشته باشیم ، باید بگوییم که نگران این موضوع نباشید هیکاوب بر اساس توانایی پرداخت شما شرایط رو فراهم میکند
                        تا شما عزیزان با شرایطی عالی صاحب یک سایت مناسب برای کسب و کارتان شوید .
                    </p>
                </div>
                <div className=" pt-5">
                    <Image
                        src="/assets/images/installment-terms.png"
                        width="0"
                        height="0"
                        sizes="100vw"
                        className="w-[583px] h-auto md:h-[332px]"
                        alt="شرایط اقساط هیکاوب"
                        title="شرایط اقساط هیکاوب"
                    />
                </div>
            </section>
            <WebDesignPortfolioPreviewSlider />
        </main>
    );
};

export default WebDesignServicePage;
