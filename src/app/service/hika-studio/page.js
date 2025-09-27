import Link from "next/link";
import Image from "next/image";

import { hikaStudioFaqs } from "@/lib/constants/faq";
import { hikaStudioSubServicesContent } from "@/lib/constants";
import { FaqsSection, PortfolioSlider } from "@/components/common";
import { hika_studio_portfolio } from "@/__mocks__/services-portfolio";

const HikaStudioServicePage = () => {
    return (
        <main className="w-full py-5 md:py-14 flex flex-col gap-10 md:gap-14">
            <Image src="/assets/banners/hika-studio.webp" sizes="100vw" width="0" height="0" className="w-full h-32 md:h-auto" alt="هیکا استودیو" title="هیکا استودیو" data-aos="zoom-in" />
            <section className="w-full grid grid-cols-12 gap-7 place-items-center">
                <div className="w-full col-span-12 md:col-span-5 flex flex-col gap-y-3.5">
                    <h2 className="w-full text-xl md:text-3xl text-slate-700 font-bold">چرا هیکااستودیو فرق داره؟</h2>
                    <p className="w-full p-5 rounded-lg text-xs md:text-base bg-slate-100 text-slate-700 leading-6">
                        خیلی از کسب و کارا دغدغه تولید محتوای سایت و فضای مجازیو دارند و ما بهت میگیم خیالت تخت ! حالا چرا ؟! چون از تولید محتوا تا تدوین و صداگذاری ویدیو هات رو میتونیم انجام بدیم .
                        ما داخل هیکا استودیو از تجهیزات نورپردازی تا میکروفون سیمی و بی سیم و در کنار این ها از پرده سبز تا پرده مخملی مخصوص عکاسی حرفه ای و باکس عکاسی محصول حرفه ای رو فراهم کردیم تا
                        شما با خیال راحت تولید محتوای خودرا انجام بدهید و در کنار این ها ما میتونیم سناریو نویسی و تدوین و حتی پخش محتوای شمارو نیز انجام بدیم . حالا دیدی هیکا استودیو چرا فرق داره؟
                        چون دیگه خیالتو از صفرتاصد تولید محتوای کسب و کارت راحت میکنه !
                    </p>
                    <Link href="" className="flex justify-center w-6/12 ml-auto rounded-md font-bold text-sm md:text-base py-2 md:py-2.5 bg-teal-900 text-white">
                        ثبت سفارش
                    </Link>
                </div>
                <div className="w-full col-span-12 md:col-span-7">
                    <PortfolioSlider order={6} slides={hika_studio_portfolio.first} />
                </div>
            </section>
            <section className="w-full grid grid-cols-12 gap-7 place-items-center">
            <div className="w-full col-span-12 md:col-span-7">
                    <PortfolioSlider order={6} slides={hika_studio_portfolio.second} />
                </div>
                <div className="w-full col-span-12 md:col-span-5 flex flex-col gap-y-3.5 order-1 md:order-none">
                    <h2 className="text-xl md:text-3xl text-slate-700 font-bold">عکاسی حرفه ای محصول ، اونم با باکس محصول</h2>
                    <p className="w-full p-5 rounded-lg text-xs md:text-base bg-slate-100 text-slate-700 leading-6">
                        محصولتو تهیه و تولید کردی نمیدونی چجوری به مخاطبت نشونش بدی ؟ خب اینم براش تو استودیو هیکاوب چاره داریم ، حالا چطور ؟! ما توی استودیو باکس های محصولیو تدارک دیدیم و میتوانیم
                        عکاسی محصول شمارا انجام بدیم و بعد از عکاسی محصول و عکس های ادیت شدش رو براتون بفرستیم ! کارو برات راحت کردیم میدونی چرا ؟ تو خونه نشستی و محصولتو ارسال میکنی و ضمانت ارسال
                        محصولتو دریافت میکنی ، بعدشم عکاسی توسط تیم هیکاوب انجام میشه و محصول به همراه عکس های روتوش شدش برات ارسال میکنیم تا راحت به مخاطبت نشونش بدی !{" "}
                    </p>
                    <Link href="" className="flex justify-center w-6/12 ml-auto rounded-md font-bold text-sm md:text-base py-2 md:py-2.5 bg-teal-900 text-white">
                        ثبت سفارش
                    </Link>
                </div>
            </section>
            <section className="w-full" id="logo-design-process-section">
                <div className="w-full flex items-center justify-start gap-2">
                    <h3 className="text-xl md:text-2xl text-slate-700 font-bold whitespace-nowrap">پرطرفدار ترین خدمات وب هیکاوب</h3>
                    <span className="flex w-full rounded h-0.5 bg-[#0E443C]"></span>
                </div>
                <div className="w-full py-7 px-5 md:py-12 md:px-12 bg-[#0E443CB2] rounded-lg grid grid-cols-1 md:grid-cols-4 md:gap-x-12 gap-y-3.5 md:gap-y-7 mt-7 md:mt-14 relative">
                    {hikaStudioSubServicesContent.map(({ iconSrc, text }, index) => (
                        <div
                            className="w-full rounded-md flex justify-start items-center gap-0 md:gap-3.5 bg-[#F1F1F1] shadow-md px-5 py-3.5 transition-all duration-300 ease-in-out hover:-translate-y-1.5 cursor-pointer"
                            key={index}
                        >
                            <Image src={iconSrc} width="0" height="0" className="w-8 md:w-auto h-auto" sizes="100vw" alt="" title="" />
                            <span className="mx-auto">{text}</span>
                        </div>
                    ))}
                </div>
            </section>
            <FaqsSection faqs={hikaStudioFaqs} />
        </main>
    );
};

export default HikaStudioServicePage;
