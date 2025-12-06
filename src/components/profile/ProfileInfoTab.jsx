"use client";

import { useState, useEffect, useRef } from "react";
import { BsPerson, BsEnvelope, BsTelephone, BsCalendar, BsPencil, BsCheck, BsX } from "react-icons/bs";
import { apiClient } from "@/services/api/client";
import toast from "react-hot-toast";
import useAuthStore from "@/lib/store/authStore";
import OTPInput from "@/components/forms/OTPInput";
import { validatePhoneNumber } from "@/lib/utils/sanitize";

export default function ProfileInfoTab({ user, onUpdate }) {
    const { refreshUser, sendOTP, user: storeUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    // Use storeUser if available, otherwise fallback to prop
    const currentUser = storeUser || user;
    const [formData, setFormData] = useState({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        phoneNumber: currentUser?.phoneNumber || "",
        language: currentUser?.language || "fa",
    });
    const [loading, setLoading] = useState(false);
    
    // Phone verification state
    const [phoneVerificationStep, setPhoneVerificationStep] = useState(null); // null | 'sending' | 'verifying'
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [otpSentTime, setOtpSentTime] = useState(null);
    const [resendCooldown, setResendCooldown] = useState(0);
    const originalPhoneNumber = useRef(currentUser?.phoneNumber || "");

    // Update formData when user changes (from store)
    useEffect(() => {
        if (storeUser) {
            const newPhone = storeUser?.phoneNumber || "";
            setFormData({
                name: storeUser?.name || "",
                email: storeUser?.email || "",
                phoneNumber: newPhone,
                language: storeUser?.language || "fa",
            });
            originalPhoneNumber.current = newPhone;
        }
    }, [storeUser]);
    
    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleEdit = () => {
        setIsEditing(true);
        const phone = currentUser?.phoneNumber || "";
        setFormData({
            name: currentUser?.name || "",
            email: currentUser?.email || "",
            phoneNumber: phone,
            language: currentUser?.language || "fa",
        });
        originalPhoneNumber.current = phone;
        setPhoneVerificationStep(null);
        setNewPhoneNumber("");
        setOtpCode("");
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: currentUser?.name || "",
            email: currentUser?.email || "",
            phoneNumber: currentUser?.phoneNumber || "",
            language: currentUser?.language || "fa",
        });
        setPhoneVerificationStep(null);
        setNewPhoneNumber("");
        setOtpCode("");
    };
    
    const handleSendPhoneOTP = async () => {
        const phoneToVerify = formData.phoneNumber.trim();
        
        if (!validatePhoneNumber(phoneToVerify)) {
            toast.error("لطفاً شماره موبایل معتبر وارد کنید");
            return;
        }
        
        if (phoneToVerify === originalPhoneNumber.current) {
            // Phone number hasn't changed, no need to verify
            handleSave();
            return;
        }
        
        try {
            setPhoneVerificationStep('sending');
            await sendOTP(phoneToVerify);
            setNewPhoneNumber(phoneToVerify);
            setPhoneVerificationStep('verifying');
            setOtpSentTime(Date.now());
            setResendCooldown(120);
            toast.success("کد تأیید به شماره موبایل جدید ارسال شد");
        } catch (error) {
            setPhoneVerificationStep(null);
            toast.error(error.message || "خطا در ارسال کد تأیید");
        }
    };
    
    const handleVerifyPhoneOTP = async (otp = null) => {
        const codeToVerify = otp || otpCode;
        
        if (!codeToVerify || codeToVerify.length !== 6) {
            toast.error("لطفاً کد تأیید ۶ رقمی را وارد کنید");
            return;
        }
        
        try {
            setLoading(true);
            const response = await apiClient.post("/auth/profile/verify-phone", {
                phoneNumber: newPhoneNumber,
                otp: codeToVerify,
            });
            
            if (response.data) {
                toast.success("شماره موبایل با موفقیت به‌روزرسانی شد");
                setPhoneVerificationStep(null);
                setOtpCode("");
                
                // Refresh user data
                const updatedUser = await refreshUser();
                if (updatedUser) {
                    setFormData({
                        name: updatedUser.name || "",
                        email: updatedUser.email || "",
                        phoneNumber: updatedUser.phoneNumber || "",
                        language: updatedUser.language || "fa",
                    });
                    originalPhoneNumber.current = updatedUser.phoneNumber || "";
                    if (onUpdate) {
                        onUpdate(updatedUser);
                    }
                }
                
                // Now save other fields (name, language) if changed
                await handleSaveOtherFields();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "کد تأیید نادرست است");
            setOtpCode("");
        } finally {
            setLoading(false);
        }
    };
    
    const handleSaveOtherFields = async () => {
        try {
            const response = await apiClient.put("/auth/profile", {
                name: formData.name,
                language: formData.language,
                // Don't update phoneNumber here, it's already updated via OTP verification
            });
            
            if (response.data) {
                const updatedUser = await refreshUser();
                if (updatedUser && onUpdate) {
                    onUpdate(updatedUser);
                }
            }
        } catch (error) {
            console.error("Error saving other fields:", error);
        }
    };
    
    const handleResendPhoneOTP = async () => {
        if (resendCooldown > 0 || loading) {
            return;
        }
        
        try {
            await sendOTP(newPhoneNumber);
            setOtpSentTime(Date.now());
            setResendCooldown(120);
            setOtpCode("");
            toast.success("کد تأیید مجدداً ارسال شد");
        } catch (error) {
            toast.error(error.message || "خطا در ارسال مجدد کد تأیید");
        }
    };

    const handleSave = async () => {
        // Check if phone number has changed
        const phoneChanged = formData.phoneNumber.trim() !== originalPhoneNumber.current;
        
        if (phoneChanged) {
            // Phone number changed, need to verify with OTP
            await handleSendPhoneOTP();
            return;
        }
        
        // Phone number hasn't changed, save normally
        setLoading(true);
        try {
            const response = await apiClient.put("/auth/profile", {
                name: formData.name,
                language: formData.language,
                // Don't send phoneNumber if it hasn't changed
            });

            if (response.data) {
                toast.success("اطلاعات پروفایل با موفقیت به‌روزرسانی شد");
                setIsEditing(false);
                
                // Always refresh user data from server to get latest data
                let updatedUser = response.data?.data?.user;
                
                // If response doesn't have user, fetch from server
                if (!updatedUser) {
                    updatedUser = await refreshUser();
                } else {
                    // Update store with user from response
                    useAuthStore.setState({ user: updatedUser });
                }
                
                if (updatedUser) {
                    // Update local formData
                    setFormData({
                        name: updatedUser.name || "",
                        email: updatedUser.email || "",
                        phoneNumber: updatedUser.phoneNumber || "",
                        language: updatedUser.language || "fa",
                    });
                    originalPhoneNumber.current = updatedUser.phoneNumber || "";
                    // Update parent component
                    if (onUpdate) {
                        onUpdate(updatedUser);
                    }
                }
            }
        } catch (error) {
            toast.error(error.message || "خطا در به‌روزرسانی اطلاعات");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">اطلاعات پروفایل</h2>
                {!isEditing && (
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 dark:bg-teal-700 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-800 transition-colors"
                    >
                        <BsPencil className="w-4 h-4" />
                        <span>ویرایش</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <BsPerson className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">نام و نام خانوادگی</p>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
                                placeholder="نام و نام خانوادگی"
                            />
                        ) : (
                            <p className="text-slate-800 dark:text-slate-200 font-medium">{currentUser?.name || "ثبت نشده"}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <BsEnvelope className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">ایمیل</p>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{currentUser?.email || "ثبت نشده"}</p>
                        {currentUser?.isEmailVerified && (
                            <span className="text-xs text-green-600 dark:text-green-400 mt-1 inline-block">✓ تأیید شده</span>
                        )}
                    </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <BsTelephone className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">شماره موبایل</p>
                        {isEditing ? (
                            <div className="space-y-3">
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    disabled={phoneVerificationStep === 'verifying' || phoneVerificationStep === 'sending'}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="09123456789"
                                />
                                
                                {phoneVerificationStep === 'sending' && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400">در حال ارسال کد تأیید...</p>
                                )}
                                
                                {phoneVerificationStep === 'verifying' && (
                                    <div className="space-y-3 p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg border border-teal-200 dark:border-teal-700">
                                        <p className="text-sm text-teal-800 dark:text-teal-200 font-medium">
                                            کد تأیید به شماره {newPhoneNumber} ارسال شد
                                        </p>
                                        <OTPInput
                                            length={6}
                                            value={otpCode}
                                            onChange={setOtpCode}
                                            onComplete={(code) => handleVerifyPhoneOTP(code)}
                                            autoSubmit={true}
                                            onSubmit={handleVerifyPhoneOTP}
                                            disabled={loading}
                                        />
                                        <div className="flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={handleResendPhoneOTP}
                                                disabled={resendCooldown > 0 || loading}
                                                className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed"
                                            >
                                                {resendCooldown > 0 ? `ارسال مجدد (${resendCooldown} ثانیه)` : "ارسال مجدد کد"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPhoneVerificationStep(null);
                                                    setOtpCode("");
                                                    setFormData({ ...formData, phoneNumber: originalPhoneNumber.current });
                                                }}
                                                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                            >
                                                لغو
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <p className="text-slate-800 dark:text-slate-200 font-medium">{currentUser?.phoneNumber || "ثبت نشده"}</p>
                                {currentUser?.isPhoneNumberVerified && (
                                    <span className="text-xs text-green-600 dark:text-green-400 mt-1 inline-block">✓ تأیید شده</span>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Language */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <BsCalendar className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">زبان</p>
                        {isEditing ? (
                            <select
                                value={formData.language}
                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
                            >
                                <option value="fa">فارسی</option>
                                <option value="en">English</option>
                            </select>
                        ) : (
                            <p className="text-slate-800 dark:text-slate-200 font-medium">
                                {currentUser?.language === "fa" ? "فارسی" : "English"}
                            </p>
                        )}
                    </div>
                </div>

                {/* Created At */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <BsCalendar className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">تاریخ عضویت</p>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">
                            {currentUser?.createdAt
                                ? new Intl.DateTimeFormat("fa-IR", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                  }).format(new Date(currentUser.createdAt))
                                : "نامشخص"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        <BsX className="w-4 h-4" />
                        <span>لغو</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 dark:bg-teal-700 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <BsCheck className="w-4 h-4" />
                        <span>{loading ? "در حال ذخیره..." : "ذخیره"}</span>
                    </button>
                </div>
            )}
        </div>
    );
}

