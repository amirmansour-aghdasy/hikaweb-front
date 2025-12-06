"use client";

import { useState, useRef, useEffect } from "react";

const OTPInput = ({ length = 6, value = "", onChange, onComplete, disabled = false, className = "", autoSubmit = false, onSubmit } = {}) => {
    const [otp, setOtp] = useState(value.split("").slice(0, length));
    const inputRefs = useRef([]);
    const abortControllerRef = useRef(null);
    const hasSubmittedRef = useRef(false);

    useEffect(() => {
        // Initialize with value if provided
        if (value) {
            const newOtp = value.split("").slice(0, length);
            setOtp(newOtp);
            // Only reset submission flag if value is cleared (not just changed)
            if (value.length === 0) {
                hasSubmittedRef.current = false;
            }
        } else {
            // Reset submission flag when value is cleared
            hasSubmittedRef.current = false;
        }
    }, [value, length]);

    // SMS OTP Autofill using WebOTP API
    useEffect(() => {
        if (typeof window === 'undefined' || !('OTPCredential' in window)) {
            return;
        }

        // Cleanup previous abort controller
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        navigator.credentials.get({
            otp: { transport: ['sms'] },
            signal: abortControllerRef.current.signal
        }).then((otpCredential) => {
            if (otpCredential && otpCredential.code) {
                const code = otpCredential.code.replace(/\D/g, "").slice(0, length);
                const newOtp = code.split("").slice(0, length);
                setOtp(newOtp);
                const otpString = newOtp.join("");
                onChange?.(otpString);
                if (newOtp.every((digit) => digit !== "")) {
                    onComplete?.(otpString);
                    if (autoSubmit && onSubmit && !hasSubmittedRef.current) {
                        hasSubmittedRef.current = true;
                        console.log("OTPInput (SMS): Auto-submitting with code:", otpString);
                        requestAnimationFrame(() => {
                            onSubmit(otpString);
                        });
                    }
                } else {
                    // Reset submission flag if code is not complete
                    hasSubmittedRef.current = false;
                }
            }
        }).catch((error) => {
            // Ignore abort errors and other expected errors
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
                console.debug('SMS OTP autofill not available:', error);
            }
        });

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [length, onChange, onComplete, autoSubmit, onSubmit]);

    const handleChange = (index, e) => {
        const input = e.target.value;
        
        // Only allow numbers
        if (input && !/^\d$/.test(input)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = input;
        setOtp(newOtp);

        // Call onChange with the full OTP string
        const otpString = newOtp.join("");
        onChange?.(otpString);

        // Move to next input if value entered
        if (input && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check if all inputs are filled
        if (newOtp.every((digit) => digit !== "")) {
            onComplete?.(otpString);
            // Auto submit if enabled and not already submitted
            // Don't check disabled - it's handled in the parent component
            if (autoSubmit && onSubmit && !hasSubmittedRef.current) {
                hasSubmittedRef.current = true;
                // Use requestAnimationFrame to ensure state is updated
                requestAnimationFrame(() => {
                    onSubmit(otpString);
                });
            }
        } else {
            // Reset submission flag if code is not complete
            hasSubmittedRef.current = false;
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        
        // Handle arrow keys
        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
        
        // Handle paste
        if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then((text) => {
                const digits = text.replace(/\D/g, "").slice(0, length);
                const newOtp = [...otp];
                digits.split("").forEach((digit, i) => {
                    if (index + i < length) {
                        newOtp[index + i] = digit;
                    }
                });
                setOtp(newOtp);
                const otpString = newOtp.join("");
                onChange?.(otpString);
                if (newOtp.every((digit) => digit !== "")) {
                    onComplete?.(otpString);
                    if (autoSubmit && onSubmit && !hasSubmittedRef.current) {
                        hasSubmittedRef.current = true;
                        console.log("OTPInput (SMS): Auto-submitting with code:", otpString);
                        requestAnimationFrame(() => {
                            onSubmit(otpString);
                        });
                    }
                } else {
                    // Reset submission flag if code is not complete
                    hasSubmittedRef.current = false;
                }
                // Focus the last filled input or the last input
                const lastFilledIndex = Math.min(index + digits.length - 1, length - 1);
                inputRefs.current[lastFilledIndex]?.focus();
            });
        }
    };

    const handleFocus = (index) => {
        inputRefs.current[index]?.select();
    };

    return (
        <div className={`flex gap-2 justify-center ${className}`} dir="ltr">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onFocus={() => handleFocus(index)}
                    disabled={disabled}
                    className="w-12 h-14 text-center text-2xl font-bold text-slate-700 bg-slate-200 rounded-lg border-2 border-transparent focus:border-teal-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    autoComplete="one-time-code"
                    dir="ltr"
                />
            ))}
        </div>
    );
};

export default OTPInput;

