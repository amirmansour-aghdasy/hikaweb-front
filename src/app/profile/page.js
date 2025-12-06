"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsPerson, BsEnvelope, BsTelephone, BsCalendar, BsPencil, BsCreditCard, BsReceipt, BsBookmark, BsShieldCheck, BsLaptop, BsTicket, BsChatDots, BsBell } from "react-icons/bs";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { MdOutlineArticle } from "react-icons/md";
import { FaBriefcase } from "react-icons/fa";

import useAuthStore from "@/lib/store/authStore";
import ProfileInfoTab from "@/components/profile/ProfileInfoTab";
import PaymentsTab from "@/components/profile/PaymentsTab";
import InvoicesTab from "@/components/profile/InvoicesTab";
import BookmarksTab from "@/components/profile/BookmarksTab";
import SecurityTab from "@/components/profile/SecurityTab";
import ConnectedDevicesTab from "@/components/profile/ConnectedDevicesTab";
import TicketsTab from "@/components/profile/TicketsTab";
import ConsultationsTab from "@/components/profile/ConsultationsTab";
import NotificationsTab from "@/components/profile/NotificationsTab";
import StatsCard from "@/components/profile/StatsCard";
import { apiClient } from "@/services/api/client";

const ProfilePage = () => {
    const router = useRouter();
    const { user, isAuthenticated, init } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [stats, setStats] = useState({
        payments: 0,
        invoices: 0,
        tickets: 0,
        consultations: 0,
        bookmarks: 0,
        notifications: 0,
    });
    const [statsLoading, setStatsLoading] = useState(true);
    const hasInitialized = useRef(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (hasInitialized.current) {
                return;
            }
            
            try {
                hasInitialized.current = true;
                await init();
            } catch (error) {
                console.error("Auth check error:", error);
                hasInitialized.current = false;
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            if (!loading && hasInitialized.current) {
                router.push("/auth?redirect=/profile");
            }
        } else if (user) {
            // Always sync userData with store user
            setUserData(user);
            setLoading(false);
        }
    }, [isAuthenticated, user, loading, router]);

    const fetchStatsRef = useRef(null);

    fetchStatsRef.current = async () => {
        if (!isAuthenticated || !user) return;
        
        try {
            setStatsLoading(true);
            // فقط APIهایی که موجود هستند را صدا می‌زنیم - با silent error handling
            // برای پنل کاربری، فقط داده‌های مختص کاربر فعلی را می‌گیریم
            const [ticketsRes, consultationsRes, notificationsRes] = await Promise.allSettled([
                apiClient.get("/tickets?limit=1").catch(() => Promise.reject(new Error("silent"))),
                apiClient.get("/consultations?limit=1").catch(() => Promise.reject(new Error("silent"))),
                apiClient.get("/notifications?limit=1").catch(() => Promise.reject(new Error("silent"))),
            ]);

            setStats({
                payments: 0, // API موجود نیست
                invoices: 0, // API موجود نیست
                // برای پنل کاربری، total باید تعداد تیکت‌های کاربر باشد نه کل
                tickets: ticketsRes.status === "fulfilled" 
                    ? (ticketsRes.value?.data?.pagination?.total || ticketsRes.value?.data?.tickets?.length || ticketsRes.value?.pagination?.total || 0)
                    : 0,
                // برای پنل کاربری، total باید تعداد مشاوره‌های کاربر باشد نه کل
                consultations: consultationsRes.status === "fulfilled"
                    ? (consultationsRes.value?.data?.pagination?.total || consultationsRes.value?.data?.consultations?.length || consultationsRes.value?.pagination?.total || 0)
                    : 0,
                bookmarks: 0, // API موجود نیست
                notifications: notificationsRes.status === "fulfilled"
                    ? (notificationsRes.value?.data?.pagination?.total || notificationsRes.value?.data?.notifications?.length || notificationsRes.value?.pagination?.total || 0)
                    : 0,
            });
        } catch (error) {
            // خطا را silent نگه می‌داریم تا کاربر خطا نبیند
        } finally {
            setStatsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchStatsRef.current?.();
        }
    }, [isAuthenticated, user]);

    // Listen for stats refresh events
    useEffect(() => {
        const handleRefreshStats = () => {
            fetchStatsRef.current?.();
        };

        window.addEventListener('refreshStats', handleRefreshStats);
        return () => {
            window.removeEventListener('refreshStats', handleRefreshStats);
        };
    }, []);

    if (loading) {
        return (
            <main className="w-full py-5 md:py-14 flex justify-center items-center min-h-screen">
                <div className="text-slate-500 dark:text-slate-400">در حال بارگذاری...</div>
            </main>
        );
    }

    if (!userData) {
        return null;
    }

    const tabs = [
        { id: 0, label: "اطلاعات پروفایل", icon: <BsPerson className="w-5 h-5" /> },
        { id: 1, label: "پرداخت‌ها", icon: <BsCreditCard className="w-5 h-5" /> },
        { id: 2, label: "فاکتورها", icon: <BsReceipt className="w-5 h-5" /> },
        { id: 3, label: "نشان‌گذاری‌ها", icon: <BsBookmark className="w-5 h-5" /> },
        { id: 4, label: "امنیت", icon: <BsShieldCheck className="w-5 h-5" /> },
        { id: 5, label: "دستگاه‌های متصل", icon: <BsLaptop className="w-5 h-5" /> },
        { id: 6, label: "تیکت‌ها", icon: <BsTicket className="w-5 h-5" /> },
        { id: 7, label: "درخواست‌های مشاوره", icon: <BsChatDots className="w-5 h-5" /> },
        { id: 8, label: "اطلاع‌رسانی", icon: <BsBell className="w-5 h-5" /> },
    ];

    return (
        <main className="w-full py-5 md:py-14">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">پروفایل کاربری</h1>
                        <p className="text-slate-600 dark:text-slate-400">مدیریت اطلاعات شخصی و تنظیمات حساب کاربری</p>
                    </div>
                </div>

                {/* Statistics Cards - همه کارت‌ها با قابلیت کلیک */}
                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab(1)}
                        className="text-left transition-transform hover:scale-105"
                    >
                        <StatsCard
                            title="پرداخت‌ها"
                            value={0}
                            icon={<BsCreditCard className="w-5 h-5" />}
                            color="green"
                        />
                    </button>
                    <button
                        onClick={() => setActiveTab(2)}
                        className="text-left transition-transform hover:scale-105"
                    >
                        <StatsCard
                            title="فاکتورها"
                            value={0}
                            icon={<BsReceipt className="w-5 h-5" />}
                            color="blue"
                        />
                    </button>
                    <button
                        onClick={() => setActiveTab(6)}
                        className="text-left transition-transform hover:scale-105"
                    >
                        <StatsCard
                            title="تیکت‌ها"
                            value={statsLoading ? "..." : stats.tickets}
                            icon={<BsTicket className="w-5 h-5" />}
                            color="orange"
                        />
                    </button>
                    <button
                        onClick={() => setActiveTab(7)}
                        className="text-left transition-transform hover:scale-105"
                    >
                        <StatsCard
                            title="مشاوره‌ها"
                            value={statsLoading ? "..." : stats.consultations}
                            icon={<BsChatDots className="w-5 h-5" />}
                            color="purple"
                        />
                    </button>
                    <button
                        onClick={() => setActiveTab(3)}
                        className="text-left transition-transform hover:scale-105"
                    >
                        <StatsCard
                            title="نشان‌گذاری‌ها"
                            value={0}
                            icon={<BsBookmark className="w-5 h-5" />}
                            color="teal"
                        />
                    </button>
                    <button
                        onClick={() => setActiveTab(8)}
                        className="text-left transition-transform hover:scale-105"
                    >
                        <StatsCard
                            title="اطلاع‌رسانی‌ها"
                            value={statsLoading ? "..." : stats.notifications}
                            icon={<BsBell className="w-5 h-5" />}
                            color="red"
                        />
                    </button>
                </div>

                {/* Tabs and Content */}
                <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Vertical Tabs Sidebar */}
                    <div className="md:col-span-3">
                        <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                            <div className="border-r-0 md:border-r border-slate-200 dark:border-slate-700">
                                <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                                                flex items-center gap-3 px-4 py-4 md:py-4 text-sm font-medium transition-colors whitespace-nowrap
                                                w-full md:w-full text-right md:text-right
                                                min-h-[60px] md:min-h-[60px]
                                                ${activeTab === tab.id
                                                    ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 md:bg-white dark:md:bg-slate-800 md:border-r-2 md:border-r-teal-600 dark:md:border-r-teal-500"
                                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                }
                                            `}
                                        >
                                            <span className="flex-shrink-0">{tab.icon}</span>
                                            <span className="flex-1">{tab.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="md:col-span-9">
                        <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-3.5 md:p-8">
                            {activeTab === 0 && <ProfileInfoTab user={userData} onUpdate={(updatedUser) => setUserData(updatedUser)} />}
                            {activeTab === 1 && <PaymentsTab user={userData} />}
                            {activeTab === 2 && <InvoicesTab user={userData} />}
                            {activeTab === 3 && <BookmarksTab user={userData} />}
                            {activeTab === 4 && <SecurityTab user={userData} />}
                            {activeTab === 5 && <ConnectedDevicesTab user={userData} />}
                                {activeTab === 6 && <TicketsTab user={userData} onStatsChange={() => fetchStatsRef.current?.()} />}
                            {activeTab === 7 && <ConsultationsTab user={userData} />}
                            {activeTab === 8 && <NotificationsTab user={userData} />}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;
