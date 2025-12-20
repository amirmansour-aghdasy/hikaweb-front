/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // Enable class-based dark mode
    content: [
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/containers/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            keyframes: {
                bgPulse: {
                    "0%, 100%": { backgroundColor: "#042f2e" }, // رنگ اول
                    "50%": { backgroundColor: "#0f766e" }, // رنگ دوم
                },
                slideUp: {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(10px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)",
                    },
                },
            },
            animation: {
                bgPulse: "bgPulse 7s ease-in-out infinite",
                scroll: "scroll 30s linear infinite",
                slideUp: "slideUp 0.3s ease-out",
            },
            backgroundImage: {},
            container: {
                center: true,
                padding: "10px",
                screens: {
                    "2xl": { max: "1440px", min: "1440px" },
                },
            },
            backgroundImage: {
                "counseling-img": "url('/assets/images/counseling-bg.png')",
                "mag-landing": "url('/assets/images/mag-landing.webp')",
            },
            boxShadow: {
                "inner-2": "inset 0 8px 10px 0 rgb(0 0 0 / 0.28)",
                "inner-3": "inset 0 25px 40px 0 rgb(0 0 0 / 0.35)",
                "custom-1": "0px 4px 31.4px 2px #00000026",
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography')
    ],
};
