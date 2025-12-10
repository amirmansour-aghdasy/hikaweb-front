"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { FaGoogle, FaLinkedinIn } from "react-icons/fa6";
import { HiMiniDevicePhoneMobile } from "react-icons/hi2";
import Image from "next/image";
import toast from "react-hot-toast";

import useAuthStore from "@/lib/store/authStore";
import { validatePhoneNumber, validateEmail } from "@/lib/utils/sanitize";
import OTPInput from "@/components/forms/OTPInput";

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/profile";
    
    const { sendOTP, verifyOTP, checkUserType, oauthLogin, isLoading, isAuthenticated } = useAuthStore();
    
    const [step, setStep] = useState("phoneNumber"); // phoneNumber | code | register
    const [phoneNumber, setPhoneNumber] = useState("");
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [userType, setUserType] = useState(null); // 'existing' | 'new'
    const isSubmittingRef = useRef(false);
    const [otpSentTime, setOtpSentTime] = useState(null);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if (isAuthenticated) {
            // Add a small delay to ensure state is fully updated
            const timer = setTimeout(() => {
                router.push(redirect);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, router, redirect]);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        
        if (!validatePhoneNumber(phoneNumber)) {
            toast.error("لطفاً شماره موبایل معتبر وارد کنید (مثال: 09123456789)");
            return;
        }

        try {
            // Check if user exists
            const userCheck = await checkUserType(phoneNumber);
            const exists = userCheck?.exists ?? userCheck?.data?.exists ?? false;
            const userTypeValue = exists ? "existing" : "new";
            setUserType(userTypeValue);
            
            // Clear name and email if existing user
            if (exists) {
                setName("");
                setEmail("");
            }
            
            // Send OTP
            await sendOTP(phoneNumber);
            setStep("code");
            // Reset submission flag when moving to code step
            isSubmittingRef.current = false;
            // Set OTP sent time for resend cooldown
            setOtpSentTime(Date.now());
            setResendCooldown(120); // 2 minutes cooldown
        } catch (error) {
            console.error("Error sending OTP:", error);
            // On error, assume new user
            setUserType("new");
        }
    };

    const handleVerifyOTP = async (e, otpCode = null) => {
        // Prevent double submission
        if (isSubmittingRef.current || isLoading) {
            return;
        }

        // Allow calling without event (for auto-submit)
        if (e) {
            e.preventDefault();
        }
        
        // Use provided code or state code
        const codeToVerify = otpCode || code;
        
        if (!codeToVerify || codeToVerify.length !== 6) {
            toast.error("لطفاً کد تأیید 6 رقمی را وارد کنید");
            return;
        }

        try {
            isSubmittingRef.current = true;
            // Only send additionalData for new users
            const additionalData = userType === "new" ? { name: name.trim(), email: email.trim() } : {};
            await verifyOTP(phoneNumber, codeToVerify, additionalData);
            
            // Redirect will happen automatically via useEffect when isAuthenticated changes
            // No need to manually redirect here
        } catch (error) {
            console.error("Error verifying OTP:", error);
            // Reset code and submission flag on error
            setCode("");
            isSubmittingRef.current = false;
            // Reset OTP input submission flag by clearing and setting code
            setTimeout(() => {
                setCode("");
            }, 100);
        }
    };

    const handleOAuthLogin = (provider) => {
        oauthLogin(provider);
    };

    // Resend OTP handler
    const handleResendOTP = async () => {
        if (resendCooldown > 0 || isLoading) {
            return;
        }

        try {
            await sendOTP(phoneNumber);
            setOtpSentTime(Date.now());
            setResendCooldown(120); // Reset to 2 minutes
            setCode(""); // Clear current code
        } catch (error) {
            console.error("Error resending OTP:", error);
        }
    };

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [resendCooldown]);

    return (
        <div className="relative w-full max-w-4xl h-auto min-h-[550px] mx-auto bg-white dark:bg-slate-800 m-5 rounded-3xl shadow-lg overflow-hidden transition-colors duration-300">
            <div className="absolute right-0 w-1/2 h-full z-[1] bg-white dark:bg-slate-800 flex items-center text-gray-800 dark:text-gray-200 text-center p-10 placeholder:text-right transition-[all,visibility] duration-[600ms] ease-in-out delay-[1200ms] [transition:visibility_0s_1s] max-[650px]:bottom-0 max-[650px]:w-full max-[650px]:h-[70%]">
                {step === "phoneNumber" && (
                    <form className="w-full" onSubmit={handleSendOTP}>
                        <h1 className="text-4xl -mt-2 text-slate-700 dark:text-slate-200" data-aos="fade-down">
                            ورود و ثبت نام
                        </h1>
                        <div className="relative my-[30px]" data-aos="fade-left">
                            <input
                                type="tel"
                                inputMode="tel"
                                placeholder="شماره همراه"
                                value={phoneNumber}
                                onChange={(e) => {
                                    // Convert Persian/Arabic digits to English as user types
                                    let value = e.target.value;
                                    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
                                    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
                                    
                                    persianDigits.forEach((persianDigit, index) => {
                                        value = value.replace(new RegExp(persianDigit, 'g'), index.toString());
                                    });
                                    
                                    arabicDigits.forEach((arabicDigit, index) => {
                                        value = value.replace(new RegExp(arabicDigit, 'g'), index.toString());
                                    });
                                    
                                    setPhoneNumber(value);
                                }}
                                autoComplete="tel"
                                autoFocus={true}
                                className="w-full py-3 pr-12 pl-[20px] bg-slate-200 dark:bg-slate-700 rounded-lg border-none outline-none text-base text-slate-500 dark:text-slate-300 font-medium placeholder:text-[#888] dark:placeholder:text-slate-500 placeholder:font-normal placeholder:text-right text-left"
                                required
                            />
                            <HiMiniDevicePhoneMobile className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#888] dark:text-slate-500" />
                        </div>
                        <button
                            data-aos="fade-right"
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-teal-500 dark:bg-teal-600 hover:bg-teal-600 dark:hover:bg-teal-700 disabled:bg-teal-300 dark:disabled:bg-teal-800 disabled:cursor-not-allowed transition-all duration-300 ease-in-out rounded-[8px] shadow-[0_0_10px_rgba(0,0,0,0.1)] text-white font-semibold text-[16px]"
                        >
                            {isLoading ? "در حال ارسال..." : "ارسال کد تأیید"}
                        </button>
                        <p className="text-[14.5px] my-[15px] text-slate-500 dark:text-slate-400" data-aos="zoom-in">
                            یا ورود با حساب های
                        </p>
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => handleOAuthLogin("google")}
                                data-aos="fade-up"
                                data-aos-delay="0"
                                className="inline-flex p-2 border-2 border-slate-500 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-400 rounded-[8px] text-base text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 transition-all duration-300 ease-in-out mx-2 cursor-pointer"
                            >
                                <FaGoogle />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleOAuthLogin("linkedin")}
                                data-aos="fade-up"
                                data-aos-delay="250"
                                className="inline-flex p-2 border-2 border-slate-500 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-400 rounded-[8px] text-base text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 transition-all duration-300 ease-in-out mx-2 cursor-pointer"
                            >
                                <FaLinkedinIn />
                            </button>
                        </div>
                    </form>
                )}

                {step === "code" && (
                    <form className="w-full" onSubmit={handleVerifyOTP}>
                        <h1 className="text-4xl -mt-2 text-slate-700 dark:text-slate-200" data-aos="fade-down">
                            {userType === "new" ? "ثبت نام" : "ورود"}
                        </h1>
                        {userType === "new" && (
                            <>
                                <div className="relative my-[20px]" data-aos="fade-left">
                                    <input
                                        type="text"
                                        placeholder="نام و نام خانوادگی"
                                        value={name}
                                        onChange={(e) => {
                                            // Sanitize input: only allow letters, spaces, and Persian characters
                                            const sanitized = e.target.value.replace(/[^آ-یa-zA-Z\s]/g, '');
                                            setName(sanitized);
                                        }}
                                        maxLength={100}
                                        className="w-full py-3 pr-4 pl-[20px] bg-slate-200 dark:bg-slate-700 rounded-lg border-none outline-none text-base text-slate-500 dark:text-slate-300 font-medium placeholder:text-[#888] dark:placeholder:text-slate-500 placeholder:font-normal placeholder:text-right text-left"
                                        required
                                    />
                                </div>
                                <div className="relative my-[20px]" data-aos="fade-left">
                                    <input
                                        type="email"
                                        placeholder="ایمیل (اختیاری)"
                                        value={email}
                                        onChange={(e) => {
                                            const value = e.target.value.toLowerCase().trim();
                                            setEmail(value);
                                        }}
                                        onBlur={(e) => {
                                            if (e.target.value && !validateEmail(e.target.value)) {
                                                toast.error("فرمت ایمیل نامعتبر است");
                                            }
                                        }}
                                        className="w-full py-3 pr-4 pl-[20px] bg-slate-200 dark:bg-slate-700 rounded-lg border-none outline-none text-base text-slate-500 dark:text-slate-300 font-medium placeholder:text-[#888] dark:placeholder:text-slate-500 placeholder:font-normal placeholder:text-right text-left"
                                    />
                                </div>
                            </>
                        )}
                        <div className="relative my-[30px]" data-aos="fade-left">
                            <OTPInput
                                length={6}
                                value={code}
                                onChange={(value) => setCode(value)}
                                onComplete={(value) => {
                                    setCode(value);
                                }}
                                disabled={isLoading}
                                className="w-full"
                                autoSubmit={true}
                                onSubmit={(submittedValue) => {
                                    const finalCode = submittedValue || code;
                                    if (finalCode && finalCode.length === 6 && !isLoading && !isSubmittingRef.current) {
                                        handleVerifyOTP(null, finalCode);
                                    }
                                }}
                            />
                        </div>
                        
                        {/* Resend OTP and Edit Phone */}
                        <div className="flex items-center justify-between gap-4 my-4" data-aos="fade-up">
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={resendCooldown > 0 || isLoading}
                                className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                            >
                                {resendCooldown > 0 ? `ارسال مجدد (${resendCooldown} ثانیه)` : "ارسال مجدد کد"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setStep("phoneNumber");
                                    setCode("");
                                    setName("");
                                    setEmail("");
                                    setUserType(null);
                                    setOtpSentTime(null);
                                    setResendCooldown(0);
                                }}
                                className="text-sm text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                            >
                                ویرایش شماره
                            </button>
                        </div>

                        <button
                            data-aos="fade-right"
                            type="submit"
                            disabled={isLoading || code.length !== 6}
                            className="w-full h-12 bg-teal-500 dark:bg-teal-600 hover:bg-teal-600 dark:hover:bg-teal-700 disabled:bg-teal-300 dark:disabled:bg-teal-800 disabled:cursor-not-allowed transition-all duration-300 ease-in-out rounded-[8px] shadow-[0_0_10px_rgba(0,0,0,0.1)] text-white font-semibold text-[16px]"
                        >
                            {isLoading ? "در حال بررسی..." : userType === "new" ? "ثبت نام" : "ورود"}
                        </button>
                    </form>
                )}
            </div>

            {/* Toggle Box */}
            <div className="absolute w-full h-full">
                <div
                    className="
            absolute left-[-250%] w-[300%] h-full animate-bgPulse rounded-[150px] z-[2] transition-[all] duration-[1800ms] ease-in-out 
            max-[650px]:left-0 max-[650px]:top-[-270%] max-[650px]:w-full max-[650px]:h-[300%] max-[650px]:rounded-[20vw]
          "
                ></div>

                <div className="absolute left-0 w-1/2 h-full text-white flex flex-col justify-center items-center z-[2] transition-all duration-[600ms] ease-in-out delay-[1200ms] max-[650px]:w-full max-[650px]:h-[30%] max-[650px]:top-0">
                    <Image
                        src="/assets/logo/large-logo-text.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        data-aos="zoom-out"
                        className="w-6/12 md:w-10/12 h-auto mask-animation"
                        alt="هیکاوب"
                        title="هیکاوب"
                    />
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="relative w-full max-w-4xl h-auto min-h-[550px] mx-auto bg-white dark:bg-slate-800 m-5 rounded-3xl shadow-lg overflow-hidden flex items-center justify-center">
                <div className="text-slate-700 dark:text-slate-200">در حال بارگذاری...</div>
            </div>
        }>
            <LoginPageContent />
        </Suspense>
    );
}
