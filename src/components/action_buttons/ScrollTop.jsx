"use client";
import { useState, useEffect } from "react";

import { FaChevronUp } from "react-icons/fa6";

const ScrollTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <button onClick={scrollToTop} className={`${isVisible ? "bottom-5 md:bottom-10 opacity-100" : "-bottom-10 opacity-0"} rounded-full bg-teal-500 text-white fixed left-3.5 md:left-6 p-3 z-50 transition-all duration-300 ease-in-out`}>
            <FaChevronUp />
        </button>
    );
};

export default ScrollTop;
