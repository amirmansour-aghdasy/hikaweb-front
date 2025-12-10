import Image from "next/image";
import Link from "next/link";
import { serverGet } from "@/lib/api/server";

export const metadata = {
    title: "سایت در حال تعمیر و نگهداری | هیکاوب",
    description: "سایت در حال تعمیر و نگهداری است. لطفاً بعداً مراجعه کنید.",
    robots: "noindex, nofollow",
};

export default async function MaintenancePage() {
    // Fetch maintenance message and public settings
    let maintenanceMessage = {
        fa: "در حال حاضر در حال انجام به‌روزرسانی‌های مهم هستیم تا تجربه بهتری برای شما فراهم کنیم.",
        en: "We are currently performing important updates to provide you with a better experience."
    };
    
    let siteName = "هیکاوب";
    let socialMedia = {
        telegram: "https://t.me/hikaweb",
        instagram: "https://www.instagram.com/hikaweb.ir/"
    };

    try {
        // Fetch maintenance status for message
        const maintenanceRes = await serverGet('/settings/maintenance', { revalidate: 5 });
        if (maintenanceRes?.data?.maintenance?.message) {
            maintenanceMessage = maintenanceRes.data.maintenance.message;
        }

        // Fetch public settings for site name and social media
        const settingsRes = await serverGet('/settings/public', { revalidate: 60 });
        if (settingsRes?.data?.settings) {
            const settings = settingsRes.data.settings;
            siteName = settings.siteName?.fa || settings.siteName || siteName;
            if (settings.socialMedia) {
                socialMedia = {
                    telegram: settings.socialMedia.telegram || socialMedia.telegram,
                    instagram: settings.socialMedia.instagram || socialMedia.instagram
                };
            }
        }
    } catch (error) {
        // If API fails, use default values
        console.error('Error fetching maintenance data:', error);
    }

    // Get current language (default to fa)
    const currentLang = 'fa';
    const message = maintenanceMessage[currentLang] || maintenanceMessage.fa || maintenanceMessage.en;

    return (
        <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="w-full max-w-2xl mx-auto px-5 py-10 text-center">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12 transition-colors duration-300" data-aos="zoom-in">
                    <div className="mb-8">
                        <Image
                            src="/assets/logo/large-logo-text.png"
                            alt={siteName}
                            width={200}
                            height={60}
                            className="mx-auto"
                            priority
                        />
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                        سایت در حال تعمیر و نگهداری است
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        {message}
                    </p>
                    
                    <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 rounded-xl p-6 mb-8">
                        <p className="text-base text-slate-700 dark:text-slate-300">
                            به زودی برمی‌گردیم!
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            برای اطلاعات بیشتر می‌توانید با ما در تماس باشید
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {socialMedia.telegram && (
                            <a
                                href={socialMedia.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-teal-600 dark:bg-teal-700 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-800 transition-colors duration-300"
                            >
                                <span>تماس با ما در تلگرام</span>
                            </a>
                        )}
                        {socialMedia.instagram && (
                            <a
                                href={socialMedia.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-slate-700 dark:bg-slate-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors duration-300"
                            >
                                <span>اینستاگرام</span>
                            </a>
                        )}
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            آژانس دیجیتال مارکتینگ {siteName}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

