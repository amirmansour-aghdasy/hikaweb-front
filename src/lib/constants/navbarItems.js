import { services_list } from "./servicesList";

export const navbarItems = [
    {
        title: "خدمات",
        children: [...services_list],
    },
    {
        title: "تعرفه خدمات",
        url: "#",
    },
    {
        title: "نمونه کار",
        url: "#",
    },
    {
        title: "دریافت مشاوره",
        url: "/#counseling",
    },
    {
        title: "درباره ما",
        url: "/about-us",
    },
    {
        title: "تماس با ما",
        url: "/contact-us",
    },
    {
        title: "هیکا مگ",
        url: "/mag",
    },
];
