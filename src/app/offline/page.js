"use client";

import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function OfflinePage() {
    return (
        <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="w-full max-w-2xl mx-auto px-5 py-10 text-center">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12 transition-colors duration-300" data-aos="zoom-in">
                    <div className="mb-8">
                        <Image
                            src="/assets/logo/large-logo-text.png"
                            alt="هیکاوب"
                            width={200}
                            height={60}
                            className="mx-auto"
                            priority
                        />
                    </div>
                    
                    <div className="mb-6">
                        <svg
                            className="w-24 h-24 mx-auto text-slate-400 dark:text-slate-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                            />
                        </svg>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                        شما آفلاین هستید
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        به نظر می‌رسد اتصال اینترنت شما قطع شده است. لطفاً اتصال خود را بررسی کنید و دوباره تلاش کنید.
                    </p>
                    
                    <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 rounded-xl p-6 mb-8">
                        <p className="text-base text-slate-700 dark:text-slate-300">
                            برخی از صفحات ممکن است از قبل در حافظه کش ذخیره شده باشند.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-teal-600 dark:bg-teal-700 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-800 transition-colors duration-300"
                        >
                            تلاش مجدد
                        </button>
                        <Link
                            href="/"
                            className="px-6 py-3 bg-slate-700 dark:bg-slate-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors duration-300"
                        >
                            بازگشت به صفحه اصلی
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

