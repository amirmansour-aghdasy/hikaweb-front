import "./globals.css";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/effect-cards";

import { iranSanse } from "@/lib/fonts";
import StoreProvider from "./StoreProvider";
import { Footer, Header } from "@/components/common";
import { ActionButtonsContainer, ModalsContainer, ScriptsContainer } from "@/containers";

export const metadata = {
    title: "آژانس دیجیتال مارکتینگ هیکاوب | هیکاوب انرژی هر کسب و کار",
    description: "آژانس دیجیتال مارکتینگ هیکاوب ارائه دهنده انواع خدمات برندیگ از جمله : طراحی لوگو،مدیریت شبکه های اجتماعی،طراحی سایت،سئو سایت،طراحی تیزر و موشن گرافیک.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="fa" dir="rtl">
            <body className={`container h-auto min-h-screen py-5 flex flex-col ${iranSanse.className} overflow-x-hidden`}>
                <span className="absolute w-full top-0 right-0 h-1 bg-teal-500"></span>
                <StoreProvider>
                    <ScriptsContainer />
                    <ModalsContainer />
                    <ActionButtonsContainer />
                    <Header />
                    {children}
                    <Footer />
                </StoreProvider>
            </body>
        </html>
    );
}
