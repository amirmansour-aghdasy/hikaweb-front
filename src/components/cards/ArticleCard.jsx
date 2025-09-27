"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { BsClock } from "react-icons/bs";
import { TbArrowBackUp } from "react-icons/tb";
import { GoShareAndroid } from "react-icons/go";
import { MdOutlineArticle } from "react-icons/md";
import { FiArrowRightCircle } from "react-icons/fi";

const ArticleCard = ({ article: { title, description, thumbnail, createdAt, readTime } }) => {
    const [abstract, setAbstract] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title,
                text: description,
                url: "https://hikaweb.ir",
            });

            console.error("خطا در اشتراک‌گذاری:", err);
        } else {
            navigator.clipboard.writeText("url");
            return toast.success(`لینک مقاله ${title} کپی شد.`);
        }
    };

    return (
        <div className="relative p-2.5 rounded-2xl bg-white shadow-md">
            <div
                className="
          absolute inset-0 rounded-2xl pointer-events-none
          border-t border-t-teal-600
          [mask-image:linear-gradient(black,black)]
          before:content-[''] before:absolute before:inset-0 before:rounded-2xl
          before:border-l before:border-r
          before:border-b-0
          before:[border-image:linear-gradient(to_bottom,#0d9488,transparent)_1]
        "
            />
            <div className="w-full rounded-2xl">
                <div className="w-full relative flex items-center justify-center">
                    <div
                        className={`
          absolute inset-0 rounded-2xl pointer-events-none
          border-t-[3px] border-t-teal-500
          [mask-image:linear-gradient(black,black)]
          before:content-[''] before:absolute before:inset-0 before:rounded-2xl
          before:border-l-[3px] before:border-r-[3px]
          before:border-b-0
          before:[border-image:linear-gradient(to_bottom,#14b8a6,transparent)_1]
            ${abstract && "bg-teal-800/80 transition-colors duration-300 ease-in-out"}
        `}
                    />
                    <Image src={thumbnail} width="0" height="0" className="w-full h-44 rounded-2xl" sizes="100vw" alt={title} title={title} />
                    <div className="flex flex-col items-end gap-y-2.5 absolute top-2.5 left-2.5">
                        <button
                            className={`flex items-center gap-1 left-2.5 px-1.5 py-1 rounded-md transition-all duration-300 ease-in-out border text-[10px] md:text-xs cursor-pointer ${
                                abstract ? "bg-transparent text-white border-teal-500" : "bg-white text-teal-800 border-transparent"
                            }`}
                            onClick={() => setAbstract((prevState) => !prevState)}
                        >
                            {abstract ? <TbArrowBackUp className="size-4" /> : <MdOutlineArticle className="size-4" />}
                            {abstract ? "کاور مقاله" : "چکیده مقاله"}
                        </button>
                        <button
                            onClick={handleShare}
                            className={`border ${
                                abstract ? "bg-transparent text-white border-teal-500" : "bg-white text-teal-800"
                            } transition-all duration-300 ease-in-out rounded-md p-1.5 cursor-pointer`}
                        >
                            <GoShareAndroid className="size-4" />
                        </button>
                    </div>
                    <div className={`absolute w-10/12 flex flex-col gap-y-2.5 items-start transition-opacity duration-300 ease-in-out ${abstract ? "opacity-100" : "opacity-0"}`}>
                        <h3 className="text-base md:text-lg lg:text-xl lg:font-bold w-10/12 truncate text-white">{title}</h3>
                        <p className={`text-white`}>{description}</p>
                    </div>
                </div>
                <div className="w-full flex flex-col mt-2.5 gap-3.5">
                    <Link href="" title="" className="text-base md:text-lg lg:text-xl lg:font-bold w-10/12 truncate text-teal-900">
                        {title}
                    </Link>

                    <div className="w-full flex items-center justify-between mt-2.5 text-[10px] md:text-xs text-slate-500 gap-x-1.5 sm:gap-x-3.5">
                        <span className="flex items-center mb-0.5 gap-1 text-slate-400 text-xs sm:text-sm cursor-default">
                            <MdEdit className="size-4" />
                            {new Date(createdAt).toLocaleDateString("fa-IR")}
                        </span>
                        <span className="flex items-center ml-auto mb-0.5 gap-1 text-slate-400 text-xs sm:text-sm cursor-default">
                            <BsClock className="size-4" />
                            {readTime}
                        </span>
                        <Link
                            href="#"
                            title={title}
                            className="flex items-center gap-1 text-white text-xs bg-teal-700 hover:bg-teal-600 transition-all duration-300 ease-in-out px-1.5 py-1 rounded-md"
                        >
                            <span>
                                <FiArrowRightCircle className="size-4 md:size-5" />
                            </span>
                            مطالعه بیشتر
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
