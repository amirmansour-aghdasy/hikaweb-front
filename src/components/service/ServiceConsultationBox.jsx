"use client";

import { useState } from "react";
import { HiPhone, HiX } from "react-icons/hi";
import { HiMiniSparkles } from "react-icons/hi2";
import toast from "react-hot-toast";
import { apiClient } from "@/services/api/client";
import { validatePhoneNumber, validateEmail, sanitizeText } from "@/lib/utils/sanitize";

export default function ServiceConsultationBox({ serviceName, serviceSlug, serviceId }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [formData, setFormData] = useState({
        phone: "",
        fullName: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!validatePhoneNumber(formData.phone)) {
            toast.error("لطفاً شماره موبایل معتبر وارد کنید");
            return;
        }

        if (!formData.fullName || formData.fullName.trim().length < 2) {
            toast.error("لطفاً نام و نام خانوادگی را وارد کنید");
            return;
        }

        if (!serviceId) {
            toast.error("خطا: شناسه خدمت یافت نشد");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                phone: formData.phone,
                fullName: sanitizeText(formData.fullName.trim()),
                serviceId: serviceId,
            };
            
            await apiClient.post("/consultations/simple", payload);
            
            toast.success("درخواست مشاوره شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.");
            
            // Reset form and collapse
            setFormData({ phone: "", fullName: "" });
            setIsExpanded(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.";
            toast.error(errorMessage);
            console.error("Consultation form error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:px-6 md:pb-6 pointer-events-none">
            <div className="max-w-7xl mx-auto">
                <div className={`bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-800 dark:to-teal-900 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out pointer-events-auto ${
                    isExpanded ? 'p-4 md:p-6' : 'p-4'
                }`}>
                    {!isExpanded ? (
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <HiMiniSparkles className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-bold text-base md:text-lg mb-1">
                                        مشاوره رایگان برای {serviceName}
                                    </h3>
                                    <p className="text-white/90 text-sm hidden md:block">
                                        همین الان با ما تماس بگیرید و از مشاوره رایگان بهره‌مند شوید
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="flex-shrink-0 flex items-center gap-2 bg-white text-teal-600 px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base hover:bg-teal-50 transition-colors shadow-lg"
                            >
                                <HiPhone className="w-5 h-5" />
                                <span className="hidden md:inline">درخواست مشاوره</span>
                                <span className="md:hidden">مشاوره</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <HiMiniSparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">
                                            درخواست مشاوره برای {serviceName}
                                        </h3>
                                        <p className="text-white/90 text-sm">
                                            اطلاعات خود را وارد کنید تا با شما تماس بگیریم
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                                >
                                    <HiX className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-5 space-y-3 md:space-y-4">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: sanitizeText(e.target.value) })}
                                    maxLength={100}
                                    className="w-full rounded-lg outline-none bg-slate-50 dark:bg-slate-700 p-3 text-sm border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-teal-400/20"
                                    placeholder="نام و نام خانوادگی"
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                                    className="w-full rounded-lg outline-none bg-slate-50 dark:bg-slate-700 p-3 text-sm border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-right placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-teal-400/20"
                                    placeholder="شماره موبایل"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-teal-300 disabled:to-teal-400 disabled:cursor-not-allowed text-white font-bold p-3.5 text-sm md:text-base transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            <span>در حال ارسال...</span>
                                        </>
                                    ) : (
                                        <>
                                            <HiPhone className="w-5 h-5" />
                                            <span>ارسال درخواست مشاوره</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

