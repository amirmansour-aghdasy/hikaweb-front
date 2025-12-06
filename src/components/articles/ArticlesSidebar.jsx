"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiTrendingUp } from "react-icons/hi";
import { FiMail } from "react-icons/fi";
import { BsClock, BsEye } from "react-icons/bs";
import toast from "react-hot-toast";
import clsx from "clsx";

export default function ArticlesSidebar({
  popularArticles = [],
  categories = [],
  showNewsletter = true,
  showPopular = true,
  showCategories = true,
  className,
}) {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("لطفاً یک ایمیل معتبر وارد کنید");
      return;
    }
    toast.success("عضویت شما با موفقیت انجام شد!");
    setEmail("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <aside className={clsx("space-y-6", className)} aria-label="Sidebar">
      {/* Newsletter */}
      {showNewsletter && (
        <div
          className={clsx(
            "bg-gradient-to-br from-teal-600 to-teal-700",
            "rounded-2xl p-6",
            "text-white",
            "shadow-lg"
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <FiMail className="w-6 h-6" />
            <h3 className="text-xl font-bold">عضویت در خبرنامه</h3>
          </div>
          <p className="text-sm text-teal-50 mb-4 leading-relaxed">
            با عضویت در خبرنامه، از آخرین مقالات و اخبار تکنولوژی باخبر شوید.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="آدرس ایمیل شما"
              className={clsx(
                "w-full px-4 py-3 rounded-lg",
                "bg-white/10 backdrop-blur-sm",
                "border border-white/20",
                "text-white placeholder:text-white/70",
                "focus:outline-none focus:ring-2 focus:ring-white/50",
                "transition-all"
              )}
              required
              aria-label="آدرس ایمیل"
            />
            <button
              type="submit"
              className={clsx(
                "w-full px-4 py-3 rounded-lg",
                "bg-white text-teal-700",
                "font-semibold",
                "hover:bg-teal-50",
                "transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-600"
              )}
            >
              عضویت
            </button>
          </form>
        </div>
      )}

      {/* Popular Articles */}
      {showPopular && popularArticles.length > 0 && (
        <div
          className={clsx(
            "bg-white dark:bg-slate-800",
            "rounded-2xl shadow-md p-3.5",
            "border border-slate-200 dark:border-slate-700"
          )}
        >
          <div className="flex items-center gap-2 mb-6">
            <HiTrendingUp className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              مقالات پربازدید
            </h3>
          </div>
          <div className="space-y-4">
            {popularArticles.slice(0, 5).map((article) => {
              const title = article.title?.fa || article.title;
              const slug = article.slug?.fa || article.slug?.en || article.slug;
              const image = article.featuredImage || "/assets/images/post-thumb-1.webp";
              
              return (
                <Link
                  key={article._id}
                  href={`/mag/${slug}`}
                  className={clsx(
                    "group flex items-start gap-3 p-3 rounded-xl",
                    "hover:bg-slate-50 dark:hover:bg-slate-700",
                    "transition-colors duration-200"
                  )}
                >
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-1">
                      {title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <BsEye className="w-3 h-3" />
                        <span>{(article.views || 0).toLocaleString("fa-IR")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BsClock className="w-3 h-3" />
                        <span>{article.readTime || 5} دقیقه</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Categories */}
      {showCategories && categories.length > 0 && (
        <div
          className={clsx(
            "bg-white dark:bg-slate-800",
            "rounded-2xl shadow-md p-6",
            "border border-slate-200 dark:border-slate-700"
          )}
        >
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            دسته‌بندی‌ها
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/mag?category=${category._id}`}
                className={clsx(
                  "px-4 py-2",
                  "bg-slate-100 dark:bg-slate-700",
                  "hover:bg-teal-50 dark:hover:bg-teal-900/20",
                  "text-slate-700 dark:text-slate-300",
                  "hover:text-teal-700 dark:hover:text-teal-400",
                  "rounded-lg text-sm font-medium",
                  "transition-colors duration-200",
                  "border border-transparent hover:border-teal-200 dark:hover:border-teal-700"
                )}
              >
                {category.name?.fa || category.name}
                {category.count !== undefined && (
                  <span className="mr-1 text-xs opacity-75">({category.count})</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

