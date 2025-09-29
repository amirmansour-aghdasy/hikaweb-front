import Link from "next/link";

import { PiSealCheckBold } from "react-icons/pi";
import { HiOutlineCreditCard } from "react-icons/hi2";

const PricingPlanCard = ({ plan: { title, value, forWho, features } }) => {
    return (
        <div className="w-full h-full rounded-2xl flex flex-col">
            <div className="w-full border border-teal-600 flex flex-col justify-center items-center gap-1.5 rounded-t-2xl p-3.5 md:p-7 bg-[#F6F6F6]">
                {title && <h3 className="font-bold text-teal-700 text-xl md:text-2xl">{title}</h3>}
                {value && <h4 className="text-base md:text-lg text-slate-500">{value}</h4>}
                {forWho && <p className="text-sm md:text-base text-teal-500">{forWho}</p>}
            </div>
            <ul className="w-full h-full flex flex-col gap-2 md:gap-3.5 pr-9 pt-5 pb-5 cursor-default">
                {features.map((feature, index) => (
                    <li className="flex items-center gap-1.5" key={index}>
                        <PiSealCheckBold size="1.2em" className="text-teal-500" />
                        <span className="text-sm md:text-base text-slate-500">{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="w-full flex flex-col justify-center items-center gap-4 bg-teal-500 rounded-b-2xl p-3.5 md:p-6">
                <h3 className="flex items-center gap-2">
                    <span className="border-b border-b-white">
                        <HiOutlineCreditCard className="-rotate-45 ml-0.5" color="white" size="1.25em" />
                    </span>
                    <span className="text-base md:text-lg text-white font-bold">شرایط پرداخت اقساط</span>
                </h3>
                <button className="w-8/12 text-center text-sm md:text-lg text-teal-900 rounded-md py-1.5 md:py-0.5 bg-white">درخواست مشاوره</button>
            </div>
        </div>
    );
};

export default PricingPlanCard;
