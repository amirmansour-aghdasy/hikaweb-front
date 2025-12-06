"use client";

import Image from "next/image";

// Fallback brands if API fails
const fallbackBrands = [
    "/assets/brands/brand-1.png",
    "/assets/brands/brand-2.png",
    "/assets/brands/brand-3.png",
    "/assets/brands/brand-4.png",
    "/assets/brands/brand-5.png",
    "/assets/brands/brand-6.png",
    "/assets/brands/brand-7.png",
    "/assets/brands/brand-8.png",
    "/assets/brands/brand-9.png",
    "/assets/brands/brand-10.png",
    "/assets/brands/brand-11.png",
    "/assets/brands/brand-12.png"
];

const BrandsSection = ({ brands = [] }) => {
    const displayBrands = brands.length > 0 ? brands : fallbackBrands;

    return (
        <section id="home-page-brands-slider" className="w-full">
            <h4
                className="text-lg relative font-bold flex items-center text-slate-700 before:content-[''] before:absolute before:-right-[2015px] before:w-[2000px] before:rounded-full before:h-1 before:bg-teal-100 after:content=[''] after:absolute after:w-[30px] after:h-1 after:bg-teal-500 after:rounded-full after:-right-[45px]"
                data-aos="fade-left"
            >
                افتخار همکاری با بیش از 27 برند
            </h4>

            <div className="our-scrolling-ticker">
                <div className="scrolling-ticker-box relative flex overflow-hidden select-none gap-5 items-center">
                    <div className="scrolling-content shrink-0 flex gap-3.5 md:gap-5 min-w-full animate-scroll py-5 md:py-10">
                        {[...displayBrands, ...displayBrands].map((brand, index) => (
                            <div
                                className="flex justify-center items-center h-auto rounded-2xl md:rounded-none md:shadow-none shadow-md py-2.5 px-11 md:p-0"
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index * 150}
                            >
                                <Image
                                    src={brand}
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    alt=""
                                    className="w-full mx-auto h-32 grayscale hover:grayscale-0 trnasition-all duration-500 ease-in-out aspect-square object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandsSection;

