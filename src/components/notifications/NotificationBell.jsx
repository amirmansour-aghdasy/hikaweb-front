"use client";

import { useState, useEffect, useRef } from "react";
import { HiBell } from "react-icons/hi2";
import { apiClient } from "@/services/api/client";
import NotificationDrawer from "./NotificationDrawer";

export default function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const bellRef = useRef(null);

    useEffect(() => {
        fetchUnreadCount();
        
        // Refresh count every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const response = await apiClient.get("/notifications/unread-count");
            setUnreadCount(response.data?.data?.count || 0);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBellClick = () => {
        setIsDrawerOpen(true);
    };

    const handleCountUpdate = (newCount) => {
        setUnreadCount(newCount);
    };

    if (loading) {
        return (
            <div className="relative p-2 rounded-lg animate-pulse">
                <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
        );
    }

    return (
        <>
            <button
                ref={bellRef}
                onClick={handleBellClick}
                className="relative p-2 rounded-lg hover:bg-slate-300/50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="اعلان‌ها"
            >
                <HiBell className={`w-6 h-6 ${unreadCount > 0 ? 'text-teal-600' : 'text-slate-600'}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>
            
            <NotificationDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onCountUpdate={handleCountUpdate}
                anchorRef={bellRef}
            />
        </>
    );
}

