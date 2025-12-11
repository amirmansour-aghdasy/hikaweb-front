"use client";

import { HiChevronRight, HiChevronLeft } from "react-icons/hi";

export default function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    loading = false,
    className = "" 
}) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            // Show all pages if total pages is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push('...');
            }
            
            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) {
                    pages.push(i);
                }
            }
            
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            
            // Always show last page
            pages.push(totalPages);
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className={`
                    flex items-center justify-center w-10 h-10 rounded-lg border transition-colors
                    ${currentPage === 1 || loading
                        ? "border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-teal-500 dark:hover:border-teal-400"
                    }
                `}
                aria-label="صفحه قبلی"
            >
                <HiChevronRight className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-2 text-slate-500 dark:text-slate-400"
                            >
                                ...
                            </span>
                        );
                    }

                    const isActive = page === currentPage;

                    return (
                        <button
                            key={page}
                            onClick={() => !loading && onPageChange(page)}
                            disabled={loading}
                            className={`
                                min-w-[40px] h-10 px-3 rounded-lg border transition-colors font-medium
                                ${isActive
                                    ? "bg-teal-600 dark:bg-teal-700 text-white border-teal-600 dark:border-teal-700"
                                    : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-teal-500 dark:hover:border-teal-400"
                                }
                                ${loading ? "opacity-50 cursor-not-allowed" : ""}
                            `}
                            aria-label={`صفحه ${page}`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className={`
                    flex items-center justify-center w-10 h-10 rounded-lg border transition-colors
                    ${currentPage === totalPages || loading
                        ? "border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-teal-500 dark:hover:border-teal-400"
                    }
                `}
                aria-label="صفحه بعدی"
            >
                <HiChevronLeft className="w-5 h-5" />
            </button>
        </div>
    );
}

