import Image from "next/image";

import { ContactUsForm } from "@/components/forms";
import { CallCallingFill, InstagramOutlined, LocationFill, RubikaFill, TelegramFill, WhatsAppOutlined } from "@/lib/icons";

const ContactUsPage = () => {
    return (
        <main className="w-full py-7 md:py-14 flex flex-col gap-7 md:gap-14 overflow-hidden md:overflow-visible">
            <Image src="/assets/banners/contact-us.webp" sizes="100vw" width="0" height="0" className="w-full h-32 md:h-auto rounded-2xl" alt="تماس با ما" title="تماس با ما" data-aos="zoom-in" />
            <section className="w-full grid grid-cols-12 items-stretch gap-7">
                <div className="w-full flex flex-1 col-span-12 md:col-span-4">
                    <ContactUsForm />
                </div>
                <div className="w-full flex-1 col-span-12 md:col-span-8 bg-[#A5D1D1] rounded-2xl p-3.5 flex flex-col items-center justify-between gap-y-5 lg:gap-0">
                    <div className="w-full h-72 rounded-2xl overflow-hidden" data-aos="zoom-out">
                        <iframe
                            className="w-full h-full"
                            src="https://www.google.com/maps?q=35.7294839,51.3350453&hl=fa&z=15&output=embed"
                            width="600"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                    <div className="w-full">
                        <p className="w-full flex items-center gap-2 md:gap-2.5 text-[#0E443C] text-xs md:text-xl font-bold md:font-normal p-2.5 bg-[#F5F5F5] shadow rounded-xl" data-aos="zoom-in">
                            <LocationFill className="size-6 md:size-8" />
                            تهران، بزرگراه اشرفی اصفهانی، محمدی (محله‌ی مرزداران)
                        </p>
                        <div className="w-full grid grid-cols-3 gap-2 sm:gap-3.5 sm bg-[#F5F5F5] p-2.5 rounded-xl mt-3.5" data-aos="zoom-out">
                            <span className="w-full flex justify-center items-center text-xs md:text-xl font-bold md:font-normal gap-x-1.5 text-[#0E443C]">
                                09120997935
                                <CallCallingFill className="text-[#008987] size-6 md:size-8" />
                            </span>
                            <span className="w-full flex justify-center items-center text-xs md:text-xl font-bold md:font-normal gap-x-1.5 text-[#0E443C]">
                                09191393479
                                <CallCallingFill className="text-[#008987] size-6 md:size-8" />
                            </span>
                            <span className="w-full flex justify-center items-center text-xs md:text-xl font-bold md:font-normal gap-x-1.5 text-[#0E443C]">
                                09120997935
                                <CallCallingFill className="text-[#008987] size-6 md:size-8" />
                            </span>
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
