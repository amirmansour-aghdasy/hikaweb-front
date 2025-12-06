"use client";

import { useState, useEffect } from "react";
import { MdDarkMode, MdLightMode, MdSettingsBrightness } from "react-icons/md";
import { useTheme } from "@/contexts/ThemeContext";

const ToggleThemeMode = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="rounded-full p-2.5 sm:p-2.5 bg-teal-500 text-white outline-none" data-aos="fade-down">
                <MdDarkMode className="text-xl md:text-2xl" />
            </button>
        );
    }

    const cycleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else if (theme === "dark") {
            setTheme("system");
        } else {
            setTheme("light");
        }
    };

    const getIcon = () => {
        if (theme === "system") {
            return <MdSettingsBrightness className="text-xl md:text-2xl" />;
        }
        return resolvedTheme === "dark" 
            ? <MdLightMode className="text-xl md:text-2xl" />
            : <MdDarkMode className="text-xl md:text-2xl" />;
    };

    const getTitle = () => {
        if (theme === "system") {
            return "تم سیستم";
        }
        return resolvedTheme === "dark" ? "حالت روشن" : "حالت تاریک";
    };

    return (
        <button 
            onClick={cycleTheme}
            className="rounded-full p-2.5 sm:p-2.5 bg-teal-500 dark:bg-teal-600 text-white outline-none hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors duration-300" 
            data-aos="fade-down"
            title={getTitle()}
        >
            {getIcon()}
        </button>
    );
};

export default ToggleThemeMode;
