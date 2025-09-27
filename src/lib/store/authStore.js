import { create } from "zustand";
import API from "@/lib/auth";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const useAuthStore = create((set, get) => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,

    // Initialize auth state
    init: async () => {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
            try {
                const response = await API.get("/api/auth/me");
                set({
                    user: response.data.user,
                    isAuthenticated: true,
                });
            } catch (error) {
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
            }
        }
    },

    // Check user type
    checkUserType: async (phone) => {
        try {
            const domain = window.location.hostname;
            const response = await API.post("/api/auth/check-user", {
                phone,
                domain,
            });
            return response.data;
        } catch (error) {
            toast.error("خطا در بررسی کاربر");
            throw error;
        }
    },

    // Send OTP
    sendOTP: async (phone) => {
        set({ isLoading: true });
        try {
            const response = await API.post("/api/auth/send-otp", { phone });
            toast.success("کد تأیید ارسال شد");
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || "خطا در ارسال کد";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Verify OTP
    verifyOTP: async (phone, code, additionalData = {}) => {
        set({ isLoading: true });
        try {
            const domain = window.location.hostname;
            const response = await API.post("/api/auth/verify-otp", {
                phone,
                code,
                domain,
                ...additionalData,
            });

            const { user, tokens } = response.data;

            // Store tokens
            Cookies.set("accessToken", tokens.accessToken, { expires: 1 / 96 });
            Cookies.set("refreshToken", tokens.refreshToken, { expires: 7 });

            set({
                user,
                isAuthenticated: true,
            });

            toast.success("ورود موفقیت‌آمیز");
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || "کد نامعتبر";
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
        try {
            const refreshToken = Cookies.get("refreshToken");
            await API.post("/api/auth/logout", { refreshToken });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            set({ user: null, isAuthenticated: false });
            window.location.href = "/";
        }
    },
}));

export default useAuthStore;
