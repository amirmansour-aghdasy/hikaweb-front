import Link from "next/link";
import Image from "next/image";

import { info_preview } from "@/lib/constants";
import { AnimatedText } from "@/components/ui";
import { CounselingForm } from "@/components/forms";
import { InfoPreviewCard } from "@/components/cards";
import { InstagramOutlined, RubikaFill, TelegramFill, WhatsAppOutlined } from "@/lib/icons";
import { SlidersSection, CommentsSection, ServicesSection, MagPreviewSection, BrandsSliderSection } from "@/components/pages/home";

const HomePage = () => {
    return (
        <main className="w-full flex flex-col gap-10 mb-5 md:my-14 overflow-x-hidden md:overflow-x-visible" id="home-page-main">
            <SlidersSection />
            <section id="introduction-section" className="w-full grid grid-cols-12 gap-7 md:gap-0">
                <div className="col-span-12 md:col-span-6 flex flex-col items-start justify-center order-2 md:order-1">
                    <h1 className="text-2xl md:text-4xl text-teal-500 font-bold" data-aos="fade-up">
                        <AnimatedText strings={["آژانس دیجیتال مارکتینگ هیکاوب"]} typeSpeed={60} loop={false} startDelay={1500} hideCursorOnEnd={true} />
                    </h1>
                    <h3 className="text-sm md:text-lg text-slate-700 mt-1.5 font-semibold h-10 md:h-auto" data-aos="fade-down">
                        کیفیت امری تبلیغاتی نیست میکوشیم در{" "}
                        <AnimatedText
                            strings={[
                                {
                                    text: "سئو و بینه سازی",
                                    href: "/service/seo",
                                },
                                {
                                    text: "هیکا استودیو",
                                    href: "/service/hika-studio",
                                },
                                {
                                    text: "طراحی گرافیک",
                                    href: "/service/graphic-design",
                                },
                                {
                                    text: "چاپ و تبلیغات محیطی",
                                    href: "/service/printing",
                                },
                                {
                                    text: "مدیریت شبکه های اجتماعی",
                                    href: "/service/social-media-management",
                                },
                                {
                                    text: "تولید محتوا و تدوین",
                                    href: "/service/content-production-and-editing",
                                },
                                {
                                    text: "طراحی لوگو و برند سازی",
                                    href: "/service/logo-design",
                                },
                                {
                                    text: "طراحی و برنامه نویسی وبسایت",
                                    href: "/service/web-design",
                                },
                            ]}
                            typeSpeed={50}
                            backSpeed={20}
                            loop={true}
                            startDelay={1500}
                            className="font-bold text-teal-500"
                        />{" "}
                        آن را اثبات کنیم.
                    </h3>
                    <p className="text-xs md:text-base text-slate-500 leading-relaxed mt-3.5 md:mt-2" data-aos="fade-left">
                        آژانس دیجیتال مارکتینگ هیکاوب با 4 سال سابقه فعالیت در زمینه تبلیغات و مدیریت کسب و کار و یک تیم مجرب و متخصص به دنبال توسعه و پیشرفت در کسب و کار شماست. تیم ما تشکیل شده از
                        طراحان وبسایت مجرب و چندین گرافیست و تدوین گر و برنامه نویسان با سابقه است . هیکاوب تا کنون با بیش از 25 کسب و کار همکاری داشته و در زمینه های مختلف مارکتینگ تلاش خودرا برای
                        ارتقای کسب و کار ها کرده است.
                    </p>
                    <div className="w-full grid grid-cols-2 gap-4 md:grid-cols-4 justify-center mt-5">
                        {info_preview.map((info, index) => (
                            <InfoPreviewCard info={info} key={index} />
                        ))}
                    </div>
                </div>
                <div className="col-span-12 md:col-span-6 order-1 md:order-2" data-aos="fade-right">
                    <Image src="/assets/images/intro-vector-1.png" title="" alt="" width="0" height="0" sizes="100vw" className="w-full md:w-10/12 mr-auto" />
                </div>
            </section>
            <ServicesSection />
            <section id="home-page-banners" className="w-full grid grid-cols-1 md:grid-cols-2 place-items-center gap-5">
                <Link href="/service/logo-design" className="w-full rounded-2xl overflow-hidden shadow-md" data-aos="fade-left">
                    <Image src="/assets/banners/logo-ad-banner.webp" width="0" height="0" alt="" title="" sizes="100vw" className="w-full h-auto" />
                </Link>
                <Link href="/service/hika-studio" className="w-full rounded-2xl overflow-hidden shadow-md" data-aos="fade-right">
                    <Image src="/assets/banners/photographing-ad-banner.webp" width="0" height="0" alt="" title="" sizes="100vw" className="w-full h-auto" />
                </Link>
            </section>
            <BrandsSliderSection />
            <CommentsSection />
            <section
                id="counseling"
                className="w-full shadow-md rounded-2xl grid grid-cols-1 p-3.5 md:px-0 md:py-0 md:grid-cols-2 items-center gap-x-3.5 gap-y-7 md:gap-y-0 bg-counseling-img bg-cover h-auto md:h-[476px] bg-no-repeat bg-center relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-slate-900/80"
                data-aos="zoom-in"
            >
                <div className="w-full z-10 flex flex-col justify-center items-center gap-3.5 md:gap-7">
                    <h4 className="text-center md:text-start leading-10 md:leading-normal text-xl md:text-2xl text-slate-200" data-aos="fade-left">
                        برای آنالیز کسب و کار خود و <span className="text-teal-500 font-bold">مشاوره رایگان</span> با ما در ارتباط باشید.
                    </h4>
                    <p
                        className="w-full md:w-auto text-center leading-normal md:leading-8 text-sm text-slate-200 bg-[#1A2336] rounded-2xl shadow-md shadow-[#008987] p-3.5 md:p-4"
                        data-aos="fade-down"
                    >
                        با کامل نمودن این فرم درخواست مشاوره شما ثبت میگردد و همکاران ما در تایم اداری <br /> با شما تماس خواهند گرفت همینطور میتوانید از طریق پشتیبانی مجازی مشاوره <br /> دریافت کنید:
                    </p>
                    <div className="flex items-center gap-x-7">
                        <a href="https://t.me/hikaweb" target="_blank" title="دریافت مشاوره در تلگرام" className="" data-aos="fade-up" data-aos-delay="0">
                            <TelegramFill className="bg-[#008987] rounded-xl p-2.5 w-full h-full resize" />
                        </a>
                        <a href="https://www.instagram.com/hikaweb.ir/" target="_blank" title="دریافت مشاوره در اینستاگرام" className="" data-aos="fade-up" data-aos-delay="250">
                            <InstagramOutlined className="bg-[#008987] rounded-xl p-2.5 w-full h-full resize" />
                        </a>
                        <a href="#" title="دریافت مشاوره در روبیکا" className="" data-aos="fade-up" data-aos-delay="500">
                            <RubikaFill className="bg-[#008987] rounded-xl p-2.5 w-full h-full resize" />
                        </a>
                        <a href="https://wa.me/9120997935" target="_blank" title="دریافت مشاوره در واتس اپ" className="" data-aos="fade-up" data-aos-delay="750">
                            <WhatsAppOutlined className="bg-[#008987] rounded-xl p-2.5 w-full h-full resize" />
                        </a>
                    </div>
                </div>
                <div className="w-full md:w-3/4 mx-auto z-10">
                    <CounselingForm />
                </div>
            </section>
            <MagPreviewSection />
        </main>
    );
};

export default HomePage;
