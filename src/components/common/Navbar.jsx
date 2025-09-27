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

const Navbar = () => {
    const dispatch = useAppDispatch();

    const pathName = usePathname();

    return (
        <nav id="nav" className="w-full flex items-center justify-between px-3 py-3 sm:py-0 rounded-2xl bg-slate-200 border-x-4 border-teal-500" data-aos="fade-in">
            <div className="flex items-center gap-x-3">
                <span className="md:hidden" onClick={() => dispatch(setIsOffCanvasVisible(true))}>
                    <HiMiniBars3CenterLeft className="text-3xl rotate-180 text-slate-700" />
                </span>
                <Link href="/" className="flex items-center" data-aos="fade-left">
                    <Image src="/assets/logo/logo-text.png" width="0" height="0" alt="هیکاوب" title="هیکاوب" className="w-auto h-8 sm:h-10 mask-animation" sizes="100vw" priority={true} />
                </Link>
                <ul className="hidden md:flex h-auto items-center gap-x-1.5">
                    <li className="flex items-center hover:-translate-y-0.5 transition-all duration-300 ease-in-out" data-aos="fade-up">
                        <Link
                            href="/"
                            className={`${pathName !== "/" ? "flex" : "hidden"} px-2.5 py-6 text-sm font-bold transition-colors duration-300 ease-in-out text-slate-500 hover:text-slate-700`}
                        >
                            خانه
                        </Link>
                    </li>
                    {navbarItems.map(({ title, url, children }, index) =>
                        !children ? (
                            <li className="flex items-center hover:-translate-y-0.5 transition-all duration-300 ease-in-out" key={index} data-aos="fade-up" data-aos-delay={index * 150}>
                                <Link href={url} title={title} className="block px-2.5 py-6 text-sm font-bold transition-colors duration-300 ease-in-out text-slate-500 hover:text-slate-700">
                                    {title}
                                </Link>
                            </li>
                        ) : (
                            <li className="flex items-center hover:-translate-y-0.5 transition-all duration-300 ease-in-out" key={index} data-aos="fade-up" data-aos-delay={index * 150}>
                                <Menu>
                                    <MenuButton className="flex items-center gap-1 px-2.5 py-6 text-sm font-bold outline-none transition-colors duration-300 ease-in-out text-slate-500 hover:text-slate-700">
                                        {title}
                                        <HiChevronDown className="size-4 transition-colors duration-300 ease-in-out text-slate-500 hover:text-slate-700" />
                                    </MenuButton>

                                    <MenuItems
                                        transition
                                        anchor="bottom start"
                                        className="w-52 origin-top-right rounded-xl bg-slate-200 border-b-4 shadow border-teal-500 p-1 text-sm/6 text-slate-500 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                                    >
                                        {children.map(({ title, url }, index) => (
                                            <MenuItem key={index}>
                                                <Link
                                                    href={url}
                                                    title={title}
                                                    className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 transition-all duration-300 ease-in-out hover:font-bold hover:text-slate-700"
                                                >
                                                    {title}
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

            <div className="w-auto flex items-center gap-x-1.5 sm:gap-x-3.5">
                <ToggleLanguageButton />
                <ToggleThemeMode />
                <AuthActionButton />
            </div>
        </nav>
    );
};

export default Navbar;
