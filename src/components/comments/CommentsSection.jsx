"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/services/api/client";
import useAuthStore from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { BsStar, BsStarFill } from "react-icons/bs";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

export default function CommentsSection({ 
    resourceType, 
    resourceId, 
    resourceTitle = "" 
}) {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);

    useEffect(() => {
        fetchComments();
    }, [resourceType, resourceId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/comments`, {
                params: {
                    referenceType: resourceType.toLowerCase(),
                    referenceId: resourceId,
                    status: 'approved',
                    limit: 50,
                    sortBy: 'createdAt',
                    sortOrder: 'desc'
                }
            });
            setComments(response.data?.data || []);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            toast.error("برای ثبت نظر باید وارد حساب کاربری خود شوید");
            router.push(`/auth?redirect=${window.location.pathname}`);
            return;
        }

        if (!commentText.trim() || commentText.trim().length < 10) {
            toast.error("نظر باید حداقل ۱۰ کاراکتر باشد");
            return;
        }

        try {
            setSubmitting(true);
            const response = await apiClient.post('/comments', {
                content: commentText.trim(),
                rating,
                referenceType: resourceType.toLowerCase(),
                referenceId: resourceId
            });

            toast.success("نظر شما ثبت شد و پس از تایید نمایش داده می‌شود");
            setCommentText("");
            setRating(5);
            fetchComments();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "خطا در ثبت نظر";
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="w-full bg-white dark:bg-slate-800 rounded-xl p-6 md:p-8 shadow-md">
            <div className="flex items-center gap-3 mb-6">
                <HiOutlineChatBubbleLeftRight className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    نظرات ({comments.length})
                </h2>
            </div>

            {/* Comment Form */}
            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            امتیاز شما
                        </label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    {(hoveredRating >= star || rating >= star) ? (
                                        <BsStarFill className="w-6 h-6 text-yellow-400" />
                                    ) : (
                                        <BsStar className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                                    )}
                                </button>
                            ))}
                            <span className="text-sm text-slate-600 dark:text-slate-400 mr-2">
                                {rating} از 5
                            </span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            نظر شما
                        </label>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="نظر خود را بنویسید... (حداقل ۱۰ کاراکتر)"
                            rows={4}
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                            required
                            minLength={10}
                            maxLength={1000}
                        />
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-left">
                            {commentText.length}/1000
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || commentText.trim().length < 10}
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "در حال ارسال..." : "ثبت نظر"}
                    </button>
                </form>
            ) : (
                <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        برای ثبت نظر باید وارد حساب کاربری خود شوید
                    </p>
                    <button
                        onClick={() => router.push(`/auth?redirect=${window.location.pathname}`)}
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        ورود / ثبت نام
                    </button>
                </div>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    <HiOutlineChatBubbleLeftRight className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>هنوز نظری ثبت نشده است</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                {comment.authorSnapshot?.avatar ? (
                                    <Image
                                        src={comment.authorSnapshot.avatar}
                                        alt={comment.authorSnapshot.name || "کاربر"}
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                                        <span className="text-teal-600 dark:text-teal-400 font-bold">
                                            {(comment.authorSnapshot?.name || "کاربر").charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                            {comment.authorSnapshot?.name || "کاربر"}
                                        </h4>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <BsStarFill
                                                    key={star}
                                                    className={`w-4 h-4 ${
                                                        star <= comment.rating
                                                            ? 'text-yellow-400'
                                                            : 'text-slate-300 dark:text-slate-600'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                        {formatDate(comment.createdAt)}
                                    </p>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

