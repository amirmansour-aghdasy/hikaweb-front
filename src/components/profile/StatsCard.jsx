"use client";

export default function StatsCard({ title, value, subtitle, icon, color = "teal" }) {
    const colorClasses = {
        teal: "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
        blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
        green: "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400",
        orange: "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
        purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
        red: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex w-full items-center justify-between gap-3">
                <div className="flex-1 min-w-0 text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                    <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
                    )}
                </div>
                {icon && (
                    <div className={`${colorClasses[color]} p-3 rounded-lg flex-shrink-0`}>
                        <div className="w-5 h-5">
                            {icon}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

