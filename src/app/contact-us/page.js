import Image from "next/image";

import { ContactUsForm } from "@/components/forms";
import MapWrapper from "@/components/map/MapWrapper";
import { CallCallingFill, InstagramOutlined, LocationFill, RubikaFill, TelegramFill, WhatsAppOutlined } from "@/lib/icons";
import { defaultMetadata } from "@/lib/seo";

export const metadata = {
    title: "تماس با ما | هیکاوب",
    description: "برای ارتباط با تیم هیکاوب و دریافت مشاوره رایگان، با ما تماس بگیرید. آدرس: تهران، بزرگراه اشرفی اصفهانی، محمدی (محله‌ی مرزداران)",
    keywords: "تماس با هیکاوب, آدرس هیکاوب, شماره تماس هیکاوب, مشاوره رایگان",
    openGraph: {
        title: "تماس با ما | هیکاوب",
        description: "برای ارتباط با تیم هیکاوب و دریافت مشاوره رایگان، با ما تماس بگیرید",
        url: `${defaultMetadata.siteUrl}/contact-us`,
        type: "website",
    },
    alternates: {
        canonical: `${defaultMetadata.siteUrl}/contact-us`,
    },
};

const ContactUsPage = () => {
    return (
        <main className="w-full py-7 md:py-14 flex flex-col gap-7 md:gap-14 overflow-hidden md:overflow-visible">
            <Image src="/assets/banners/contact-us.webp" sizes="100vw" width={1440} height={374} className="w-full h-32 md:h-auto rounded-2xl" alt="تماس با ما" title="تماس با ما" data-aos="zoom-in" priority />
            <section className="w-full grid grid-cols-12 items-stretch gap-7">
                <div className="w-full flex flex-1 col-span-12 md:col-span-4">
                    <ContactUsForm />
                </div>
                <div className="w-full flex-1 col-span-12 md:col-span-8 bg-[#A5D1D1] dark:bg-teal-900/30 rounded-2xl p-3.5 flex flex-col items-center justify-between gap-3.5">
                    <div className="w-full h-72 rounded-2xl overflow-hidden" data-aos="zoom-out">
                        <MapWrapper />
                    </div>
                    <div className="w-full">
                        <p className="w-full flex items-center gap-2 md:gap-2.5 text-[#0E443C] dark:text-teal-100 text-sm md:text-xl font-bold md:font-normal p-2.5 bg-[#F5F5F5] dark:bg-slate-800 shadow rounded-xl" data-aos="zoom-in">
                            <LocationFill className="size-6 md:size-8" />
                            تهران، بزرگراه اشرفی اصفهانی، محمدی (محله‌ی مرزداران)
                        </p>
                        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-3.5 bg-[#F5F5F5] dark:bg-slate-800 p-2.5 rounded-xl mt-3.5" data-aos="zoom-out">
                            <a href="tel:09120997935" className="w-full flex justify-center items-center text-sm md:text-xl font-bold md:font-normal gap-x-1.5 text-[#0E443C] dark:text-slate-200 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                09120997935
                                <CallCallingFill className="text-[#008987] dark:text-teal-400 size-5 md:size-8" />
                            </a>
                            <a href="tel:09191393479" className="w-full flex justify-center items-center text-sm md:text-xl font-bold md:font-normal gap-x-1.5 text-[#0E443C] dark:text-slate-200 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                09191393479
                                <CallCallingFill className="text-[#008987] dark:text-teal-400 size-5 md:size-8" />
                            </a>
                            <a href="tel:02144276519" className="w-full flex justify-center items-center text-sm md:text-xl font-bold md:font-normal gap-x-1.5 text-[#0E443C] dark:text-slate-200 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                02144276519
                                <CallCallingFill className="text-[#008987] dark:text-teal-400 size-5 md:size-8" />
                            </a>
                            <a href="tel:02144277208" className="w-full flex justify-center items-center text-sm md:text-xl font-bold md:font-normal gap-x-1.5 text-[#0E443C] dark:text-slate-200 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                02144277208
                                <CallCallingFill className="text-[#008987] dark:text-teal-400 size-5 md:size-8" />
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-3.5">
                        <a href="https://t.me/hikaweb" target="_blank" title="هیکاوب در تلگرام" className="" data-aos="fade-up" data-aos-delay="0">
                            <TelegramFill className="bg-[#008987] rounded-md p-2.5 w-full h-full resize" />
                        </a>
                        <a href="https://www.instagram.com/hikaweb.ir/" target="_blank" title="هیکاوب در اینستاگرام" className="" data-aos="fade-up" data-aos-delay="250">
                            <InstagramOutlined className="bg-[#008987] rounded-md p-2.5 w-full h-full resize" />
                        </a>
                        <a href="#" title="هیکاوب در روبیکا" className="" data-aos="fade-up" data-aos-delay="500">
                            <RubikaFill className="bg-[#008987] rounded-md p-2.5 w-full h-full resize" />
                        </a>
                        <a href="https://wa.me/9120997935" target="_blank" title="هیکاوب در واتس اپ" className="" data-aos="fade-up" data-aos-delay="750">
                            <WhatsAppOutlined className="bg-[#008987] rounded-md p-2.5 w-full h-full resize" />
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ContactUsPage;
