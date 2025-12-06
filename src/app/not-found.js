import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "404 - صفحه یافت نشد | هیکاوب",
    description: "صفحه مورد نظر یافت نشد",
    robots: "noindex, nofollow",
};

export default function NotFound() {
    return (
        <div className="flex flex-col items-center gap-3.5 py-10">
            <Image src="/assets/images/404-not-found.png" width="0" height="0" sizes="100vw" className="w-7/12 md:w-4/12 h-auto md:h-auto" alt="طراحی لوگو" title="طراحی لوگو" />
            <h1 className="font-bold text-xl md:text-2xl text-teal-500">404 - Not Found.</h1>
            <p className="text-sm md:text-base text-slate-500">صفحه مورد نظر یافت نشد.</p>
            <Link href="/" className="rounded-xl px-3.5 py-1.5 bg-teal-500 text-white text-sm md:text-base">رفتن به صفحه اصلی</Link>
        </div>
    );
}
