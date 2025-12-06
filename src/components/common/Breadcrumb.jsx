"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { HiHome } from "react-icons/hi";

export default function Breadcrumb({ items = [] }) {
    const pathname = usePathname();
    
    // Don't show breadcrumb on home page
    if (pathname === '/') {
        return null;
    }
    
    // Auto-generate breadcrumb from pathname if items not provided
    const breadcrumbItems = items.length > 0 ? items : (() => {
        const paths = pathname.split('/').filter(Boolean);
        const result = [{ name: "صفحه اصلی", url: "/" }];
        
        let currentPath = '';
        paths.forEach((path, index) => {
            currentPath += `/${path}`;
            // Map common paths to Persian names
            const pathMap = {
                'blog': 'بلاگ',
                'mag': 'هیکا مگ',
                'service': 'خدمات',
                'auth': 'احراز هویت',
                'profile': 'پروفایل',
                'about-us': 'درباره ما',
                'portfolio': 'نمونه کارها',
                'contact-us': 'تماس با ما',
                'reset-password': 'بازیابی رمز عبور',
                'forgot-password': 'فراموشی رمز عبور',
                'seo-and-optimization': 'سئو و بینه سازی',
                'hika-studio': 'هیکا استودیو',
                'graphic-design': 'طراحی گرافیک',
                'printing': 'چاپ و تبلیغات محیطی',
                'social-marketing': 'مدیریت شبکه های اجتماعی',
                'content-and-editing': 'تولید محتوا و تدوین',
                'logo-design': 'طراحی لوگو و برند سازی',
                'web-design': 'طراحی و برنامه نویسی وبسایت',
            };
            
            const name = pathMap[path] || decodeURIComponent(path);
            result.push({ name, url: currentPath });
        });
        
        return result;
    })();

    return (
        <div className="w-full bg-white dark:bg-slate-900 mt-5 md:mt-14 transition-colors duration-300">
            <div className="w-full">
                <div className="flex items-center justify-between">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" aria-label="Breadcrumb">
                        <Link 
                            href="/" 
                            className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        >
                            <HiHome className="w-4 h-4" />
                        </Link>
                        {breadcrumbItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="text-slate-400 dark:text-slate-600">/</span>
                                {index === breadcrumbItems.length - 1 ? (
                                    <span className="text-teal-600 dark:text-teal-400 font-medium line-clamp-1 max-w-xs">
                                        {item.name}
                                    </span>
                                ) : (
                                    <Link 
                                        href={item.url} 
                                        className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-1 max-w-xs"
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Back Button - Material Design */}
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                        aria-label="بازگشت"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

