"use client";

import { useEffect, useState, useRef } from "react";
import { HiShare, HiLocationMarker } from "react-icons/hi";

// Company location coordinates (Tehran, Asrafi Esfahani, Mohammadi)
const COMPANY_LOCATION = {
    lat: 35.7294839,
    lng: 51.3350453,
    address: "تهران، بزرگراه اشرفی اصفهانی، محمدی (محله‌ی مرزداران)"
};

export default function InteractiveMap() {
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const containerIdRef = useRef(`map-container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        // Import Leaflet CSS and library only on client side
        Promise.all([
            import("leaflet/dist/leaflet.css"),
            import("leaflet")
        ]).then(([, leafletModule]) => {
            const L = leafletModule.default || leafletModule;
            
            // Fix for default marker icons
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
                iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
            });

            // Initialize map only if not already initialized
            if (!mapInstanceRef.current && mapContainerRef.current) {
                const map = L.map(mapContainerRef.current, {
                    center: [COMPANY_LOCATION.lat, COMPANY_LOCATION.lng],
                    zoom: 15,
                    scrollWheelZoom: true
                });

                // Add tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Add marker
                const marker = L.marker([COMPANY_LOCATION.lat, COMPANY_LOCATION.lng]).addTo(map);
                marker.bindPopup(`
                    <div style="text-align: center;">
                        <p style="font-weight: bold; color: #0d9488; margin-bottom: 8px;">هیکاوب</p>
                        <p style="font-size: 14px;">${COMPANY_LOCATION.address}</p>
                    </div>
                `);

                mapInstanceRef.current = map;
                setIsMounted(true);
            }
        }).catch((error) => {
            console.error("Error loading Leaflet:", error);
            setIsMounted(true); // Still show UI even if map fails
        });

        return () => {
            // Cleanup map instance on unmount
            if (mapInstanceRef.current) {
                try {
                    mapInstanceRef.current.remove();
                } catch (e) {
                    // Silently ignore cleanup errors
                }
                mapInstanceRef.current = null;
            }
        };
    }, []);

    const handleShare = async () => {
        const shareData = {
            title: "آدرس هیکاوب",
            text: COMPANY_LOCATION.address,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                setShowShareMenu(false);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Error sharing:", err);
                }
            }
        } else {
            // Fallback: Copy to clipboard
            const textToCopy = `${COMPANY_LOCATION.address}\n${window.location.href}`;
            try {
                await navigator.clipboard.writeText(textToCopy);
                alert("آدرس کپی شد!");
                setShowShareMenu(false);
            } catch (err) {
                console.error("Error copying:", err);
            }
        }
    };

    const openInNeshan = () => {
        const url = `neshan://search?q=${COMPANY_LOCATION.lat},${COMPANY_LOCATION.lng}`;
        window.open(url, "_blank");
    };

    const openInBalad = () => {
        const url = `balad://search?q=${COMPANY_LOCATION.lat},${COMPANY_LOCATION.lng}`;
        window.open(url, "_blank");
    };

    const openInGoogleMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${COMPANY_LOCATION.lat},${COMPANY_LOCATION.lng}`;
        window.open(url, "_blank");
    };

    return (
        <div className="relative w-full h-72 rounded-2xl overflow-hidden">
            <div 
                id={containerIdRef.current}
                ref={mapContainerRef}
                className="w-full h-full z-0"
            />
            
            {!isMounted && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700 animate-pulse">
                    <p className="text-slate-500">در حال بارگذاری نقشه...</p>
                </div>
            )}

            {/* Control Buttons */}
            <div className="absolute top-2 right-2 z-[1000] flex flex-col gap-2">
                {/* Share Button */}
                <div className="relative">
                    <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 p-2 rounded-lg shadow-lg hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors"
                        title="اشتراک‌گذاری"
                    >
                        <HiShare className="w-5 h-5" />
                    </button>
                    {showShareMenu && (
                        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-2 min-w-[200px] z-[1001]">
                            <button
                                onClick={handleShare}
                                className="w-full text-right px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-sm"
                            >
                                اشتراک‌گذاری
                            </button>
                            <hr className="my-2 border-slate-200 dark:border-slate-700" />
                            <button
                                onClick={openInNeshan}
                                className="w-full text-right px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-sm"
                            >
                                باز کردن در نشان
                            </button>
                            <button
                                onClick={openInBalad}
                                className="w-full text-right px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-sm"
                            >
                                باز کردن در بلد
                            </button>
                            <button
                                onClick={openInGoogleMaps}
                                className="w-full text-right px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-sm"
                            >
                                باز کردن در Google Maps
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation Button */}
                <button
                    onClick={openInNeshan}
                    className="bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 p-2 rounded-lg shadow-lg hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors"
                    title="مسیریابی"
                >
                    <HiLocationMarker className="w-5 h-5" />
                </button>
            </div>

            {/* Click outside to close share menu */}
            {showShareMenu && (
                <div
                    className="fixed inset-0 z-[999]"
                    onClick={() => setShowShareMenu(false)}
                />
            )}
        </div>
    );
}
