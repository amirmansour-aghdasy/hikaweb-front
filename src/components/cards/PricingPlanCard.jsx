import Link from "next/link";

import { PiSealCheckBold } from "react-icons/pi";
import { HiOutlineCreditCard } from "react-icons/hi2";

const PricingPlanCard = ({ plan: { title, value, subTitle, features, desc } }) => {
    return (
        <div className="w-full h-full rounded-2xl flex flex-col">
            <div className="w-full border border-teal-600 flex flex-col justify-center items-center gap-1.5 rounded-t-2xl p-3.5 md:p-7 bg-[#F6F6F6]">
                {title && <h3 className="w-full font-bold text-teal-700 text-xl md:text-2xl text-center text-nowrap truncate">{title}</h3>}
                {value && <h4 className="text-base md:text-lg text-slate-500">{value}</h4>}
                {subTitle && <p className="text-sm md:text-base text-teal-500">{subTitle}</p>}
            </div>
            <ul className="w-full h-full flex flex-col gap-y-3 md:gap-y-3.5 pr-9 pt-5 pb-5 cursor-default">
                {features.map((feature, index) => (
                    <li className="flex items-center gap-1.5" key={index}>
                        <PiSealCheckBold size="1.2em" className="text-teal-500" />
                        <span className="text-sm md:text-base text-slate-500">{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="w-full h-auto flex flex-col justify-center items-center gap-y-2 md:gap-4 bg-teal-500 rounded-b-2xl p-3.5 md:p-6">
                {desc && <p className="w-10/12 md:w-11/12 text-sm md:text-base text-center text-white font-bold leading-7">{desc}</p>}
                <button className="w-7/12 md:w-6/12 text-center text-sm md:text-lg text-teal-900 rounded-md py-1.5 md:py-0.5 bg-white">درخواست مشاوره</button>
            </div>
        </div>
    );
};

export default PricingPlanCard;
