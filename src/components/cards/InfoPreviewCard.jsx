"use client"
import CountUp from "react-countup";

const InfoPreviewCard = ({ info: { text, value, aosDelay } }) => {
    return (
        <div
            className="shadow-md bg-slate-200 dark:bg-slate-800 rounded-md relative cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 dark:border dark:border-slate-700"
            data-aos="fade-up"
            data-aos-delay={aosDelay && aosDelay}
        >
            <div className="flex justify-center translate-y-0">
                <div className="w-3/4">
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-teal-500 dark:via-teal-400 to-transparent w-full"></div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center p-8">
                <p className="font-bold mb-2 text-teal-500 dark:text-teal-400 text-2xl md:text-3xl lg:text-4xl">
                    <CountUp start={0} end={value} separator="+" duration={2.5} />+
                </p>
                <p className="mb-0 leading-5 text-sm lg:text-base text-slate-700 dark:text-slate-300 font-medium text-nowrap">{text}</p>
            </div>
        </div>
    );
};

export default InfoPreviewCard;
