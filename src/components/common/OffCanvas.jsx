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
                        <Link href="/">
                            <Image src="/assets/logo/logo-text.png" width="0" height="0" sizes="100vw" alt="" title="" className="w-16" priority={true} />
                        </Link>
                        <span className="rounded-xl border-2 border-teal-500 p-1.5" onClick={() => dispatch(setIsOffCanvasVisible(false))}>
                            <MdClose className="text-xl text-teal-500" />
                        </span>
                    </DialogTitle>

                    <Swiper className="w-full mySwiper9 mt-5" loop={false} autoplay={true} modules={[Autoplay]} slidesPerView={1.3} centeredSlides={true} spaceBetween={15}>
                        <SwiperSlide className="rounded-2xl overflow-hidden shadow-md">
                            <Image src="/assets/banners/small-slider-banner-1.webp" width="0" height="0" sizes="100vw" className="w-full" alt="" title="" />
                        </SwiperSlide>
                        <SwiperSlide className="rounded-2xl overflow-hidden shadow-md">
                            <Image src="/assets/banners/small-slider-banner-2.webp" width="0" height="0" sizes="100vw" className="w-full" alt="" title="" />
                        </SwiperSlide>
                        <SwiperSlide className="rounded-2xl overflow-hidden shadow-md">
                            <Image src="/assets/banners/small-slider-banner-1.webp" width="0" height="0" sizes="100vw" className="w-full" alt="" title="" />
                        </SwiperSlide>
                        <SwiperSlide className="rounded-2xl overflow-hidden shadow-md">
                            <Image src="/assets/banners/small-slider-banner-1.webp" width="0" height="0" sizes="100vw" className="w-full" alt="" title="" />
                        </SwiperSlide>
                        <SwiperSlide className="rounded-2xl overflow-hidden shadow-md">
                            <Image src="/assets/banners/small-slider-banner-2.webp" width="0" height="0" sizes="100vw" className="w-full" alt="" title="" />
                        </SwiperSlide>
                    </Swiper>
                    <nav id="mobile-menu" className="w-full h-96 px-3.5 mt-5">
                        <ul className="w-full h-full flex flex-col gap-1.5  overflow-y-scroll scroll-smooth scroll-m-0 scroll-p-0">
                            {navbarItems.map(({ title, url, children }, index) =>
                                url ? (
                                    <li
                                        className="w-full flex items-center justify-between bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 ease-in-out rounded-md"
                                        onClick={() => dispatch(setIsOffCanvasVisible(false))}
                                        key={index}
                                    >
                                        <Link href={url} title={title} className="flex w-full text-xs py-2.5 pr-3 font-semibold">
                                            {title}
                                        </Link>
                                    </li>
                                ) : (
                                    <Disclosure as="li" key={index}>
                                        <DisclosureButton className="group flex w-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 ease-in-out rounded-md">
                                            <span title={title} className="flex items-center justify-between w-full text-xs py-2.5 px-3 font-semibold">
                                                {title}
                                                <HiChevronDown className="size-5 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                                            </span>
                                        </DisclosureButton>
                                        <DisclosurePanel
                                            transition
                                            className="mt-1 origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0 bg-slate-100 dark:bg-slate-800 rounded-md"
                                        >
                                            <ul className="w-full flex flex-col gap-1.5 p-1.5">
                                                {children.map(({ url, title }, index) => (
                                                    <li className="w-full flex items-center justify-between bg-slate-200 dark:bg-slate-700 rounded-md" onClick={() => dispatch(setIsOffCanvasVisible(false))} key={index}>
                                                        <Link
                                                            href={url}
                                                            title={title}
                                                            className="flex w-full text-xs py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 ease-in-out"
                                                        >
                                                            {title}
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

                    <div className="w-full absolute flex justify-center items-center gap-x-2.5 bottom-5 right-0">
                        <a
                            href="https://www.instagram.com/hikaweb.ir/"
                            target="_blank"
                            title="دریافت مشاوره در اینستاگرام"
                            className="p-1.5 bg-slate-700 dark:bg-slate-800 hover:bg-teal-600 dark:hover:bg-teal-600 transition-all duration-300 ease-in-out rounded group hover:-translate-y-1"
                        >
                            <BsInstagram className="text-xl text-teal-500 dark:text-teal-400 group-hover:text-slate-100 transition-colors duration-300 ease-in-out" />
                        </a>
                        <a href="" className="p-1.5 bg-slate-700 dark:bg-slate-800 hover:bg-teal-600 dark:hover:bg-teal-600 transition-all duration-300 ease-in-out rounded group hover:-translate-y-1">
                            <FaLinkedinIn className="text-xl text-teal-500 dark:text-teal-400 group-hover:text-slate-100 transition-colors duration-300 ease-in-out" />
                        </a>
                        <a href="" className="p-1.5 bg-slate-700 dark:bg-slate-800 hover:bg-teal-600 dark:hover:bg-teal-600 transition-all duration-300 ease-in-out rounded group hover:-translate-y-1">
                            <FaWhatsapp
                                href="https://wa.me/9120997935"
                                target="_blank"
                                title="دریافت مشاوره در واتس اپ"
                                className="text-xl text-teal-500 dark:text-teal-400 group-hover:text-slate-100 transition-colors duration-300 ease-in-out"
                            />
                        </a>
                        <a
                            href="https://t.me/hikaweb"
                            target="_blank"
                            title="دریافت مشاوره در تلگرام"
                            className="p-1.5 bg-slate-700 dark:bg-slate-800 hover:bg-teal-600 dark:hover:bg-teal-600 transition-all duration-300 ease-in-out rounded group hover:-translate-y-1"
                        >
                            <FaTelegramPlane className="text-xl text-teal-500 dark:text-teal-400 group-hover:text-slate-100 transition-colors duration-300 ease-in-out" />
                        </a>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default OffCanvas;
