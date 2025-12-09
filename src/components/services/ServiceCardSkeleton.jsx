"use client";

export default function ServiceCardSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 animate-pulse">
            {/* Image Skeleton */}
            <div className="w-full h-48 md:h-56 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"></div>
            
            {/* Content Skeleton */}
            <div className="p-5 md:p-6 space-y-4">
                {/* Title Skeleton */}
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                
                {/* Description Skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
                </div>
                
                {/* Features Skeleton */}
                <div className="space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                </div>
                
                {/* Buttons Skeleton */}
                <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}

