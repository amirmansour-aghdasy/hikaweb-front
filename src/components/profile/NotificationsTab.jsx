"use client";

import { useState, useEffect, useMemo } from "react";
import { HiBell, HiCheck, HiTrash, HiChevronRight, HiSearch } from "react-icons/hi";
import { HiBell as HiBellV2 } from "react-icons/hi2";
import { apiClient } from "@/services/api/client";
import toast from "react-hot-toast";
import Link from "next/link";
import Pagination from "./Pagination";

const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
        case 'ticket_new':
        case 'ticket_updated':
        case 'ticket_assigned':
        case 'ticket_resolved':
            return <HiBellV2 className={`${iconClass} text-blue-500`} />;
        case 'consultation_new':
        case 'consultation_assigned':
            return <HiBellV2 className={`${iconClass} text-teal-500`} />;
        case 'comment_new':
        case 'comment_approved':
        case 'comment_rejected':
            return <HiBellV2 className={`${iconClass} text-purple-500`} />;
        case 'article_published':
        case 'service_created':
        case 'portfolio_created':
            return <HiBellV2 className={`${iconClass} text-green-500`} />;
        case 'task_assigned':
        case 'task_updated':
            return <HiBellV2 className={`${iconClass} text-orange-500`} />;
        case 'calendar_event':
            return <HiBellV2 className={`${iconClass} text-indigo-500`} />;
        default:
            return <HiBell className={`${iconClass} text-slate-500`} />;
    }
};

const formatTime = (date) => {
    try {
        const now = new Date();
        const notificationDate = new Date(date);
        const diffInSeconds = Math.floor((now - notificationDate) / 1000);
        
        if (diffInSeconds < 60) return "همین الان";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} دقیقه پیش`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ساعت پیش`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} روز پیش`;
        
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(notificationDate);
    } catch {
        return "اخیراً";
    }
};

export default function NotificationsTab({ user, searchQuery = "" }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [markingAsRead, setMarkingAsRead] = useState(null);
    const LIMIT = 10; // Default limit per page

    useEffect(() => {
        fetchNotifications(page, searchQuery);
    }, [page, searchQuery]);

    const fetchNotifications = async (pageNum = 1, currentSearchQuery = "") => {
        setLoading(true);
        try {
            const searchParam = currentSearchQuery ? `&search=${encodeURIComponent(currentSearchQuery)}` : "";
            const response = await apiClient.get(`/notifications?page=${pageNum}&limit=${LIMIT}${searchParam}`);
            // Response structure: { success: true, data: [...], pagination: {...} }
            const fetchedNotifications = response.data || [];
            const pagination = response.pagination || {};
            
            const calculatedTotalPages = pagination.totalPages || (pagination.total ? Math.ceil(pagination.total / LIMIT) : 1);
            setNotifications(fetchedNotifications);
            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("خطا در دریافت اعلان‌ها");
            setNotifications([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        setMarkingAsRead(notificationId);
        try {
            await apiClient.patch(`/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
            );
            toast.success("اعلان به عنوان خوانده شده علامت‌گذاری شد");
            // Refresh stats
            window.dispatchEvent(new Event('refreshStats'));
        } catch (error) {
            console.error("Error marking as read:", error);
            toast.error("خطا در به‌روزرسانی اعلان");
        } finally {
            setMarkingAsRead(null);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await apiClient.patch("/notifications/read-all");
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success("همه اعلان‌ها به عنوان خوانده شده علامت‌گذاری شدند");
            // Refresh stats
            window.dispatchEvent(new Event('refreshStats'));
        } catch (error) {
            console.error("Error marking all as read:", error);
            toast.error("خطا در به‌روزرسانی اعلان‌ها");
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await apiClient.delete(`/notifications/${notificationId}`);
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
            toast.success("اعلان حذف شد");
            // Refresh stats
            window.dispatchEvent(new Event('refreshStats'));
        } catch (error) {
            console.error("Error deleting notification:", error);
            toast.error("خطا در حذف اعلان");
        }
    };


    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Use notifications directly since search is handled by API
    const filteredNotifications = notifications;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">اعلان‌ها</h2>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm whitespace-nowrap"
                    >
                        <HiCheck className="w-4 h-4" />
                        همه را خوانده شده ({unreadCount})
                    </button>
                )}
            </div>

            {loading && notifications.length === 0 ? (
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="p-4 animate-pulse">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <HiBell className="w-16 h-16 text-slate-300 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                        {searchQuery ? "نتیجه‌ای یافت نشد" : "اعلانی وجود ندارد"}
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                        {searchQuery ? "لطفاً عبارت جستجوی دیگری امتحان کنید" : "وقتی اعلان جدیدی داشته باشید، اینجا نمایش داده می‌شود"}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((notification) => {
                        const isUnread = !notification.isRead;
                        const title = notification.title?.fa || notification.title || "اعلان";
                        const message = notification.message?.fa || notification.message || "";
                        
                        return (
                            <div
                                key={notification._id}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    isUnread 
                                        ? 'bg-teal-50 border-teal-200 shadow-md' 
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className={`font-semibold text-base ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {title}
                                            </h3>
                                            {isUnread && (
                                                <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-2" />
                                            )}
                                        </div>
                                        {message && (
                                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                                {message}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-slate-400">
                                                {formatTime(notification.createdAt)}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification._id)}
                                                        disabled={markingAsRead === notification._id}
                                                        className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 px-2 py-1 rounded hover:bg-teal-50 transition-colors disabled:opacity-50"
                                                    >
                                                        <HiCheck className="w-4 h-4" />
                                                        خوانده شد
                                                    </button>
                                                )}
                                                {notification.actionUrl && (
                                                    <Link
                                                        href={notification.actionUrl}
                                                        onClick={() => handleMarkAsRead(notification._id)}
                                                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                                                    >
                                                        مشاهده
                                                        <HiChevronRight className="w-4 h-4" />
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(notification._id)}
                                                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                                >
                                                    <HiTrash className="w-4 h-4" />
                                                    حذف
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    {totalPages > 1 ? (
                        <div className="mt-8">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                loading={loading}
                            />
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}

