"use client";

import { useState } from "react";
import { GoShareAndroid } from "react-icons/go";
import { 
    FaTelegram, 
    FaWhatsapp, 
    FaTwitter, 
    FaLinkedin, 
    FaFacebook,
    FaCopy,
    FaTimes
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function ShareButton({ title, excerpt, url }) {
    const [showModal, setShowModal] = useState(false);
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const shareTitle = title || '';
    const shareText = excerpt || '';

    const handleShare = async () => {
        // Check if Web Share API is available (mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Error sharing:", err);
                }
            }
        } else {
            // Desktop: Show modal
            setShowModal(true);
        }
    };

    const shareToPlatform = (platform) => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(shareTitle);
        const encodedText = encodeURIComponent(shareText);

        let shareLink = '';

        switch (platform) {
            case 'telegram':
                shareLink = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
                break;
            case 'whatsapp':
                shareLink = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
                break;
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
                break;
            case 'linkedin':
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(shareUrl);
                toast.success('لینک کپی شد!');
                setShowModal(false);
                return;
            default:
                return;
        }

        if (shareLink) {
            window.open(shareLink, '_blank', 'width=600,height=400');
            setShowModal(false);
        }
    };

    return (
        <>
            <button
                onClick={handleShare}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-teal-600 dark:hover:bg-teal-600 hover:text-white text-slate-700 dark:text-slate-300 transition-all duration-300 shadow-sm hover:shadow-md"
                title="اشتراک‌گذاری"
            >
                <GoShareAndroid className="w-5 h-5" />
            </button>

            {/* Share Modal for Desktop */}
            {showModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowModal(false)}
                >
                    <div 
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                اشتراک‌گذاری
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => shareToPlatform('telegram')}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                            >
                                <FaTelegram className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">تلگرام</span>
                            </button>

                            <button
                                onClick={() => shareToPlatform('whatsapp')}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
                            >
                                <FaWhatsapp className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">واتساپ</span>
                            </button>

                            <button
                                onClick={() => shareToPlatform('twitter')}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors group"
                            >
                                <FaTwitter className="w-8 h-8 text-sky-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">توییتر</span>
                            </button>

                            <button
                                onClick={() => shareToPlatform('linkedin')}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                            >
                                <FaLinkedin className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">لینکدین</span>
                            </button>

                            <button
                                onClick={() => shareToPlatform('facebook')}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                            >
                                <FaFacebook className="w-8 h-8 text-blue-700 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">فیسبوک</span>
                            </button>

                            <button
                                onClick={() => shareToPlatform('copy')}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors group"
                            >
                                <FaCopy className="w-8 h-8 text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">کپی لینک</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

