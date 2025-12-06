import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/services/api/client";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// Track if init is currently running to prevent concurrent calls
let initPromise = null;
let isInitializing = false;

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            isAuthenticated: false,

            // Initialize auth state
            init: async () => {
                // If already initializing, return the existing promise
                if (isInitializing && initPromise) {
                    return initPromise;
                }

                // If already initialized and user exists, skip
                const currentState = get();
                if (currentState.isAuthenticated && currentState.user) {
                    return Promise.resolve();
                }

                isInitializing = true;
                initPromise = (async () => {
                    try {
                        const accessToken = Cookies.get("accessToken");
                        if (accessToken) {
                            const response = await apiClient.get("/auth/me");
                            set({
                                user: response.data?.user,
                                isAuthenticated: true,
                            });
                        } else {
                            set({ user: null, isAuthenticated: false });
                        }
                    } catch (error) {
                        // Only remove cookies if it's an auth error (401/403)
                        // Don't remove on network errors
                        if (error.status === 401 || error.status === 403) {
                            Cookies.remove("accessToken", { path: "/" });
                            Cookies.remove("refreshToken", { path: "/" });
                        }
                        set({ user: null, isAuthenticated: false });
                    } finally {
                        isInitializing = false;
                        initPromise = null;
                    }
                })();

                return initPromise;
            },

            // Refresh user data from server (always fetches, even if user exists)
            refreshUser: async () => {
                try {
                    const accessToken = Cookies.get("accessToken");
                    if (!accessToken) {
                        set({ user: null, isAuthenticated: false });
                        return null;
                    }

                    const response = await apiClient.get("/auth/me");
                    const updatedUser = response.data?.user;
                    if (updatedUser) {
                        set({
                            user: updatedUser,
                            isAuthenticated: true,
                        });
                        return updatedUser;
                    } else {
                        set({ user: null, isAuthenticated: false });
                        return null;
                    }
                } catch (error) {
                    // Only remove cookies if it's an auth error (401/403)
                    if (error.status === 401 || error.status === 403) {
                        Cookies.remove("accessToken", { path: "/" });
                        Cookies.remove("refreshToken", { path: "/" });
                        set({ user: null, isAuthenticated: false });
                    }
                    throw error;
                }
            },

            // Check user type
            checkUserType: async (phoneNumber) => {
                try {
                    const domain = window.location.hostname;
                    const response = await apiClient.post("/auth/check-user", {
                        phoneNumber,
                        domain,
                    });
                    // Handle both response.data.data.exists and response.data.exists
                    const exists = response.data?.data?.exists ?? response.data?.exists ?? false;
                    return { exists };
                } catch (error) {
                    // If user doesn't exist, return exists: false
                    return { exists: false };
                }
            },

            // Send OTP
            sendOTP: async (phoneNumber) => {
                set({ isLoading: true });
                try {
                    const response = await apiClient.post("/auth/send-otp", { phoneNumber });
                    toast.success("کد تأیید ارسال شد");
                    return response.data;
                } catch (error) {
                    const message = error.message || "خطا در ارسال کد";
                    toast.error(message);
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            // Verify OTP
            verifyOTP: async (phoneNumber, otp, additionalData = {}) => {
                const currentState = get();
                // Prevent concurrent calls
                if (currentState.isLoading) {
                    return Promise.reject(new Error("در حال پردازش..."));
                }

                set({ isLoading: true });
                try {
                    const domain = window.location.hostname;
                    const response = await apiClient.post("/auth/verify-otp", {
                        phoneNumber,
                        otp,
                        domain,
                        ...additionalData,
                    });

                    const { user, tokens } = response.data || {};

                    if (!tokens || !tokens.accessToken) {
                        throw new Error("خطا در دریافت توکن‌ها");
                    }

                    // Store tokens with proper expiration (same as dashboard)
                    // Access token: 7 days
                    // Refresh token: 7 days
                    const cookieOptions = {
                        expires: 7, // 7 days
                        path: "/",
                        sameSite: "lax",
                        secure: process.env.NODE_ENV === "production"
                    };
                    
                    Cookies.set("accessToken", tokens.accessToken, cookieOptions);
                    Cookies.set("refreshToken", tokens.refreshToken, cookieOptions);

                    set({
                        user,
                        isAuthenticated: true,
                    });

                    toast.success(additionalData.name ? "ثبت نام موفقیت‌آمیز" : "ورود موفقیت‌آمیز");
                    return response.data;
                } catch (error) {
                    const message = error.message || "کد نامعتبر";
                    toast.error(message);
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            // OAuth login
            oauthLogin: (provider) => {
                const redirectUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/${provider}`;
                window.location.href = redirectUrl;
            },

            // Logout
            logout: async () => {
                // Get refreshToken before clearing cookies
                const refreshToken = Cookies.get("refreshToken");
                
                // Clear state and cookies immediately for instant UI update
                Cookies.remove("accessToken", { path: "/" });
                Cookies.remove("refreshToken", { path: "/" });
                set({ user: null, isAuthenticated: false });
                
                // Call logout API in background (don't wait for it)
                if (refreshToken) {
                    apiClient.post("/auth/logout", { refreshToken }).catch((error) => {
                        console.error("Logout API error:", error);
                    });
                }
                
                // Redirect immediately
                if (typeof window !== "undefined") {
                    window.location.href = "/";
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;
