"use client";

import { useState, useEffect, useRef } from "react";
import { FaWhatsapp, FaTimes, FaUser, FaEnvelope, FaPhone, FaClock, FaCheckCircle } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { apiClient } from "@/services/api/client";

/**
 * Advanced WhatsApp Chat Widget Component
 * 
 * Features:
 * - Multiple agents/operators support
 * - Working hours detection
 * - Chat popup widget (not just button)
 * - Offline message support
 * - User information collection before chat
 * - Page-specific visibility
 * - Multi-language support
 * - Online/Offline status
 * - Auto-close timer
 * - Notification badge
 * - Settings API integration
 * 
 * @param {Object} props
 * @param {Array} props.agents - Array of agents with phone, name, message, workingHours
 * @param {Object} props.config - Configuration object
 */
export default function WhatsAppChatWidget({
    agents = [
        {
            phoneNumber: "9120997935",
            name: "مدیریت پشتیبانی",
            message: "می‌خوام در مورد خدمات شما اطلاعات بیشتری دریافت کنم.",
            workingHours: {
                enabled: true, // Set to true to enable working hours
                timezone: "Asia/Tehran",
                schedule: [
                    { day: "saturday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
                    { day: "sunday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
                    { day: "monday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
                    { day: "tuesday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
                    { day: "wednesday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
                    { day: "thursday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
                    { day: "friday", isOpen: false, openTime: "", closeTime: "" },
                ]
            },
            offlineMessage: "متأسفانه در حال حاضر خارج از ساعات کاری هستیم. لطفاً پیام خود را ارسال کنید تا در اولین فرصت با شما تماس بگیریم."
        },
        {
            phoneNumber: "9387200309",
            name: "پشتیبانی فنی",
            message: "می‌خوام در مورد موارد فنی سایت شما صحبت کنم.",
            workingHours: {
                enabled: true, // Set to true to enable working hours
                timezone: "Asia/Tehran",
                schedule: [
                    { day: "saturday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
                    { day: "sunday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
                    { day: "monday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
                    { day: "tuesday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
                    { day: "wednesday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
                    { day: "thursday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
                    { day: "friday", isOpen: false, openTime: "", closeTime: "" },
                ]
            },
            offlineMessage: "متأسفانه در حال حاضر خارج از ساعات کاری هستیم. لطفاً پیام خود را ارسال کنید تا در اولین فرصت با شما تماس بگیریم."
        }
    ],
    config = {
        position: "bottom-right",
        showPulse: true,
        size: "medium",
        collectUserInfo: false, // Collect name/email before chat
        showOnPages: [], // Empty = all pages, or specify paths like ["/", "/contact-us"]
        hideOnPages: [], // Pages to hide widget (e.g., ["/admin", "/dashboard"])
        offlineMode: "message", // "message" | "hide" | "button"
        language: "fa",
        autoCloseTimer: 0, // Auto-close popup after X seconds (0 = disabled)
        notificationBadge: null, // Number to show on badge (null = hidden)
        fetchFromSettings: false // Fetch agents from Settings API
    }
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [isOnline, setIsOnline] = useState(true);
    const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });
    const [showUserForm, setShowUserForm] = useState(false);
    const [settingsAgents, setSettingsAgents] = useState(null);
    const [settingsEnabled, setSettingsEnabled] = useState(true);
    const [settingsConfig, setSettingsConfig] = useState(null);
    const pathname = usePathname();
    const widgetRef = useRef(null);
    const autoCloseTimerRef = useRef(null);

    // Use settings agents if available, otherwise use provided agents
    const activeAgents = settingsAgents || agents;
    
    // Use settings config if available, otherwise use provided config
    const activeConfig = settingsConfig || config;

    // Check if widget should be visible on current page
    useEffect(() => {
        const checkConfig = settingsConfig || config;
        if (checkConfig.hideOnPages && checkConfig.hideOnPages.length > 0) {
            const shouldHide = checkConfig.hideOnPages.some(path => pathname.startsWith(path));
            if (shouldHide) {
                setIsVisible(false);
                return;
            }
        }

        if (checkConfig.showOnPages && checkConfig.showOnPages.length > 0) {
            const shouldShow = checkConfig.showOnPages.some(path => pathname.startsWith(path));
            setIsVisible(shouldShow);
        } else {
            setIsVisible(true);
        }
    }, [pathname, settingsConfig, config]);

    // Show widget after page load
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    // Fetch WhatsApp settings from Settings API (always fetch, use if enabled)
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Use apiClient to handle CORS and API URL correctly
                const data = await apiClient.get('/settings/public');

                if (data.success && data.data?.settings) {
                    const settings = data.data.settings;
                    const whatsappSettings = settings.whatsapp;
                    
                    // If WhatsApp is enabled in settings, use settings data
                    if (whatsappSettings?.enabled) {
                        // Update config from settings first
                        if (whatsappSettings.config) {
                            setSettingsConfig(whatsappSettings.config);
                        }
                        
                        // Use agents from settings if available
                        if (whatsappSettings?.agents && whatsappSettings.agents.length > 0) {
                            setSettingsAgents(whatsappSettings.agents);
                            if (!selectedAgent) {
                                setSelectedAgent(whatsappSettings.agents[0]);
                            }
                            setSettingsEnabled(true);
                        } else {
                            // WhatsApp is enabled but no agents - use fallback agents if available
                            // Don't disable widget, use default agents as fallback
                            setSettingsAgents(null); // This will trigger fallback to default agents
                            setSettingsEnabled(true); // Keep enabled to use fallback agents
                        }
                    } else if (whatsappSettings && !whatsappSettings.enabled) {
                        // WhatsApp is explicitly disabled in settings
                        setSettingsEnabled(false);
                    } else if (config.fetchFromSettings) {
                        // Fallback: use old method if fetchFromSettings is explicitly enabled
                        const whatsappNumber = settings.socialMedia?.whatsapp;
                        const businessHours = settings.business?.businessHours;
                        const timezone = settings.system?.timezone || "Asia/Tehran";
                        
                        if (whatsappNumber) {
                            const schedule = businessHours?.map(bh => ({
                                day: bh.day,
                                isOpen: bh.isOpen,
                                openTime: bh.openTime || "09:00",
                                closeTime: bh.closeTime || "18:00"
                            })) || [];
                            
                            const agentFromSettings = {
                                phoneNumber: whatsappNumber.replace(/[\s\-+()]/g, ''),
                                name: settings.siteName?.fa || "پشتیبانی",
                                message: "سلام، می‌خواهم در مورد خدمات شما اطلاعات بیشتری دریافت کنم.",
                                workingHours: {
                                    enabled: businessHours && businessHours.length > 0,
                                    timezone: timezone,
                                    schedule: schedule
                                },
                                offlineMessage: "متأسفانه در حال حاضر خارج از ساعات کاری هستیم. لطفاً پیام خود را ارسال کنید تا در اولین فرصت با شما تماس بگیریم."
                            };
                            
                            setSettingsAgents([agentFromSettings]);
                            if (!selectedAgent) {
                                setSelectedAgent(agentFromSettings);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching settings for WhatsApp widget:', error);
            }
        };
        
        fetchSettings();
    }, [selectedAgent, config.fetchFromSettings]);

    // Update selectedAgent when activeAgents changes
    useEffect(() => {
        if (!selectedAgent && activeAgents && activeAgents.length > 0) {
            setSelectedAgent(activeAgents[0]);
        }
    }, [activeAgents, selectedAgent]);

    // Check working hours and online status
    useEffect(() => {
        if (!selectedAgent) {
            return;
        }
        
        if (!selectedAgent.workingHours?.enabled) {
            setIsOnline(true);
            return;
        }

        const checkWorkingHours = () => {
            const now = new Date();
            const timezone = selectedAgent.workingHours.timezone || "Asia/Tehran";
            
            // Use Intl.DateTimeFormat for proper timezone conversion
            const formatter = new Intl.DateTimeFormat("en-US", {
                timeZone: timezone,
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                weekday: "long"
            });
            
            const parts = formatter.formatToParts(now);
            const weekdayPart = parts.find(p => p.type === "weekday")?.value;
            const hour = parts.find(p => p.type === "hour")?.value;
            const minute = parts.find(p => p.type === "minute")?.value;
            
            // Map weekday names to our schedule format
            const weekdayMap = {
                "sunday": "sunday",
                "monday": "monday",
                "tuesday": "tuesday",
                "wednesday": "wednesday",
                "thursday": "thursday",
                "friday": "friday",
                "saturday": "saturday"
            };
            const currentDay = weekdayMap[weekdayPart?.toLowerCase()] || weekdayPart?.toLowerCase();
            const currentTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;

            const todaySchedule = selectedAgent.workingHours.schedule.find(s => s.day === currentDay);
            
            if (!todaySchedule || !todaySchedule.isOpen) {
                setIsOnline(false);
                return;
            }

            const isWithinHours = currentTime >= todaySchedule.openTime && currentTime <= todaySchedule.closeTime;
            setIsOnline(isWithinHours);
        };

        checkWorkingHours();
        // Check every minute
        const interval = setInterval(checkWorkingHours, 60000);
        return () => clearInterval(interval);
    }, [selectedAgent]);

    // Close widget when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (widgetRef.current && !widgetRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Auto-close timer
    useEffect(() => {
        const checkConfig = settingsConfig || config;
        if (isOpen && checkConfig.autoCloseTimer > 0) {
            autoCloseTimerRef.current = setTimeout(() => {
                setIsOpen(false);
            }, checkConfig.autoCloseTimer * 1000);
            
            return () => {
                if (autoCloseTimerRef.current) {
                    clearTimeout(autoCloseTimerRef.current);
                }
            };
        }
    }, [isOpen, config.autoCloseTimer, settingsConfig]);

    // Format phone number
    const formatPhoneNumber = (phone) => {
        return phone.replace(/[\s\-+()]/g, '');
    };

    // Build WhatsApp URL
    const getWhatsAppUrl = (agent, customMessage = null) => {
        const formattedPhone = formatPhoneNumber(agent.phoneNumber);
        let message = "";

        // If custom message is provided (e.g., offline message), use it
        if (customMessage) {
            message = customMessage;
        } else {
            // Use agent's default message or a generic one
            message = agent.message || "سلام، می‌خواهم در مورد خدمات شما اطلاعات بیشتری دریافت کنم.";
        }

        // Add user info to message if collected (make it look like user is sending the message)
        // Use activeConfig instead of config to get settings from API
        const checkConfig = settingsConfig || config;
        if (checkConfig.collectUserInfo && userInfo.name) {
            // Format message to look like user is sending it
            let userMessage = `سلام، من ${userInfo.name} هستم.\n\n${message}`;
            
            // Add contact info at the end if provided
            if (userInfo.email || userInfo.phone) {
                userMessage += "\n\n";
                if (userInfo.email) {
                    userMessage += `ایمیل: ${userInfo.email}`;
                }
                if (userInfo.phone) {
                    if (userInfo.email) userMessage += "\n";
                    userMessage += `شماره تماس: ${userInfo.phone}`;
                }
            }
            
            message = userMessage;
        }

        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`;
    };

    const handleChatClick = () => {
        // Use selectedAgent or fallback to first agent
        const agentToUse = selectedAgent || (activeAgents && activeAgents.length > 0 ? activeAgents[0] : null);
        if (!agentToUse) return;
        
        // Build WhatsApp URL
        // Don't use offline message in WhatsApp - let user send their own message
        // The offline message is only for UI display
        const url = getWhatsAppUrl(agentToUse, null);
        window.open(url, '_blank', 'noopener,noreferrer');
        
        // Track event
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'whatsapp_chat_start', {
                'event_category': 'engagement',
                'event_label': 'WhatsApp Chat Widget',
                'agent_name': agentToUse.name,
                'is_online': isOnline
            });
        }

        setIsOpen(false);
        // Reset user form after chat
        const checkConfig = settingsConfig || config;
        if (checkConfig.collectUserInfo) {
            setUserInfo({ name: "", email: "", phone: "" });
            setShowUserForm(true); // Reset to show form again for next time
        }
    };

    const handleUserFormSubmit = (e) => {
        e.preventDefault();
        if (userInfo.name.trim()) {
            // User info is already in state, now proceed to chat
            handleChatClick();
        }
    };

    // Show user form when widget opens if collectUserInfo is enabled
    useEffect(() => {
        const checkConfig = settingsConfig || config;
        if (isOpen) {
            if (checkConfig.collectUserInfo && !userInfo.name.trim()) {
                setShowUserForm(true);
            } else if (!checkConfig.collectUserInfo) {
                setShowUserForm(false);
            }
        } else {
            // Reset form when widget closes if collectUserInfo is enabled
            if (checkConfig.collectUserInfo) {
                setShowUserForm(false);
            }
        }
    }, [isOpen, settingsConfig, config, userInfo.name]);

    // Show widget if enabled and visible, and either has agents from settings or fallback agents
    // Don't hide widget if settingsEnabled is true but agents array is empty - use fallback
    if (!settingsEnabled || !isVisible) {
        return null;
    }
    
    // If no agents available at all (neither from settings nor fallback), don't show widget
    if (!activeAgents || activeAgents.length === 0) {
        return null;
    }
    
    // Ensure selectedAgent is set - use first agent if not set yet
    // This prevents widget from not showing on first render
    const currentAgent = selectedAgent || (activeAgents.length > 0 ? activeAgents[0] : null);
    if (!currentAgent) {
        return null;
    }

    const sizeClasses = {
        small: "w-12 h-12 text-lg",
        medium: "w-14 h-14 md:w-[60px] md:h-[60px] text-xl md:text-2xl",
        large: "w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl"
    };

    const positionClasses = {
        "bottom-right": "bottom-[15px] md:bottom-[30px] right-[15px] md:right-[30px]",
        "bottom-left": "bottom-4 md:bottom-16 left-4 md:left-6"
    };

    const checkConfig = settingsConfig || config;

    return (
        <div
            ref={widgetRef}
            className={`fixed ${positionClasses[checkConfig.position]} z-40 transition-all duration-500 ease-out ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
        >
            {/* Chat Widget Popup */}
            {isOpen && (
                <div className="absolute bottom-full mb-3 right-0 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slideUp">
                    {/* Header */}
                    <div className="bg-[#25D366] text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <FaWhatsapp className="text-2xl" />
                                {isOnline && (
                                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{currentAgent.name}</h3>
                                <p className="text-xs opacity-90">
                                    {isOnline ? (
                                        <span className="flex items-center gap-1">
                                            <FaCheckCircle className="text-xs" />
                                            آنلاین
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <FaClock className="text-xs" />
                                            آفلاین
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                            aria-label="بستن"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {showUserForm ? (
                            <form onSubmit={handleUserFormSubmit} className="space-y-3">
                                {/* Show offline message in form if offline */}
                                {!isOnline && (
                                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-3 mb-2">
                                        <p className="text-sm text-orange-800 dark:text-orange-200 flex items-center gap-2">
                                            <FaClock className="text-xs" />
                                            {currentAgent.offlineMessage || "ارتباط مستقیم با کارشناسان هیکاوب."}
                                        </p>
                                    </div>
                                )}

                                {/* Multiple Agents Selection - Show in form too */}
                                {activeAgents.length > 1 && (
                                    <div className="space-y-2">
                                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                                            انتخاب کارشناس:
                                        </label>
                                        <select
                                            value={currentAgent.phoneNumber}
                                            onChange={(e) => {
                                                const agent = activeAgents.find(a => a.phoneNumber === e.target.value);
                                                if (agent) setSelectedAgent(agent);
                                            }}
                                            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            {activeAgents.map((agent, index) => (
                                                <option key={index} value={agent.phoneNumber}>
                                                    {agent.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        نام شما <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={userInfo.name}
                                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        placeholder="نام و نام خانوادگی"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        ایمیل (اختیاری)
                                    </label>
                                    <input
                                        type="email"
                                        value={userInfo.email}
                                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        placeholder="example@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        شماره تماس (اختیاری)
                                    </label>
                                    <input
                                        type="tel"
                                        value={userInfo.phone}
                                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        placeholder="09123456789"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaWhatsapp />
                                    {isOnline ? "شروع چت" : "ارسال پیام"}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {isOnline
                                        ? "سلام! چطور می‌تونم کمکتون کنم؟"
                                        : currentAgent.offlineMessage || "ارتباط مستقیم با کارشناسان هیکاوب."}
                                </p>

                                {/* Multiple Agents Selection */}
                                {activeAgents.length > 1 && (
                                    <div className="space-y-2">
                                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                                            انتخاب کارشناس:
                                        </label>
                                        <select
                                            value={currentAgent.phoneNumber}
                                            onChange={(e) => {
                                                const agent = activeAgents.find(a => a.phoneNumber === e.target.value);
                                                if (agent) setSelectedAgent(agent);
                                            }}
                                            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            {activeAgents.map((agent, index) => (
                                                <option key={index} value={agent.phoneNumber}>
                                                    {agent.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <button
                                    onClick={handleChatClick}
                                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaWhatsapp />
                                    {isOnline ? "شروع چت" : "ارسال پیام"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    ${sizeClasses[checkConfig.size]}
                    relative
                    flex items-center justify-center
                    bg-[#25D366] hover:bg-[#20BA5A]
                    text-white
                    rounded-full
                    shadow-2xl
                    transition-all duration-300
                    transform
                    hover:scale-110
                    active:scale-95
                    group
                `}
                aria-label="چت در واتساپ"
                title={isOnline ? "چت در واتساپ" : "ارسال پیام"}
            >
                {/* Pulse animation */}
                {checkConfig.showPulse && (
                    <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" style={{ animationDuration: '2s' }} />
                )}
                
                <FaWhatsapp className="relative z-10" />
                
                {/* Online/Offline indicator */}
                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    isOnline ? 'bg-green-400' : 'bg-orange-400'
                }`} />
                
                {/* Notification Badge */}
                {checkConfig.notificationBadge !== null && checkConfig.notificationBadge > 0 && (
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                        {checkConfig.notificationBadge > 99 ? '99+' : checkConfig.notificationBadge}
                    </span>
                )}
            </button>
        </div>
    );
}
