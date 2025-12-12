"use client";

import { useState, useEffect } from "react";
import { MdOutlineMenuBook } from "react-icons/md";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function TableOfContents({ headings = [] }) {
    const [activeHeading, setActiveHeading] = useState("");
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveHeading(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0% -35% 0%" }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });

        return () => {
            headings.forEach((heading) => {
                const element = document.getElementById(heading.id);
                if (element) observer.unobserve(element);
            });
        };
    }, [headings]);

    const scrollToHeading = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Offset for sticky header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            // Use scrollIntoView for better browser compatibility
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            
            // Fallback: also use window.scrollTo
            setTimeout(() => {
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }, 100);
        }
    };

    if (headings.length === 0) return null;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 border border-slate-200 dark:border-slate-700">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between mb-3 text-base font-semibold text-slate-800 dark:text-slate-100"
            >
                <div className="flex items-center gap-2">
                    <MdOutlineMenuBook className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>راهنمای مطالعه</span>
                </div>
                {isExpanded ? (
                    <FiChevronUp className="w-4 h-4" />
                ) : (
                    <FiChevronDown className="w-4 h-4" />
                )}
            </button>

            {isExpanded && (
                <nav className="space-y-2">
                    {headings.map((heading, index) => (
                        <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.id)}
                            className={`w-full text-right pr-4 rounded-lg transition-all duration-200 ${
                                activeHeading === heading.id
                                    ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-bold border-r-4 border-teal-600 dark:border-teal-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"
                            }`}
                            style={{ paddingRight: `${heading.level * 1}rem` }}
                        >
                            {heading.text}
                        </button>
                    ))}
                </nav>
            )}
        </div>
    );
}

