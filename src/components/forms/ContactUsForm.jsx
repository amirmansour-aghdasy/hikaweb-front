"use client";

import { useState } from "react";
import { apiClient } from "@/services/api/client";
import toast from "react-hot-toast";
import { validatePhoneNumber, validateEmail, sanitizeText } from "@/lib/utils/sanitize";

const ContactUsForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || formData.fullName.trim().length < 2) {
            toast.error("لطفاً نام و نام خانوادگی را وارد کنید (حداقل 2 کاراکتر)");
            return;
        }

        if (!validatePhoneNumber(formData.phoneNumber)) {
            toast.error("لطفاً شماره موبایل معتبر وارد کنید");
            return;
        }

        if (!formData.email || !validateEmail(formData.email)) {
            toast.error("لطفاً ایمیل معتبر وارد کنید");
            return;
        }

        if (!formData.message || formData.message.trim().length < 10) {
            toast.error("لطفاً پیام خود را وارد کنید (حداقل 10 کاراکتر)");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                fullName: sanitizeText(formData.fullName),
                phoneNumber: formData.phoneNumber.trim(),
                email: formData.email.toLowerCase().trim(),
                message: sanitizeText(formData.message)
            };

            await apiClient.post("/contact-messages", payload);

            toast.success("از اینکه برای ما پیام فرستادید ممنونیم. به زودی با شما تماس خواهیم گرفت.");

            // Reset form
            setFormData({
                fullName: "",
                phoneNumber: "",
                email: "",
                message: ""
            });
        } catch (error) {
            const errorMessage = error.data?.message || error.message || "خطا در ارسال پیام. لطفاً دوباره تلاش کنید.";
            toast.error(errorMessage);
            console.error("Contact form error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full rounded-2xl bg-[#008987] dark:bg-teal-800 flex flex-col gap-3.5 pb-5 md:pb-10 pt-5 md:pt-10 transition-colors duration-300">
            <h2 className="text-xs text-slate-700 dark:text-slate-200 rounded-xl bg-white dark:bg-slate-800 shadow-md px-3.5 py-2 mx-auto transition-colors duration-300" data-aos="fade-down">تماس با ما</h2>
            <div className="w-full flex justify-center items-center">
                <span className="w-full h-0.5 bg-white dark:bg-slate-700" data-aos="fade-left" />
                <span className="text-xs text-slate-700 dark:text-slate-200 whitespace-nowrap rounded-xl bg-white dark:bg-slate-800 shadow-md px-3.5 py-2 transition-colors duration-300" data-aos="zoom-out">
                    ما پس از دریافت پیام تا 24 ساعت آینده با شما تماس خواهیم گرفت.
                </span>
                <span className="w-full h-0.5 bg-white dark:bg-slate-700" data-aos="fade-right" />
            </div>
            <div className="w-11/12 md:w-10/12 mx-auto flex flex-col gap-3.5 mt-3.5 md:mt-0">
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-lg text-sm p-2.5 md:p-3.5 placeholder:text-xs border border-[#0E443C] dark:border-teal-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-colors duration-300"
                    placeholder="نام و نام خانوادگی"
                    required
                    disabled={isSubmitting}
                    data-aos="fade-left"
                />
                <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full rounded-lg text-sm p-2.5 md:p-3.5 placeholder:text-xs border border-[#0E443C] dark:border-teal-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-colors duration-300"
                    placeholder="شماره همراه"
                    required
                    disabled={isSubmitting}
                    data-aos="fade-right"
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg text-sm p-2.5 md:p-3.5 placeholder:text-xs border border-[#0E443C] dark:border-teal-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-colors duration-300"
                    placeholder="ایمیل خود را وارد نمائید"
                    required
                    disabled={isSubmitting}
                    data-aos="zoom-out"
                />
                <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-lg text-sm p-2.5 md:p-3.5 placeholder:text-xs border border-[#0E443C] dark:border-teal-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-colors duration-300"
                    placeholder="پیام خود را بنویسید"
                    required
                    disabled={isSubmitting}
                    data-aos="zoom-in"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-[#0E443C] dark:text-slate-200 font-bold text-sm rounded-lg p-2.5 md:p-3.5 border border-white dark:border-slate-700 bg-[#E2E8F0] dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 shadow-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    data-aos="fade-up"
                >
                    {isSubmitting ? "در حال ارسال..." : "ثبت درخواست"}
                </button>
            </div>
        </form>
    );
};

export default ContactUsForm;
