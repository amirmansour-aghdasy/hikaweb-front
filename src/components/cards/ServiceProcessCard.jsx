import Image from "next/image";

const ServiceProcessCard = ({ item: { title, iconHref, text } }) => {
    return (
        <div className="w-full h-full snap-center flex flex-col group">
            <span className="flex justify-center rounded-t-2xl items-center text-xl font-bold text-slate-700 dark:text-slate-200 text-center py-5 bg-white dark:bg-slate-800 shadow-inner-2 dark:shadow-slate-900/50 transition-colors duration-300">{title}</span>
            <div className="flex flex-col w-full h-full rounded-b-2xl shadow-inner-3 dark:shadow-slate-900/70 gap-y-3 relative bg-[#008987] dark:bg-teal-700 px-4 py-7 before:content-[''] before:absolute before:-bottom-3.5 before:rotate-45 before:w-7 before:h-7 before:left-1/2 before:-translate-x-1/2 before:bg-[#008987] dark:before:bg-teal-700 transition-colors duration-300">
                {iconHref && iconHref.trim() && (
                    <Image 
                        src={iconHref} 
                        width="0" 
                        height="0" 
                        sizes="100vw" 
                        className="w-10 h-auto mx-auto dark:brightness-110 dark:contrast-110 transition-transform duration-300 group-hover:scale-110" 
                        alt={title || ""} 
                        title={title || ""} 
                    />
                )}
                <p className="text-sm text-center text-white dark:text-slate-100 leading-6">{text}</p>
            </div>
        </div>
    );
};

export default ServiceProcessCard;
