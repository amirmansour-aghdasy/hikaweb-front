"use client";

import Image from "next/image";
import Link from "next/link";
import { BsClock, BsCalendar, BsEye, BsPerson } from "react-icons/bs";
import { HiOutlineFire } from "react-icons/hi";

export default function ArticleSidebar({ article, author, publishedAt, readTime, views, categories = [], tags = [] }) {
    const authorName = author?.name || "تیم هیکاوب";
    const authorAvatar = author?.avatar || "/assets/images/team-member.png";
    const authorEmail = author?.email || "";
    const authorBio = author?.bio || "";

    // Format date
    const date = new Date(publishedAt);
    const formattedDate = new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);

    return (
        <div className="space-y-6">
            {/* Author Box - Sticky */}
            <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-teal-100 dark:ring-teal-900/30">
                        <Image
                            src={authorAvatar}
                            alt={authorName}
                            fill
                            className="object-cover"
                            sizes="96px"
                        />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{authorName}</h3>
                    {authorEmail && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{authorEmail}</p>
                    )}
                    {authorBio && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{authorBio}</p>
                    )}
                </div>

                {/* Article Meta */}
                <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <BsCalendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <BsClock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        <span>{readTime} دقیقه مطالعه</span>
                    </div>
                    {views > 0 && (
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <BsEye className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            <span>{views.toLocaleString('fa-IR')} بازدید</span>
                        </div>
                    )}
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">دسته‌بندی‌ها</h4>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Link
                                    key={category._id}
                                    href={`/mag?category=${category._id}`}
                                    className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-medium transition-colors"
                                >
                                    {category.name?.fa || category.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {(() => {
                    const tagsArray = tags?.fa || (Array.isArray(tags) ? tags : []);
                    return tagsArray.length > 0 && (
                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">برچسب‌ها</h4>
                            <div className="flex flex-wrap gap-2">
                                {tagsArray.map((tag, index) => {
                                    const tagText = typeof tag === 'string' ? tag : (tag.fa || tag);
                                    return (
                                        <Link
                                            key={index}
                                            href={`/mag?search=${encodeURIComponent(tagText)}`}
                                            className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-medium transition-colors"
                                        >
                                            #{tagText}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}


            </div>
        </div>
    );
}

