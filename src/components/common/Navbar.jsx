"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useAppDispatch } from "@/lib/hooks";
import { navbarItems } from "@/lib/constants";
import { HiChevronDown } from "react-icons/hi";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { setIsOffCanvasVisible } from "@/lib/features/appSlice";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { AuthActionButton, ToggleLanguageButton, ToggleThemeMode } from "../action_buttons";
import NotificationBell from "../notifications/NotificationBell";
import useAuthStore from "@/lib/store/authStore";

/**
 * Navbar Component - Optimized for SEO and Accessibility
 * 
 * SEO Improvements:
 * - Semantic nav element with proper ARIA labels
 * - Descriptive link titles and alt texts
 * - Proper heading hierarchy
 * - Structured navigation menu
 * 
 * Accessibility Improvements:
 * - Keyboard navigation support
 * - ARIA labels and roles
 * - Focus management
 * - Screen reader friendly
 */
const Navbar = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const pathName = usePathname();

    const handleMenuToggle = () => {
        dispatch(setIsOffCanvasVisible(true));
    };

    return (
        <nav 
            id="nav" 
            className="w-full flex items-center justify-between px-3 py-3 sm:py-0 rounded-2xl bg-slate-200 dark:bg-slate-800 border-x-4 border-teal-500 dark:border-teal-600 transition-colors duration-300" 
            data-aos="fade-in"
            role="navigation"
            aria-label="منوی اصلی ناوبری"
        >
            <div className="flex items-center gap-x-3">
                {/* Mobile Menu Button - Improved Accessibility */}
                <button
                    type="button"
                    className="md:hidden p-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors focus:outline-none"
                    onClick={handleMenuToggle}
                    aria-label="باز کردن منوی موبایل"
                    aria-expanded={false}
                    aria-controls="offcanvas-menu"
                >
                    <HiMiniBars3CenterLeft className="text-3xl rotate-180 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                </button>

                {/* Logo - Improved SEO */}
                <Link 
                    href="/" 
                    className="flex items-center focus:outline-none rounded-lg" 
                    data-aos="fade-left"
                    aria-label="صفحه اصلی هیکاوب"
                    title="هیکاوب - بازگشت به صفحه اصلی"
                >
                    <Image 
                        src="/assets/logo/logo-text.png" 
                        width="0" 
                        height="0" 
                        alt="لوگوی هیکاوب - آژانس دیجیتال مارکتینگ" 
                        title="هیکاوب - آژانس دیجیتال مارکتینگ" 
                        className="w-auto h-8 sm:h-10 mask-animation" 
                        sizes="(max-width: 768px) 120px, 160px" 
                        priority={true}
                    />
                </Link>

                {/* Desktop Navigation Menu - Improved Semantic HTML */}
                <ul 
                    className="hidden md:flex h-auto items-center gap-x-1.5"
                    role="menubar"
                    aria-label="منوی ناوبری اصلی"
                >
                    {/* Home Link - Only show when not on home page */}
                    {pathName !== "/" && (
                        <li 
                            className="flex items-center hover:-translate-y-0.5 transition-all duration-300 ease-in-out" 
                            role="none"
                            data-aos="fade-up"
                        >
                            <Link
                                href="/"
                                role="menuitem"
                                className="px-2.5 py-6 text-sm font-bold transition-colors duration-300 ease-in-out text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none rounded-lg"
                                aria-label="بازگشت به صفحه اصلی"
                            >
                                خانه
                            </Link>
                        </li>
                    )}

                    {/* Navigation Items */}
                    {navbarItems.map(({ title, url, children }, index) =>
                        !children ? (
                            <li 
                                className="flex items-center hover:-translate-y-0.5 transition-all duration-300 ease-in-out" 
                                key={`nav-item-${index}`}
                                role="none"
                                data-aos="fade-up" 
                                data-aos-delay={index * 150}
                            >
                                <Link 
                                    href={url} 
                                    role="menuitem"
                                    title={`${title} - هیکاوب`}
                                    className={`block px-2.5 py-6 text-sm font-bold transition-colors duration-300 ease-in-out text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none rounded-lg ${
                                        pathName === url ? "text-teal-600 dark:text-teal-400 font-extrabold" : ""
                                    }`}
                                    aria-current={pathName === url ? "page" : undefined}
                                >
                                    {title}
                                </Link>
                            </li>
                        ) : (
                            <li 
                                className="flex items-center hover:-translate-y-0.5 transition-all duration-300 ease-in-out" 
                                key={`nav-item-${index}`}
                                role="none"
                                data-aos="fade-up" 
                                data-aos-delay={index * 150}
                            >
                                <Menu>
                                    <MenuButton 
                                        className="flex items-center gap-1 px-2.5 py-6 text-sm font-bold outline-none transition-colors duration-300 ease-in-out text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none rounded-lg"
                                        aria-label={`${title} - باز کردن منوی زیرمجموعه`}
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        {title}
                                        <HiChevronDown 
                                            className="size-4 transition-transform duration-300 ease-in-out text-slate-500 dark:text-slate-400 group-data-[open]:rotate-180" 
                                            aria-hidden="true"
                                        />
                                    </MenuButton>

                                    <MenuItems
                                        transition
                                        anchor="bottom start"
                                        className="w-52 z-10 origin-top-right rounded-xl bg-slate-200 dark:bg-slate-800 border-b-4 shadow-lg border-teal-500 dark:border-teal-600 p-1 text-sm/6 text-slate-500 dark:text-slate-400 transition duration-100 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                                        role="menu"
                                        aria-label={`منوی ${title}`}
                                    >
                                        {children.map(({ title: childTitle, url: childUrl }, childIndex) => (
                                            <MenuItem key={`submenu-item-${childIndex}`}>
                                                <Link
                                                    href={childUrl}
                                                    role="menuitem"
                                                    title={`${childTitle} - ${title}`}
                                                    className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 dark:data-focus:bg-slate-700/50 transition-all duration-300 ease-in-out hover:font-bold hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none"
                                                    aria-label={childTitle}
                                                >
                                                    {childTitle}
                                                </Link>
                                            </MenuItem>
                                        ))}
                                    </MenuItems>
                                </Menu>
                            </li>
                        )
                    )}
                </ul>
            </div>

            {/* Action Buttons - Improved Accessibility */}
            <div 
                className="w-auto flex items-center gap-x-1.5 sm:gap-x-3.5"
                role="toolbar"
                aria-label="دکمه‌های عملیاتی"
            >
                {/* <ToggleLanguageButton /> */}
                <ToggleThemeMode />
                {isAuthenticated && <NotificationBell />}
                <AuthActionButton />
            </div>
        </nav>
    );
};

export default Navbar;
