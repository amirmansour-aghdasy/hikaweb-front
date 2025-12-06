"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { FaUserAlt } from "react-icons/fa";
import { BsChevronDown, BsBoxArrowRight } from "react-icons/bs";
import useAuthStore from "@/lib/store/authStore";

const AuthActionButton = () => {
    const router = useRouter();
    // Use selector to ensure re-render when state changes
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const logout = useAuthStore((state) => state.logout);
    const [mounted, setMounted] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []); // Empty dependency array - only run once

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user?.name) return "U";
        const names = user.name.trim().split(/\s+/);
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return names[0][0]?.toUpperCase() || "U";
    };

    // Get user display name
    const getUserDisplayName = () => {
        if (!user?.name) return "کاربر";
        const names = user.name.trim().split(/\s+/);
        if (names.length >= 2) {
            return `${names[0]} ${names[names.length - 1]}`;
        }
        return names[0];
    };

    if (!mounted) {
        return (
            <div className="flex items-center gap-x-2 rounded-full sm:rounded-2xl bg-teal-500 text-white p-3 sm:px-2.5 md:py-3 animate-pulse">
                <div className="w-5 h-5 bg-white/30 rounded-full"></div>
            </div>
        );
    }

    if (isAuthenticated && user) {
        return (
            <div className="relative group" ref={dropdownRef}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-x-2 rounded-full sm:rounded-2xl bg-teal-500 text-white p-3 sm:px-2.5 md:py-3 outline-none hover:bg-teal-600 transition-colors"
                    data-aos="fade-up"
                >
                    <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0">
                        {user.avatar ? (
                            <Image
                                src={user.avatar}
                                alt={user.name || "User"}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 24px, 32px"
                            />
                        ) : (
                            <span className="text-xs md:text-sm font-bold text-white">
                                {getUserInitials()}
                            </span>
                        )}
                    </div>
                    <span className="hidden md:flex text-sm font-bold truncate max-w-[120px]">
                        {getUserDisplayName()}
                    </span>
                    <BsChevronDown className={`hidden md:block w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                    <div className="absolute left-0 md:right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Link
                            href="/profile"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            <FaUserAlt className="w-4 h-4" />
                            <span>پروفایل</span>
                        </Link>
                        <button
                            onClick={() => {
                                setShowDropdown(false);
                                logout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <BsBoxArrowRight className="w-4 h-4" />
                            <span>خروج</span>
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href="/auth"
            title="ورود و ثبت نام"
            className="flex items-center gap-x-2 rounded-full sm:rounded-2xl bg-teal-500 text-white p-3 sm:px-2.5 md:py-3 outline-none hover:bg-teal-600 transition-colors"
            data-aos="fade-up"
        >
            <FaUserAlt className="text-base md:text-xl" />
            <span className="hidden md:flex text-sm font-bold">ورود / ثبت نام</span>
        </Link>
    );
};

export default AuthActionButton;
