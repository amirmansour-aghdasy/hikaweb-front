"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { apiClient } from "@/services/api/client";
import toast from "react-hot-toast";
import { BsTicket, BsPlus, BsArrowLeft, BsSend, BsPaperclip, BsClock, BsCheckCircle, BsXCircle, BsExclamationCircle } from "react-icons/bs";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";

const statusColors = {
    open: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    waiting_customer: "bg-yellow-100 text-yellow-700",
    resolved: "bg-teal-100 text-teal-700",
    closed: "bg-slate-100 text-slate-700",
};

const priorityColors = {
    low: "text-slate-500",
    normal: "text-blue-500",
    high: "text-orange-500",
    urgent: "text-red-500",
};

const priorityLabels = {
    low: "کم",
    normal: "عادی",
    high: "بالا",
    urgent: "فوری",
};

const statusLabels = {
    open: "باز",
    in_progress: "در حال بررسی",
    waiting_customer: "در انتظار پاسخ",
    resolved: "حل شده",
    closed: "بسته شده",
};

export default function TicketsTab({ user, onStatsChange, searchQuery = "" }) {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [messageContent, setMessageContent] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [creatingTicket, setCreatingTicket] = useState(false);
    const [hasCreatePermission, setHasCreatePermission] = useState(true);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const [newTicket, setNewTicket] = useState({
        subject: "",
        description: "",
        department: "general",
        priority: "normal",
    });

    // Filter tickets based on search query - MUST be before early returns
    const filteredTickets = useMemo(() => {
        if (!debouncedSearchQuery.trim()) {
            return tickets;
        }

        const query = debouncedSearchQuery.toLowerCase().trim();
        return tickets.filter(ticket => {
            const subject = (ticket.subject || "").toLowerCase();
            const ticketNumber = (ticket.ticketNumber || ticket._id.slice(-8) || "").toLowerCase();
            const department = (ticket.department === "technical" ? "فنی" :
                                ticket.department === "billing" ? "مالی" :
                                ticket.department === "sales" ? "فروش" :
                                ticket.department === "general" ? "عمومی" : "").toLowerCase();
            return subject.includes(query) || 
                   ticketNumber.includes(query) ||
                   department.includes(query);
        });
    }, [tickets, debouncedSearchQuery]);

    useEffect(() => {
        fetchTickets();
        // Check if user has tickets.create permission
        // user.role can be an object (from /auth/me) or a string (from JWT)
        const roleName = typeof user?.role === 'string' ? user?.role : user?.role?.name;
        const userPermissions = user?.role?.permissions || user?.permissions || [];
        const canCreate = userPermissions.includes('tickets.create') || 
                         roleName === 'super_admin' ||
                         roleName === 'admin';
        setHasCreatePermission(canCreate);
    }, [user]);

    useEffect(() => {
        if (selectedTicket) {
            scrollToBottom();
        }
    }, [selectedTicket]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get("/tickets?limit=50");
            setTickets(response.data?.data || response.data || []);
        } catch (error) {
            if (error.status === 403 || error.message?.includes("insufficientPermissions")) {
                setHasCreatePermission(false);
            }
            // Silent error for 403 - user might not have permission to read tickets
            if (error.status !== 403) {
                toast.error("خطا در دریافت تیکت‌ها");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchTicketDetails = async (ticketId) => {
        try {
            const response = await apiClient.get(`/tickets/${ticketId}`);
            setSelectedTicket(response.data?.ticket || response.data || null);
        } catch (error) {
            toast.error("خطا در دریافت جزئیات تیکت");
        }
    };

    const handleTicketClick = (ticket) => {
        fetchTicketDetails(ticket._id);
    };

    const handleBackToList = () => {
        setSelectedTicket(null);
        fetchTickets(); // Refresh list
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageContent.trim() || sendingMessage) return;

        try {
            setSendingMessage(true);
            await apiClient.post(`/tickets/${selectedTicket._id}/messages`, {
                content: messageContent.trim(),
            });
            setMessageContent("");
            await fetchTicketDetails(selectedTicket._id);
            toast.success("پیام ارسال شد");
        } catch (error) {
            toast.error(error.message || "خطا در ارسال پیام");
        } finally {
            setSendingMessage(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        if (!newTicket.subject.trim() || !newTicket.description.trim() || creatingTicket) return;

        try {
            setCreatingTicket(true);
            const response = await apiClient.post("/tickets", newTicket);
            toast.success("تیکت با موفقیت ایجاد شد");
            setShowCreateForm(false);
            setNewTicket({
                subject: "",
                description: "",
                department: "general",
                priority: "normal",
            });
            await fetchTickets();
            // Refresh stats after creating ticket
            if (onStatsChange) {
                onStatsChange();
            } else {
                window.dispatchEvent(new Event('refreshStats'));
            }
            if (response.data?.ticket) {
                handleTicketClick(response.data.ticket);
            }
        } catch (error) {
            if (error.status === 403 || error.message?.includes("insufficientPermissions") || error.message?.includes("دسترسی")) {
                toast.error("شما دسترسی ایجاد تیکت ندارید. لطفاً با مدیر سیستم تماس بگیرید.");
            } else {
                toast.error(error.message || "خطا در ایجاد تیکت");
            }
        } finally {
            setCreatingTicket(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return "همین الان";
        if (minutes < 60) return `${minutes} دقیقه پیش`;
        if (hours < 24) return `${hours} ساعت پیش`;
        if (days < 7) return `${days} روز پیش`;

        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    };

    if (selectedTicket) {
        return (
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700 mb-4">
                    <button
                        onClick={handleBackToList}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <BsArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{selectedTicket.subject}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[selectedTicket.ticketStatus || selectedTicket.status] || statusColors.open}`}>
                                {statusLabels[selectedTicket.ticketStatus || selectedTicket.status] || "باز"}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                #{selectedTicket.ticketNumber || selectedTicket._id.slice(-8)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2"
                    style={{ maxHeight: "calc(100vh - 400px)" }}
                >
                    {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                        selectedTicket.messages.map((message, index) => {
                            const authorId = typeof message.author === 'object' ? message.author._id || message.author.id : message.author;
                            const userId = user._id || user.id;
                            const isOwnMessage = authorId === userId;
                            return (
                                <div
                                    key={index}
                                    className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center overflow-hidden">
                                            {message.author?.avatar ? (
                                                <Image
                                                    src={message.author.avatar}
                                                    alt={message.author.name}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="text-teal-600 dark:text-teal-400 font-semibold">
                                                    {message.author?.name?.[0] || "U"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`flex-1 ${isOwnMessage ? "items-end" : "items-start"} flex flex-col`}>
                                        <div
                                            className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                                                isOwnMessage
                                                    ? "bg-teal-500 dark:bg-teal-600 text-white rounded-tr-sm"
                                                    : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                                            }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                        </div>
                                        <div className={`flex items-center gap-2 mt-1 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {formatDate(message.createdAt)}
                                            </span>
                                            {isOwnMessage && (
                                                <BsCheckCircle className="w-3 h-3 text-teal-500 dark:text-teal-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            <p>هنوز پیامی ارسال نشده است</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="افزودن فایل"
                        >
                            <BsPaperclip className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                        <input
                            type="text"
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            placeholder="پیام خود را بنویسید..."
                            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent"
                            disabled={sendingMessage}
                        />
                        <button
                            type="submit"
                            disabled={!messageContent.trim() || sendingMessage}
                            className="px-6 py-2 bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {sendingMessage ? (
                                <BsClock className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <BsSend className="w-5 h-5" />
                                    <span className="hidden sm:inline">ارسال</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    if (showCreateForm) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">ایجاد تیکت جدید</h2>
                    <button
                        onClick={() => setShowCreateForm(false)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <BsXCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleCreateTicket} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            موضوع تیکت <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={newTicket.subject}
                            onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                            placeholder="موضوع تیکت را وارد کنید"
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent"
                            required
                            maxLength={200}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            توضیحات <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={newTicket.description}
                            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                            placeholder="توضیحات تیکت را وارد کنید"
                            rows={6}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent resize-none"
                            required
                            minLength={10}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                بخش
                            </label>
                            <select
                                value={newTicket.department}
                                onChange={(e) => setNewTicket({ ...newTicket, department: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent"
                            >
                                <option value="general">عمومی</option>
                                <option value="technical">فنی</option>
                                <option value="billing">مالی</option>
                                <option value="sales">فروش</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                اولویت
                            </label>
                            <select
                                value={newTicket.priority}
                                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent"
                            >
                                <option value="low">کم</option>
                                <option value="normal">عادی</option>
                                <option value="high">بالا</option>
                                <option value="urgent">فوری</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={creatingTicket || !newTicket.subject.trim() || !newTicket.description.trim()}
                            className="flex-1 px-6 py-3 bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {creatingTicket ? "در حال ایجاد..." : "ایجاد تیکت"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowCreateForm(false)}
                            className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                        >
                            انصراف
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">تیکت‌ها</h2>
                {hasCreatePermission && (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                        <BsPlus className="w-5 h-5" />
                        <span className="hidden sm:inline">تیکت جدید</span>
                    </button>
                )}
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 animate-pulse">
                            <div className="flex items-start justify-between mb-3">
                                <div className="space-y-2 flex-1">
                                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                                </div>
                                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                            </div>
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : tickets.length === 0 ? (
                <div className="text-center py-12">
                    <BsTicket className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 mb-4">هنوز تیکتی ایجاد نکرده‌اید</p>
                    {hasCreatePermission && (
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                        >
                            ایجاد اولین تیکت
                        </button>
                    )}
                </div>
            ) : filteredTickets.length === 0 && debouncedSearchQuery ? (
                <div className="text-center py-12">
                    <BsTicket className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 mb-2">نتیجه‌ای یافت نشد</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">لطفاً عبارت جستجوی دیگری امتحان کنید</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                                <tr>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">موضوع</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300 hidden md:table-cell">بخش</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300 hidden lg:table-cell">اولویت</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">وضعیت</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300 hidden lg:table-cell">تاریخ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredTickets.map((ticket) => (
                                    <tr
                                        key={ticket._id}
                                        onClick={() => handleTicketClick(ticket)}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <BsTicket className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium text-slate-800 dark:text-slate-200">{ticket.subject}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                                                        #{ticket.ticketNumber || ticket._id.slice(-8)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 hidden md:table-cell">
                                            {ticket.department === "technical" && "فنی"}
                                            {ticket.department === "billing" && "مالی"}
                                            {ticket.department === "sales" && "فروش"}
                                            {ticket.department === "general" && "عمومی"}
                                        </td>
                                        <td className="px-4 py-4 hidden lg:table-cell">
                                            <span className={`text-sm font-medium ${priorityColors[ticket.priority] || priorityColors.normal}`}>
                                                {priorityLabels[ticket.priority] || "عادی"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[ticket.ticketStatus || ticket.status] || statusColors.open}`}>
                                                {statusLabels[ticket.ticketStatus || ticket.status] || "باز"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                                            {formatDate(ticket.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
