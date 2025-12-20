import Image from "next/image";

import TeamMemberCard from "@/components/cards/TeamMemberCard";
import { defaultMetadata, generateOrganizationSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { serverGet } from "@/lib/api/server";

export const metadata = {
    title: "درباره ما | هیکاوب",
    description: "هیکاوب از سال 1399 فعالیت خود را در زمینه مارکتینگ و دیجیتال مارکتینگ استارت زده و مفتخر است به بیش از 70 کسب و کار ایرانی کمک کرده است. تیم حرفه‌ای ما در زمینه‌های طراحی سایت، سئو، برندسازی و دیجیتال مارکتینگ فعالیت می‌کند.",
    keywords: "درباره هیکاوب, تیم هیکاوب, آژانس دیجیتال مارکتینگ, هیکاوب, تاریخچه هیکاوب, تیم حرفه‌ای",
    openGraph: {
        title: "درباره ما | هیکاوب",
        description: "هیکاوب انرژی هر کسب و کار - آژانس دیجیتال مارکتینگ با بیش از 4 سال سابقه",
        url: `${defaultMetadata.siteUrl}/about-us`,
        type: "website",
        images: [
            {
                url: `${defaultMetadata.siteUrl}/assets/logo/large-logo-text.png`,
                width: 1200,
                height: 630,
                alt: "درباره هیکاوب",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "درباره ما | هیکاوب",
        description: "هیکاوب انرژی هر کسب و کار",
    },
    alternates: {
        canonical: `${defaultMetadata.siteUrl}/about-us`,
    },
};

const AboutUsPage = async () => {
    // Fetch team members from API
    let teamMembers = [];
    try {
        const teamRes = await serverGet('/team/public?limit=50', { revalidate: 300 });
        // Backend returns: { success: true, data: { teamMembers: [...] } }
        if (teamRes?.success && teamRes?.data?.teamMembers) {
            teamMembers = teamRes.data.teamMembers;
        } else if (teamRes?.teamMembers) {
            // Fallback for different response structure
            teamMembers = teamRes.teamMembers;
        }
    } catch (error) {
        console.error("Error fetching team members:", error);
        // Fallback to empty array if API fails
        teamMembers = [];
    }
    // Generate structured data
    const organizationSchema = generateOrganizationSchema();
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "صفحه اصلی", url: defaultMetadata.siteUrl },
        { name: "درباره ما", url: `${defaultMetadata.siteUrl}/about-us` },
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <main className="w-full py-7 md:py-14 flex flex-col gap-7 md:gap-14 overflow-hidden md:overflow-visible">
            <Image
                src="/assets/banners/about-us.webp"
                sizes="100vw"
                width={1440}
                height={374}
                className="w-full h-32 md:h-auto rounded-2xl"
                alt="درباره ما"
                title="درباره ما"
                data-aos="zoom-in"
                priority
            />
            <section id="" className="w-full md:max-w-6xl mx-auto grid grid-cols-12 place-items-center place-content-center gap-5 md:gap-0">
                <Image
                    src="/assets/images/about-us-page-img-1.png"
                    className="col-span-9 md:col-span-4 w-full"
                    width="0"
                    height="0"
                    alt="درباره ما"
                    title="درباره ما"
                    sizes="100vw"
                    data-aos="fade-left"
                />
                <div className="col-span-12 md:col-span-8">
                    <h1 className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 font-semibold" data-aos="fade-down">
                        درباره ما
                    </h1>
                    <p className="w-full md:w-11/12 p-5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 left-6 text-xs font-semibold leading-7 md:leading-8 sm:text-sm md:text-base mt-5" data-aos="fade-up">
                        هیکاوب از سال 1399 فعالیت خود را در زمینه مارکتینگ و دیجیتال مارکتینگ استارت زده و مفتخر است به بیش از 70 کسب و کار ایرانی کمک کرده است ، هدف ما انرژی دادن و کمک به هر کسب و
                        کار ایرانی در زمینه های مختلف برای دیده شدن است . دقیقا شعار هیکاوب نیز همین است : <span className="text-teal-600 dark:text-teal-400">" هیکاوب انرژی هر کسب و کار ".</span> تیم هیکاوب از شروع تا
                        اوج کسب و کار شما میتواند همراهتان باشد ، زیرا طیف خدمات تخصصی ما بسیار گسترده است و از برندسازی تا بازاریابی و تبلیغات شمارا شامل میگردد ، امروزه در زمینه دیجیتال مارکتینگ ما
                        سعی کردیم تیمی دلسوز برای کسب و کار های ایرانی جمع آوری کنیم تا به امید خدا در کنار پیشرفت داشته باشیم .
                    </p>
                </div>
            </section>
            <section id="team-members" className="w-full">
                <div className="w-full flex justify-center items-center gap-2.5">
                    <span className="w-full h-0.5 bg-teal-700 dark:bg-teal-600" data-aos="fade-left"></span>
                    <h3 className="text-lg text-slate-700 dark:text-slate-200 whitespace-nowrap font-bold" data-aos="zoom-in">
                        تیم هیکاوب
                    </h3>
                    <span className="w-full h-0.5 bg-teal-700 dark:bg-teal-600" data-aos="fade-right"></span>
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mt-5">
                    {teamMembers.length > 0 ? (
                        teamMembers.map((member, index) => (
                            <TeamMemberCard 
                                member={{
                                    thumbnailUrl: member.avatar || "/assets/images/team-member.png",
                                    name: member.name?.fa || member.name || "",
                                    position: member.position?.fa || member.position || "",
                                    socialLinks: member.socialLinks || {
                                        instagram: "",
                                        telegram: "",
                                        whatsapp: "",
                                    },
                                }} 
                                data-aos="fade-up" 
                                data-aos-delay={index * 250} 
                                key={member._id || index} 
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 text-slate-500 dark:text-slate-400">
                            <p>در حال حاضر اطلاعات تیم در دسترس نیست.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
        </>
    );
};

export default AboutUsPage;
