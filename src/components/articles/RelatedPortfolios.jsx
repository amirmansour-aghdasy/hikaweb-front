"use client";

import Link from "next/link";
import Image from "next/image";
import { BsEye } from "react-icons/bs";
import { FiArrowLeft } from "react-icons/fi";

export default function RelatedPortfolios({ portfolios = [] }) {
    if (!portfolios || portfolios.length === 0) {
        return null;
    }

    return (
        <section className="w-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">نمونه کارهای مرتبط</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {portfolios.map((portfolio) => {
                    const title = portfolio.title?.fa || portfolio.title;
                    const slug = portfolio.slug?.fa || portfolio.slug?.en || portfolio.slug;
                    const image = portfolio.featuredImage || "/assets/images/portfolio-placeholder.jpg";
                    const description = portfolio.shortDescription?.fa || portfolio.description?.fa || "";
                    
                    return (
                        <Link
                            key={portfolio._id}
                            href={`/portfolio/${slug}`}
                            className="group block rounded-xl bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700"
                        >
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                <Image
                                    src={image}
                                    alt={title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                {/* Views Badge */}
                                {portfolio.views > 0 && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        <BsEye className="w-3 h-3" />
                                        <span>{portfolio.views}</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                    {title}
                                </h3>
                                {description && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                        {description}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-sm font-medium">
                                    <span>مشاهده پروژه</span>
                                    <FiArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

