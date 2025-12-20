import Image from "next/image";
import { getInitials } from "@/utils";
import { MdStar } from "react-icons/md";
import { HiChatBubbleLeftRight } from "react-icons/hi2";

const CommentCard = ({ comment: { writer, text, position, thumbnail } }) => {
    return (
        <div className="group relative w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-300 overflow-hidden">
            {/* Quote Icon - Decorative */}
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <HiChatBubbleLeftRight className="w-16 h-16 text-teal-500 dark:text-teal-400" />
            </div>
            
            {/* Content */}
            <div className="flex flex-col flex-1 p-5 md:p-6 relative z-10">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, index) => (
                        <MdStar key={index} className="text-yellow-400 dark:text-yellow-500 w-4 h-4" />
                    ))}
                </div>
                
                {/* Comment Text */}
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-5 flex-1 line-clamp-4 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                    {text}
                </p>
                
                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-4"></div>
                
                {/* Author Info */}
                <div className="flex items-center gap-3">
                    {thumbnail ? (
                        <Image 
                            src={thumbnail} 
                            alt={writer} 
                            title={writer} 
                            sizes="100vw" 
                            width={0} 
                            height={0} 
                            className="rounded-full border-2 border-teal-200 dark:border-teal-700 w-12 h-12 md:w-14 md:h-14 shadow-md object-cover" 
                        />
                    ) : (
                        <div className="rounded-full w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-800 dark:to-teal-900 text-teal-700 dark:text-teal-300 shadow-md grid place-items-center border-2 border-teal-200 dark:border-teal-700">
                            <span className="text-base md:text-lg font-bold">{getInitials(writer)}</span>
                        </div>
                    )}
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="text-sm md:text-base text-slate-800 dark:text-slate-100 font-bold truncate">{writer}</span>
                        <span className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">{position}</span>
                    </div>
                </div>
            </div>
            
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 via-teal-50/0 to-teal-50/0 dark:from-teal-900/0 dark:via-teal-900/0 dark:to-teal-900/0 group-hover:from-teal-50/30 group-hover:via-teal-50/20 group-hover:to-teal-50/30 dark:group-hover:from-teal-900/20 dark:group-hover:via-teal-900/10 dark:group-hover:to-teal-900/20 transition-all duration-300 pointer-events-none"></div>
        </div>
    );
};

export default CommentCard;
