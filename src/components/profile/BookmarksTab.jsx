"use client";

import { useState } from "react";
import { MdOutlineArticle } from "react-icons/md";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { FaBriefcase } from "react-icons/fa";

export default function BookmarksTab({ user }) {
    const [activeSubTab, setActiveSubTab] = useState(0);

    const subTabs = [
        { id: 0, label: "مقالات", icon: <MdOutlineArticle className="w-5 h-5" /> },
        { id: 1, label: "ویدئوها", icon: <HiOutlineVideoCamera className="w-5 h-5" /> },
        { id: 2, label: "نمونه کارها", icon: <FaBriefcase className="w-5 h-5" /> },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">نشان‌گذاری‌ها</h2>
            
            {/* Sub Tabs */}
            <div className="border-b border-slate-200">
                <div className="flex gap-1">
                    {subTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                                ${activeSubTab === tab.id
                                    ? "text-teal-600 border-b-2 border-teal-600"
                                    : "text-slate-600 hover:text-slate-800"
                                }
                            `}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="py-8">
                {activeSubTab === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <p>مقالات نشان‌گذاری شده</p>
                        <p className="text-sm mt-2">در حال توسعه...</p>
                    </div>
                )}
                {activeSubTab === 1 && (
                    <div className="text-center py-12 text-slate-500">
                        <p>ویدئوهای نشان‌گذاری شده</p>
                        <p className="text-sm mt-2">در حال توسعه...</p>
                    </div>
                )}
                {activeSubTab === 2 && (
                    <div className="text-center py-12 text-slate-500">
                        <p>نمونه کارهای نشان‌گذاری شده</p>
                        <p className="text-sm mt-2">در حال توسعه...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

