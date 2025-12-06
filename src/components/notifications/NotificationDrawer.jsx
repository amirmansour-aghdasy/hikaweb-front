"use client";

import { useState, useEffect, useRef } from "react";
import { HiX, HiCheck, HiTrash, HiChevronRight } from "react-icons/hi";
import { HiBell } from "react-icons/hi2";
import { apiClient } from "@/services/api/client";
import toast from "react-hot-toast";
import Link from "next/link";
// Format time helper
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

const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
        case 'ticket_new':
        case 'ticket_updated':
        case 'ticket_assigned':
        case 'ticket_resolved':
            return <HiBell className={`${iconClass} text-blue-500`} />;
        case 'consultation_new':
        case 'consultation_assigned':
            return <HiBell className={`${iconClass} text-teal-500`} />;
        case 'comment_new':
        case 'comment_approved':
        case 'comment_rejected':
            return <HiBell className={`${iconClass} text-purple-500`} />;
        case 'article_published':
        case 'service_created':
        case 'portfolio_created':
            return <HiBell className={`${iconClass} text-green-500`} />;
        case 'task_assigned':
        case 'task_updated':
            return <HiBell className={`${iconClass} text-orange-500`} />;
        case 'calendar_event':
            return <HiBell className={`${iconClass} text-indigo-500`} />;
        default:
            return <HiBell className={`${iconClass} text-slate-500`} />;
    }
};

const getNotificationColor = (type, priority) => {
    if (priority === 'urgent') return 'bg-red-50 border-red-200';
    if (priority === 'high') return 'bg-orange-50 border-orange-200';
    if (priority === 'normal') return 'bg-white border-slate-200';
    return 'bg-slate-50 border-slate-200';
};

export default function NotificationDrawer({ isOpen, onClose, onCountUpdate, anchorRef }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [markingAsRead, setMarkingAsRead] = useState(null);
    const drawerRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    // Close drawer when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                drawerRef.current &&
                !drawerRef.current.contains(event.target) &&
                anchorRef?.current &&
                !anchorRef.current.contains(event.target)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose, anchorRef]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get("/notifications?limit=20&isRead=false");
            const fetchedNotifications = response.data?.data || [];
            setNotifications(fetchedNotifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("خطا در دریافت اعلان‌ها");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        setMarkingAsRead(notificationId);
        try {
            await apiClient.patch(`/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
            );
            
            // Update unread count
            const unreadCount = notifications.filter(n => !n.isRead && n._id !== notificationId).length;
            if (onCountUpdate) {
                onCountUpdate(unreadCount);
            }
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
            if (onCountUpdate) {
                onCountUpdate(0);
            }
            toast.success("همه اعلان‌ها به عنوان خوانده شده علامت‌گذاری شدند");
        } catch (error) {
            console.error("Error marking all as read:", error);
            toast.error("خطا در به‌روزرسانی اعلان‌ها");
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await apiClient.delete(`/notifications/${notificationId}`);
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
            
            // Update unread count
            const deletedNotification = notifications.find(n => n._id === notificationId);
            if (deletedNotification && !deletedNotification.isRead) {
                const unreadCount = notifications.filter(n => !n.isRead && n._id !== notificationId).length;
                if (onCountUpdate) {
                    onCountUpdate(unreadCount);
                }
            }
            toast.success("اعلان حذف شد");
        } catch (error) {
            console.error("Error deleting notification:", error);
            toast.error("خطا در حذف اعلان");
        }
    };


    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
            
            {/* Drawer */}
            <div
                ref={drawerRef}
                className="fixed top-0 left-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col animate-slide-in-left"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-teal-600 to-teal-700">
                    <div className="flex items-center gap-3">
                        <HiBell className="w-6 h-6 text-white" />
                        <h2 className="text-white font-bold text-lg">اعلان‌ها</h2>
                        {notifications.filter(n => !n.isRead).length > 0 && (
                            <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {notifications.filter(n => !n.isRead).length} خوانده نشده
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {notifications.filter(n => !n.isRead).length > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-white/90 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                همه را خوانده شده
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                        >
                            <HiX className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                            <HiBell className="w-16 h-16 text-slate-300 mb-4" />
                            <p className="text-slate-500 text-lg font-medium">اعلانی وجود ندارد</p>
                            <p className="text-slate-400 text-sm mt-2">وقتی اعلان جدیدی داشته باشید، اینجا نمایش داده می‌شود</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {notifications.map((notification) => {
                                const isUnread = !notification.isRead;
                                const title = notification.title?.fa || notification.title || "اعلان";
                                const message = notification.message?.fa || notification.message || "";
                                
                                return (
                                    <div
                                        key={notification._id}
                                        className={`p-4 hover:bg-slate-50 transition-colors ${
                                            isUnread ? 'bg-teal-50/50' : ''
                                        } ${getNotificationColor(notification.type, notification.priority)} border-r-4 ${
                                            isUnread ? 'border-teal-500' : 'border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <h3 className={`font-semibold text-sm mb-1 ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                                                            {title}
                                                        </h3>
                                                        {message && (
                                                            <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                                                                {message}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-slate-400">
                                                            {formatTime(notification.createdAt)}
                                                        </p>
                                                    </div>
                                                    {isUnread && (
                                                        <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-1.5" />
                                                    )}
                                                </div>
                                                
                                                {notification.actionUrl && (
                                                    <Link
                                                        href={notification.actionUrl}
                                                        onClick={() => handleMarkAsRead(notification._id)}
                                                        className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 mt-2 font-medium"
                                                    >
                                                        مشاهده
                                                        <HiChevronRight className="w-4 h-4" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
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
                                            <button
                                                onClick={() => handleDelete(notification._id)}
                                                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                            >
                                                <HiTrash className="w-4 h-4" />
                                                حذف
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50">
                    <Link
                        href="/profile?tab=notifications"
                        onClick={onClose}
                        className="block w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium py-2"
                    >
                        مشاهده همه اعلان‌ها
                    </Link>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes slide-in-left {
                    from {
                        transform: translateX(-100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.3s ease-out;
                }
            `}</style>
        </>
    );
}

