"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { apiClient } from "@/services/api/client";
import { validatePhoneNumber, validateEmail, sanitizeText } from "@/lib/utils/sanitize";

const CounselingForm = () => {
    const [services, setServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [formData, setFormData] = useState({
        phone: "",
        firstName: "",
        lastName: "",
        email: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingServices, setLoadingServices] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await apiClient.get("/services?lang=fa&limit=100");
                
                // Response structure from backend: { success: true, data: [...], pagination: {...} }
                // apiClient returns the JSON directly, so response is the object
                let servicesList = [];
                
                if (response?.data && Array.isArray(response.data)) {
                    servicesList = response.data;
                } else if (response?.services && Array.isArray(response.services)) {
                    servicesList = response.services;
                } else if (Array.isArray(response)) {
                    servicesList = response;
                }
                
                if (servicesList.length === 0) {
                    console.warn("No services found in response:", response);
                }
                
                setServices(servicesList);
            } catch (error) {
                console.error("Error fetching services:", error);
                toast.error("خطا در دریافت لیست خدمات");
            } finally {
                setLoadingServices(false);
            }
        };

        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!validatePhoneNumber(formData.phone)) {
            toast.error("لطفاً شماره موبایل معتبر وارد کنید");
            return;
        }

        if (!formData.firstName || !formData.lastName) {
            toast.error("لطفاً نام و نام خانوادگی را وارد کنید");
            return;
        }

        if (formData.email && !validateEmail(formData.email)) {
            toast.error("فرمت ایمیل نامعتبر است");
            return;
        }

        if (!selectedServiceId) {
            toast.error("لطفاً خدمت مورد نظر را انتخاب کنید");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                phone: formData.phone,
                firstName: sanitizeText(formData.firstName),
                lastName: sanitizeText(formData.lastName),
                serviceId: selectedServiceId,
            };
            
            // Only include email if it's provided and not empty
            if (formData.email && formData.email.trim()) {
                payload.email = formData.email.toLowerCase().trim();
            }
            
            await apiClient.post("/consultations/simple", payload);
            
            toast.success("درخواست مشاوره شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.");
            
            // Reset form
            setFormData({ phone: "", firstName: "", lastName: "", email: "" });
            setSelectedServiceId("");
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.";
            toast.error(errorMessage);
            console.error("Consultation form error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 md:gap-4 p-3 md:p-3.5 rounded-2xl border border-teal-500 shadow-md shadow-teal-500" data-aos="fade-right" data-aos-delay="250">
            <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                className="w-full rounded-md outline-none bg-slate-50 p-3 md:p-3.5 text-sm placeholder:text-right"
                placeholder="شماره موبایل"
                required
            />
            <div className="flex items-center gap-1.5 md:gap-4">
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: sanitizeText(e.target.value) })}
                    maxLength={50}
                    className="w-full rounded-md outline-none bg-slate-50 p-3 md:p-3.5 text-sm"
                    placeholder="نام"
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: sanitizeText(e.target.value) })}
                    maxLength={50}
                    className="w-full rounded-md outline-none bg-slate-50 p-3 md:p-3.5 text-sm"
                    placeholder="نام خانوادگی"
                    required
                />
            </div>
            <div className="relative">
                <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    disabled={loadingServices}
                    required
                    className={`
                        w-full rounded-md bg-slate-50 p-3 md:p-3.5 text-sm
                        border border-transparent
                        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                        appearance-none cursor-pointer
                        text-right
                        ${loadingServices ? "opacity-50 cursor-not-allowed" : ""}
                        ${selectedServiceId ? "text-slate-700" : "text-slate-400"}
                    `}
                    style={{
                        backgroundImage: loadingServices 
                            ? "none" 
                            : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 0.75rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em 1.5em",
                        paddingLeft: "0.75rem",
                        paddingRight: "2.5rem",
                    }}
                >
                    <option value="" disabled>
                        {loadingServices ? "در حال بارگذاری..." : "خدمت مورد نظر را انتخاب کنید"}
                    </option>
                    {services.length > 0 ? (
                        services.map((service) => {
                            const serviceId = service._id || service.id;
                            const serviceName = service.name?.fa || service.name?.en || service.name || "خدمت بدون نام";
                            return (
                                <option key={serviceId} value={serviceId}>
                                    {serviceName}
                                </option>
                            );
                        })
                    ) : (
                        !loadingServices && (
                            <option value="" disabled>
                                خدمتی یافت نشد
                            </option>
                        )
                    )}
                </select>
                {/* Debug info - remove after fixing */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="text-xs text-red-500 mt-1">
                        Services count: {services.length} | Loading: {loadingServices ? 'Yes' : 'No'}
                    </div>
                )}
            </div>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase().trim() })}
                onBlur={(e) => {
                    if (e.target.value && !validateEmail(e.target.value)) {
                        toast.error("فرمت ایمیل نامعتبر است");
                    }
                }}
                className="w-full rounded-md outline-none bg-slate-50 p-2.5 md:p-3.5 text-sm"
                placeholder="ایمیل (اختیاری)"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md outline-none bg-teal-500 hover:bg-teal-700 disabled:bg-teal-300 disabled:cursor-not-allowed text-white font-bold p-3 md:p-3.5 text-sm transition-colors duration-300 ease-in-out"
            >
                {isSubmitting ? "در حال ارسال..." : "درخواست مشاوره"}
            </button>
        </form>
    );
};

export default CounselingForm;
