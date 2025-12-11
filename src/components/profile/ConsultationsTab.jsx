"use client";

import { useState, useEffect, useMemo } from "react";
import { BsChatDots, BsClock, BsCheckCircle, BsXCircle, BsExclamationCircle } from "react-icons/bs";
import { apiClient } from "@/services/api/client";
import toast from "react-hot-toast";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "./Pagination";

const statusConfig = {
    new: { label: "جدید", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: <BsExclamationCircle className="w-4 h-4" /> },
    contacted: { label: "تماس گرفته شده", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <BsClock className="w-4 h-4" /> },
    in_discussion: { label: "در حال مذاکره", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: <BsChatDots className="w-4 h-4" /> },
    proposal_sent: { label: "پیشنهاد ارسال شده", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", icon: <BsClock className="w-4 h-4" /> },
    accepted: { label: "پذیرفته شده", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: <BsCheckCircle className="w-4 h-4" /> },
    rejected: { label: "رد شده", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: <BsXCircle className="w-4 h-4" /> },
    converted: { label: "تبدیل شده", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400", icon: <BsCheckCircle className="w-4 h-4" /> },
};

export default function ConsultationsTab({ user, searchQuery = "" }) {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 10; // Default limit per page

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        setPage(1); // Reset page when search query changes
        fetchConsultations(1, debouncedSearchQuery);
    }, [debouncedSearchQuery]);

    useEffect(() => {
        fetchConsultations(page, debouncedSearchQuery);
    }, [page]);

    const fetchConsultations = async (pageNum = page, currentSearchQuery = "") => {
        try {
            setLoading(true);
            const searchParam = currentSearchQuery ? `&search=${encodeURIComponent(currentSearchQuery)}` : "";
            const response = await apiClient.get(`/consultations/my?page=${pageNum}&limit=${LIMIT}${searchParam}`);
            // Response structure: { success: true, data: [...], pagination: {...} }
            const fetchedConsultations = response.data || [];
            const pagination = response.pagination || {};
            
            const calculatedTotalPages = pagination.totalPages || (pagination.total ? Math.ceil(pagination.total / LIMIT) : 1);
            setConsultations(fetchedConsultations);
            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error("Error fetching consultations:", error);
            if (error.status === 403 || error.message?.includes("insufficientPermissions")) {
                // User doesn't have permission - show empty state
                setConsultations([]);
            } else if (error.status !== 401) {
                toast.error("خطا در دریافت درخواست‌های مشاوره");
            }
            // Set empty state on error
            setConsultations([]);
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

    // Filter consultations based on search query
    const filteredConsultations = useMemo(() => {
        if (!debouncedSearchQuery.trim()) {
            return consultations;
        }

        const query = debouncedSearchQuery.toLowerCase().trim();
        return consultations.filter(consultation => {
            const fullName = (consultation.fullName || "").toLowerCase();
            const email = (consultation.email || "").toLowerCase();
            const phoneNumber = (consultation.phoneNumber || "").toLowerCase();
            const serviceNames = (consultation.services || [])
                .map(s => (typeof s === 'object' ? (s.name?.fa || s.name || "") : s))
                .join(" ")
                .toLowerCase();
            
            return fullName.includes(query) || 
                   email.includes(query) || 
                   phoneNumber.includes(query) ||
                   serviceNames.includes(query);
        });
    }, [consultations, debouncedSearchQuery]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
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
        } catch {
            return "";
        }
    };

    const getServiceNames = (services) => {
        if (!services || services.length === 0) return "خدمت نامشخص";
        return services
            .map(s => typeof s === 'object' ? (s.name?.fa || s.name || "خدمت") : s)
            .join("، ");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">درخواست‌های مشاوره</h2>
            </div>

            {loading && consultations.length === 0 ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 animate-pulse">
                            <div className="flex items-start justify-between mb-3">
                                <div className="space-y-2 flex-1">
                                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                                </div>
                                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-24"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredConsultations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BsChatDots className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                        {debouncedSearchQuery ? "نتیجه‌ای یافت نشد" : "هنوز درخواست مشاوره‌ای ثبت نکرده‌اید"}
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                        {debouncedSearchQuery 
                            ? "لطفاً عبارت جستجوی دیگری امتحان کنید" 
                            : "برای دریافت مشاوره رایگان، از طریق فرم مشاوره درخواست خود را ثبت کنید"
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredConsultations.map((consultation) => {
                        const status = consultation.requestStatus || consultation.status || "new";
                        const statusInfo = statusConfig[status] || statusConfig.new;
                        const serviceNames = getServiceNames(consultation.services);

                        return (
                            <div
                                key={consultation._id}
                                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                                {consultation.fullName || "نامشخص"}
                                            </h3>
                                        </div>
                                        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                            {consultation.email && (
                                                <p className="flex items-center gap-2">
                                                    <span>ایمیل:</span>
                                                    <span>{consultation.email}</span>
                                                </p>
                                            )}
                                            {consultation.phoneNumber && (
                                                <p className="flex items-center gap-2">
                                                    <span>تلفن:</span>
                                                    <span>{consultation.phoneNumber}</span>
                                                </p>
                                            )}
                                            {serviceNames && (
                                                <p className="flex items-center gap-2">
                                                    <span>خدمت:</span>
                                                    <span>{serviceNames}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                            {statusInfo.icon}
                                            {statusInfo.label}
                                        </span>
                                        {consultation.createdAt && (
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {formatDate(consultation.createdAt)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {consultation.projectDescription && (
                                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                            {consultation.projectDescription}
                                        </p>
                                    </div>
                                )}
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
