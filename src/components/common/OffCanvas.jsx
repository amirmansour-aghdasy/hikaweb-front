"use client";
import Link from "next/link";
import Image from "next/image";

import { useEffect } from "react";

import { MdClose } from "react-icons/md";
import { Autoplay } from "swiper/modules";
import { BsInstagram } from "react-icons/bs";
import { HiChevronDown } from "react-icons/hi";
import { FaTelegramPlane } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";

import { navbarItems } from "@/lib/constants";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setIsOffCanvasVisible } from "@/lib/features/appSlice";

const OffCanvas = () => {
    const { isOffCanvasVisible } = useAppSelector((state) => state.app);
    const dispatch = useAppDispatch();

    const toggleOffcanvas = () => {
        if (window.innerWidth > 768 && isOffCanvasVisible) {
            dispatch(setIsOffCanvasVisible(false));
        }
    };

    useEffect(() => {
        window.addEventListener("resize", toggleOffcanvas);
        () => window.removeEventListener("resize", toggleOffcanvas);
    }, [isOffCanvasVisible, toggleOffcanvas]);

    return (
        <Dialog open={isOffCanvasVisible} as="div" className="relative z-10  focus:outline-none" onClose={() => dispatch(setIsOffCanvasVisible(false))}>
            <DialogBackdrop className="fixed inset-0 bg-teal-950 dark:bg-slate-950 bg-opacity-70 dark:bg-opacity-80" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-hidden">
                <DialogPanel
                    transition
                    className={`relative w-9/12 h-full bg-white dark:bg-slate-900 transform duration-1000 ease-in-out ${
                        isOffCanvasVisible ? "translate-x-0" : "translate-x-full"
                    } transition-transform z-20 py-3.5 before:content-[''] before:absolute before:top-0 before:right-0 before:w-full before:h-1 before:bg-teal-500 dark:before:bg-teal-600 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-full after:h-1 after:bg-teal-500 dark:after:bg-teal-600`}
                >
                    <DialogTitle as="h3" className="w-full flex items-center justify-between px-3.5">
                        <Link 
                            href="/"
                            onClick={() => dispatch(setIsOffCanvasVisible(false))}
                            aria-label="صفحه اصلی هیکاوب"
                            className="focus:outline-none rounded-lg"
                        >
                            <Image 
                                src="/assets/logo/logo-text.png" 
                                width="0" 
                                height="0" 
                                sizes="100vw" 
                                alt="لوگوی هیکاوب" 
                                title="هیکاوب - بازگشت به صفحه اصلی" 
                                className="w-16" 
                                priority={true} 
                            />
                        </Link>
                        <button
                            type="button"
                            className="rounded-xl border-2 border-teal-500 p-1.5 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors focus:outline-none"
                            onClick={() => dispatch(setIsOffCanvasVisible(false))}
                            aria-label="بستن منوی موبایل"
                        >
                            <MdClose className="text-xl text-teal-500" aria-hidden="true" />
                        </button>
                    </DialogTitle>

                    <Swiper className="w-full mySwiper9 mt-5" loop={false} autoplay={true} modules={[Autoplay]} slidesPerView={1.3} centeredSlides={true} spaceBetween={15}>
                        <SwiperSlide key="banner-1" className="rounded-2xl overflow-hidden shadow-md dark:shadow-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <Link href="/service/logo-design" className="block">
                                <Image src="/assets/banners/small-slider-banner-1.webp" width="0" height="0" sizes="100vw" className="w-full dark:brightness-90 dark:contrast-105" alt="" title="" />
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide key="banner-2" className="rounded-2xl overflow-hidden shadow-md dark:shadow-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <Link href="/service/printing" className="block">
                                <Image src="/assets/banners/small-slider-banner-2.webp" width="0" height="0" sizes="100vw" className="w-full dark:brightness-90 dark:contrast-105" alt="" title="" />
                            </Link>
                        </SwiperSlide>
                    </Swiper>
                    <nav 
                        id="offcanvas-menu" 
                        className="w-full h-96 px-3.5 mt-5"
                        role="navigation"
                        aria-label="منوی موبایل"
                    >
                        <ul 
                            className="w-full h-full flex flex-col gap-1.5 overflow-y-scroll scroll-smooth scroll-m-0 scroll-p-0"
                            role="menubar"
                        >
                            {navbarItems.map(({ title, url, children }, index) =>
                                url ? (
                                    <li
                                        className="w-full flex items-center justify-between bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 ease-in-out rounded-md"
                                        onClick={() => dispatch(setIsOffCanvasVisible(false))}
                                        key={`mobile-nav-${index}`}
                                        role="none"
                                    >
                                        <Link 
                                            href={url} 
                                            title={`${title} - هیکاوب`}
                                            role="menuitem"
                                            className="flex w-full text-xs py-2.5 pr-3 font-semibold focus:outline-none rounded-md"
                                            aria-label={title}
                                        >
                                            {title}
                                        </Link>
                                    </li>
                                ) : (
                                    <Disclosure as="li" key={`mobile-nav-${index}`} role="none">
                                        <DisclosureButton 
                                            className="group flex w-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 ease-in-out rounded-md focus:outline-none"
                                            aria-label={`${title} - باز کردن منوی زیرمجموعه`}
                                            aria-expanded="false"
                                        >
                                            <span title={title} className="flex items-center justify-between w-full text-xs py-2.5 px-3 font-semibold">
                                                {title}
                                                <HiChevronDown 
                                                    className="size-5 group-data-hover:fill-white/50 group-data-open:rotate-180 transition-transform duration-300" 
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </DisclosureButton>
                                        <DisclosurePanel
                                            transition
                                            className="mt-1 origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0 bg-slate-100 dark:bg-slate-800 rounded-md"
                                            role="menu"
                                            aria-label={`منوی ${title}`}
                                        >
                                            <ul className="w-full flex flex-col gap-1.5 p-1.5" role="menubar">
                                                {children.map(({ url, title: childTitle }, childIndex) => (
                                                    <li 
                                                        className="w-full flex items-center justify-between bg-slate-200 dark:bg-slate-700 rounded-md" 
                                                        onClick={() => dispatch(setIsOffCanvasVisible(false))} 
                                                        key={`mobile-subnav-${childIndex}`}
                                                        role="none"
                                                    >
                                                        <Link
                                                            href={url}
                                                            title={`${childTitle} - ${title}`}
                                                            role="menuitem"
                                                            className="flex w-full text-xs py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 ease-in-out focus:outline-none rounded-md"
                                                            aria-label={childTitle}
                                                        >
                                                            {childTitle}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </DisclosurePanel>
                                    </Disclosure>
                                )
                            )}
                        </ul>
                    </nav>

                    <div 
                        className="w-full absolute flex justify-center items-center gap-x-2.5 bottom-5 right-0"
                        role="toolbar"
                        aria-label="لینک‌های شبکه‌های اجتماعی"
                    >
                        <a
                            href="https://www.instagram.com/hikaweb.ir/"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="دریافت مشاوره در اینستاگرام"
                            aria-label="اینستاگرام هیکاوب"
                            className="p-1.5 bg-slate-700 dark:bg-slate-800 hover:bg-teal-600 dark:hover:bg-teal-600 transition-all duration-300 ease-in-out rounded group hover:-translate-y-1 focus:outline-none"
                        >
                            <BsInstagram className="text-xl text-teal-500 dark:text-teal-400 group-hover:text-slate-100 transition-colors duration-300 ease-in-out" aria-hidden="true" />
                        </a>
                        <a 
                            href="https://www.linkedin.com/company/hikaweb" 
                            target="_blank"
                            rel="noopener noreferrer"
                            title="لینکدین هیکاوب"
                            aria-label="لینکدین هیکاوب"
                            className="p-1.5 bg-slate-700 dark:bg-slate-800 hover:bg-teal-600 dark:hover:bg-teal-600 transition-all duration-300 ease-in-out rounded group hover:-translate-y-1 focus:outline-none"
                        >
                            <FaLinkedinIn className="text-xl text-teal-500 dark:text-teal-400 group-hover:text-slate-100 transition-colors duration-300 ease-in-out" aria-hidden="true" />
                        </a>
                        <a 
                            href="https://wa.me/9120997935" 
                            target="_blank"
                            rel="noopener noreferrer"
                            title="دریافت مشاوره در واتس اپ"
                            aria-label="واتساپ هیکاوب"
                            className="p-1.5 bg-slate-700 dark:bg-slate-800 hover:bg-teal-600 dark:hover:bg-teal-600 transition-all duration-300 ease-in-out rounded group hover:-translate-y-1 focus:outline-none"
                        >
                            <FaWhatsapp className="text-xl text-teal-500 dark:text-teal-400 group-hover:text-slate-100 transition-colors duration-300 ease-in-out" aria-hidden="true" />
                        </a>
                        <a
                            href="https://t.me/hikaweb"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="دریافت مشاوره در تلگرام"
                            aria-label="تلگرام هیکاوب"
                            className="p-1.5 bg-slate-700 dark:bg-slate-800 hover:bg-teal-600 dark:hover:bg-teal-600 transition-all duration-300 ease-in-out rounded group hover:-translate-y-1 focus:outline-none"
                        >
                            <FaTelegramPlane className="text-xl text-teal-500 dark:text-teal-400 group-hover:text-slate-100 transition-colors duration-300 ease-in-out" aria-hidden="true" />
                        </a>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default OffCanvas;
