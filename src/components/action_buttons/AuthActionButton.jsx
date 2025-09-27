"use client";
import Link from "next/link";

import { FaUserAlt } from "react-icons/fa";

const AuthActionButton = () => {
    return (
        <Link href="/auth" title="ورود و ثبت نام" className="flex items-center gap-x-2 rounded-full sm:rounded-2xl bg-teal-500 text-white p-3 sm:px-2.5 md:py-3 outline-none" data-aos="fade-up">
            <FaUserAlt className="text-base md:text-xl" />
            <span className="hidden md:flex text-sm font-bold">ورود / ثبت نام</span>
        </Link>
    );
};

export default AuthActionButton;
