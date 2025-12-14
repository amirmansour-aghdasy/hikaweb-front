"use client";

import Image from "next/image";
import { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";

const TeamMemberCard = ({ member: { thumbnailUrl, name, position, socialLinks }, ...otherProps }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Filter out empty social links
    const activeSocialLinks = Object.entries(socialLinks || {}).filter(([_, url]) => url && url.trim() !== "");

    return (
        <div
            className="group relative w-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-out transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-600"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...otherProps}
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-teal-600/0 group-hover:from-teal-500/5 group-hover:to-teal-600/10 transition-all duration-300 pointer-events-none z-10" />

            {/* Image Container */}
            <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                <Image
                    src={imageError ? "/assets/images/team-member.png" : thumbnailUrl || "/assets/images/team-member.png"}
                    alt={name || "عضو تیم"}
                    title={name || "عضو تیم"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                    className={`object-cover transition-transform duration-500 ease-out ${
                        isHovered ? "scale-110" : "scale-100"
                    }`}
                    onError={() => setImageError(true)}
                />
                
                {/* Overlay gradient on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content Container */}
            <div className="relative p-4 md:p-5 space-y-3">
                {/* Name and Position */}
                <div className="text-center space-y-1">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                        {name || "نام نامشخص"}
                    </h3>
                    <p className="text-sm md:text-base font-medium text-teal-600 dark:text-teal-400">
                        {position || "موقعیت نامشخص"}
                    </p>
                </div>

                {/* Social Links */}
                {activeSocialLinks.length > 0 && (
                    <div className="flex justify-center items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        {socialLinks.instagram && (
                            <a
                                href={socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50 group/social"
                                aria-label="اینستاگرام"
                            >
                                <BsInstagram className="text-lg md:text-xl transition-transform duration-300 group-hover/social:rotate-12" />
                            </a>
                        )}
                        {socialLinks.telegram && (
                            <a
                                href={socialLinks.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 group/social"
                                aria-label="تلگرام"
                            >
                                <FaTelegramPlane className="text-lg md:text-xl transition-transform duration-300 group-hover/social:-rotate-12" />
                            </a>
                        )}
                        {socialLinks.whatsapp && (
                            <a
                                href={socialLinks.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/50 group/social"
                                aria-label="واتساپ"
                            >
                                <FaWhatsapp className="text-lg md:text-xl transition-transform duration-300 group-hover/social:rotate-12" />
                            </a>
                        )}
                        {socialLinks.linkedin && (
                            <a
                                href={socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 bg-gradient-to-br from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-700/50 group/social"
                                aria-label="لینکدین"
                            >
                                <FaLinkedinIn className="text-lg md:text-xl transition-transform duration-300 group-hover/social:scale-125" />
                            </a>
                        )}
                    </div>
                )}

                {/* Decorative element */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        </div>
    );
};

export default TeamMemberCard;
