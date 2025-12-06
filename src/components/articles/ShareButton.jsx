"use client";

import { GoShareAndroid } from "react-icons/go";
import toast from "react-hot-toast";

export default function ShareButton({ title, excerpt, url }) {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: excerpt || "",
                    url: url || window.location.href,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Error sharing:", err);
                }
            }
        } else {
            navigator.clipboard.writeText(url || window.location.href);
            toast.success('لینک مقاله کپی شد!');
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-teal-600 dark:hover:bg-teal-600 hover:text-white text-slate-700 dark:text-slate-300 transition-all duration-300"
        >
            <GoShareAndroid className="w-5 h-5" />
        </button>
    );
}

