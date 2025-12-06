import Image from "next/image";

import { BsInstagram } from "react-icons/bs";
import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";

const TeamMemberCard = ({ member: { thumbnailUrl, name, position, socialLinks }, ...otherProps }) => {
    return (
        <div className="w-full grid grid-cols-12 gap-3.5 shadow-md p-1.5 md:p-3 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors duration-300" {...otherProps}>
            <div className="w-full col-span-4 md:col-span-12 p-1.5 md:p-0 border md:border-none border-teal-500 dark:border-teal-600 rounded-lg">
                <Image src={thumbnailUrl} width="0" height="0" sizes="100vw" alt="" title="" className="w-full col-span-3" />
            </div>
            <div className="w-full col-span-6 md:col-span-12 h-full flex flex-col gap-0.5 place-content-center place-items-center">
                <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{name}</span>
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">{position}</span>
            </div>
            <div className="w-full h-full col-span-2 md:col-span-12 flex flex-col md:flex-row justify-center items-center gap-1.5">
                <a href={socialLinks["instagram"]} className="p-1.5 bg-teal-700 dark:bg-teal-800 hover:bg-teal-600 dark:hover:bg-teal-700 transition-all duration-300 ease-in-out rounded-lg group hover:-translate-y-1">
                    <BsInstagram className="text-sm sm:text-base md:text-lg text-white group-hover:text-slate-100 transition-colors duration-300 ease-in-out" />
                </a>
                <a href={socialLinks["whatsapp"]} className="p-1.5 bg-teal-700 dark:bg-teal-800 hover:bg-teal-600 dark:hover:bg-teal-700 transition-all duration-300 ease-in-out rounded-lg group hover:-translate-y-1">
                    <FaWhatsapp className="text-sm sm:text-base md:text-lg text-white group-hover:text-slate-100 transition-colors duration-300 ease-in-out" />
                </a>
                <a href={socialLinks["telegram"]} className="p-1.5 bg-teal-700 dark:bg-teal-800 hover:bg-teal-600 dark:hover:bg-teal-700 transition-all duration-300 ease-in-out rounded-lg group hover:-translate-y-1">
                    <FaTelegramPlane className="text-sm sm:text-base md:text-lg text-white group-hover:text-slate-100 transition-colors duration-300 ease-in-out" />
                </a>
            </div>
        </div>
    );
};

export default TeamMemberCard;
