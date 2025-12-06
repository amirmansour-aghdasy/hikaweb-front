"use client";

import { useState } from "react";
import { HiStar } from "react-icons/hi";
import toast from "react-hot-toast";

export default function RatingWidget({ articleId, averageRating = 0, totalRatings = 0, userRating = null, onRate }) {
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRatingClick = async (rating) => {
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            await onRate(rating);
        } catch (error) {
            toast.error("خطا در ثبت امتیاز");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col items-center md:items-start">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">امتیاز دهید</h3>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRatingClick(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    disabled={isSubmitting}
                                    className={`transition-all duration-200 ${
                                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
                                    }`}
                                >
                                    <HiStar
                                        className={`w-8 h-8 ${
                                            star <= (hoveredRating || userRating || 0)
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-slate-300 dark:text-slate-600'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {averageRating > 0 && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-bold text-slate-800 dark:text-slate-200">{averageRating.toFixed(1)}</span>
                                <span>({totalRatings} امتیاز)</span>
                            </div>
                        )}
                    </div>
                </div>
        </div>
    );
}

