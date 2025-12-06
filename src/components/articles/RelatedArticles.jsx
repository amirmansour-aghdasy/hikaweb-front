"use client";

import Link from "next/link";
import Image from "next/image";
import { BsClock, BsEye } from "react-icons/bs";
import { FiArrowLeft } from "react-icons/fi";

export default function RelatedArticles({ articles = [] }) {
    if (!articles || articles.length === 0) {
        return null;
    }

    return (
        <section className="w-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-teal-600 to-cyan-500 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">مقالات مرتبط</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => {
                    const title = article.title?.fa || article.title;
                    const slug = article.slug?.fa || article.slug?.en || article.slug;
                    const image = article.featuredImage || "/assets/images/post-thumb-1.webp";
                    const excerpt = article.excerpt?.fa || article.shortDescription?.fa || "";
                    
                    return (
                        <Link
                            key={article._id}
                            href={`/mag/${slug}`}
                            className="group block rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
                        >
                            <div className="relative h-40 overflow-hidden bg-slate-100">
                                <Image
                                    src={image}
                                    alt={title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                                    {title}
                                </h3>
                                {excerpt && (
                                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                        {excerpt}
                                    </p>
                                )}
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <BsClock className="w-3 h-3" />
                                            <span>{article.readTime || 5} دقیقه</span>
                                        </div>
                                        {article.views > 0 && (
                                            <div className="flex items-center gap-1">
                                                <BsEye className="w-3 h-3" />
                                                <span>{article.views}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-teal-600">
                                        <span>مطالعه</span>
                                        <FiArrowLeft className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

