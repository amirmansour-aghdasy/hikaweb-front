"use client";

import { HiSparkles, HiUsers, HiBriefcase, HiTrophy, HiHeart } from "react-icons/hi2";

const stats = [
    {
        icon: HiBriefcase,
        value: "25+",
        label: "پروژه موفق",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
        icon: HiUsers,
        value: "100+",
        label: "مشتری راضی",
        color: "text-teal-600 dark:text-teal-400",
        bgColor: "bg-teal-100 dark:bg-teal-900/30",
    },
    {
        icon: HiTrophy,
        value: "4+",
        label: "سال تجربه",
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
        icon: HiHeart,
        value: "98%",
        label: "رضایت مشتری",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/30",
    },
];

export default function StatsSection() {
    return (
        <section className="w-full py-8 md:py-12 bg-gradient-to-br from-slate-50 via-teal-50/50 to-slate-50 dark:from-slate-900 dark:via-teal-950/30 dark:to-slate-900 rounded-2xl md:rounded-3xl" data-aos="zoom-in">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-4">
                        <HiSparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        <span className="text-sm md:text-base font-semibold text-teal-700 dark:text-teal-300">
                            آمار و دستاوردهای هیکاوب
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                        ما به موفقیت شما متعهدیم
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-600"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full ${stat.bgColor} mb-3 md:mb-4`}>
                                    <Icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
                                </div>
                                <div className={`text-2xl md:text-4xl font-bold ${stat.color} mb-2`}>
                                    {stat.value}
                                </div>
                                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

