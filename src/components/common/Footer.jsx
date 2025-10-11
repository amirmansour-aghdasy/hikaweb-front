import Link from "next/link";

import { BsInstagram } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { FiPhoneCall, FiMail } from "react-icons/fi";
import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer id="main-footer" className="w-full flex flex-col gap-7 rounded-2xl bg-gradient-to-tl from-slate-900 via-slate-800 to-slate-700 p-3.5 md:p-5">
            <div className="w-full grid grid-cols-12 gap-7">
                <div className="w-full col-span-12 md:col-span-3 border-none md:border-l-2 border-l-teal-500" data-aos="fade-left">
                    <p className="text-[10px] md:text-sm leading-6 text-slate-300 text-center rounded-2xl bg-slate-700 p-3.5">
                        <span className="font-bold text-teal-500">آژانس دیجیتال مارکتینگ هیکاوب</span> با 4 سال سابقه فعالیت در زمینه تبلیغات و مدیریت کسب و کار و یک تیم مجرب و متخصص به دنبال توسعه و
                        پیشرفت در کسب و کار شماست. تیم ما تشکیل شده از طراحان وبسایت مجرب و چندین گرافیست و تدوین گر و برنامه نویسان با سابقه است.
                    </p>
                </div>
                <div className="w-full col-span-12 md:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-x-3.5 gap-y-7">
                    <ul className="flex flex-col gap-y-3.5 items-start">
                        <h3 className="text-base font-bold text-slate-200 text-right" data-aos="fade-down" data-aos-delay="0">
                            ارتباط با ما:
                        </h3>
                        <li className="flex items-center gap-x-1.5 justify-center" data-aos="fade-left" data-aos-delay="0">
                            <FiPhoneCall className="text-white" />
                            <a href="tel:09120997935" title="09120997935" className="block text-xs md:text-sm text-center text-teal-500">
                                09120997935
                            </a>
                        </li>
                        <li className="flex items-center gap-x-1.5 justify-center" data-aos="fade-left" data-aos-delay="250">
                            <FiPhoneCall className="text-white" />
                            <a href="tel:09053737016" title="09053737016" className="block text-xs md:text-sm text-center text-teal-500">
                                09053737016
                            </a>
                        </li>
                        <li className="flex items-center gap-x-1.5 justify-center" data-aos="fade-left" data-aos-delay="500">
                            <FiPhoneCall className="text-white" />
                            <a href="tel:09191393479" title="09191393479" className="block text-xs md:text-sm text-center text-teal-500">
                                09191393479
                            </a>
                        </li>
                        <li className="flex items-center gap-x-1.5 justify-center" data-aos="fade-left" data-aos-delay="750">
                            <FiMail className="text-white" />
                            <a href="mailto:info@hikaweb.ir" title="info@hikaweb.ir" className="block text-xs md:text-sm text-center text-teal-500">
                                info@hikaweb.ir
                            </a>
                        </li>
                    </ul>

                    <ul className="flex w-full flex-col gap-y-1.5 items-start list-disc text-white">
                        <h3 className="text-base font-bold text-slate-200 text-right" data-aos="fade-down" data-aos-delay="250">
                            آخرین نمونه کار ها:
                        </h3>
                    </ul>
                    <ul className="flex w-full flex-col gap-y-1.5 items-start list-disc text-white">
                        <h3 className="text-base font-bold text-slate-200 text-right" data-aos="fade-down" data-aos-delay="500">
                            آخرین مقالات:
                        </h3>
                    </ul>
                    <ul className="flex w-full flex-col gap-y-1.5 items-start list-disc text-white">
                        <h3 className="text-base font-bold text-slate-200 text-right" data-aos="fade-down" data-aos-delay="750">
                            آخرین محصولات:
                        </h3>
                    </ul>
                </div>
            </div>
            <hr className="h-0.5 bg-slate-700 border-none" data-aos="zoom-in" />
            <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center gap-7">
                <div className="grid grid-cols-3 gap-x-5">
                    <a referrerPolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=484418&Code=ggyy9tDcF2QAiZ9R0qGpEQp6jNRJkozr">
                        <img
                            referrerPolicy="origin"
                            src="https://trustseal.enamad.ir/logo.aspx?id=484418&Code=ggyy9tDcF2QAiZ9R0qGpEQp6jNRJkozr"
                            alt=""
                            style={{ cursor: "pointer", height: "70px" }}
                            code="ggyy9tDcF2QAiZ9R0qGpEQp6jNRJkozr"
                        />
                    </a>
                </div>
                <div className="flex justify-center items-center gap-x-2 mx-auto">
                    <a href="https://www.instagram.com/hikaweb.ir/" target="_blank" className="p-2.5 bg-slate-700 hover:bg-teal-600 transition-all duration-300 ease-in-out rounded-md group hover:-translate-y-1">
                        <BsInstagram className="text-xl text-teal-500 group-hover:text-slate-100 transition-colors duration-300 ease-in-out" />
                    </a>
                    <a href="" className="p-2.5 bg-slate-700 hover:bg-teal-600 transition-all duration-300 ease-in-out rounded-md group hover:-translate-y-1">
                        <FaLinkedinIn className="text-xl text-teal-500 group-hover:text-slate-100 transition-colors duration-300 ease-in-out" />
                    </a>
                    <a href="https://wa.me/9120997935" target="_blank" title="دریافت مشاوره در واتس اپ" className="p-2.5 bg-slate-700 hover:bg-teal-600 transition-all duration-300 ease-in-out rounded-md group hover:-translate-y-1">
                        <FaWhatsapp className="text-xl text-teal-500 group-hover:text-slate-100 transition-colors duration-300 ease-in-out" />
                    </a>
                    <a href="https://t.me/hikaweb" target="_blank" title="دریافت مشاوره در تلگرام" className="p-2.5 bg-slate-700 hover:bg-teal-600 transition-all duration-300 ease-in-out rounded-md group hover:-translate-y-1">
                        <FaTelegramPlane className="text-xl text-teal-500 group-hover:text-slate-100 transition-colors duration-300 ease-in-out" />
                    </a>
                </div>

                <p className="text-xs text-white cursor-default text-center md:text-left">HIKAWEB ALL RIGHTS RESERVED 2025©</p>
            </div>
        </footer>
    );
};

export default Footer;
