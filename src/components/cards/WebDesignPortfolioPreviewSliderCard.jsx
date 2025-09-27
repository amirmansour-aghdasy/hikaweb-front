import Link from "next/link";
import Image from "next/image";

const WebDesignPortfolioPreviewSliderCard = ({item: {imageSrc, title}}) => {
    return (
        <div className="w-full rounded-2xl p-3">
            <Image className="w-full h-auto rounded-2xl" src={imageSrc} width="0" height="0" sizes="100vw" alt="" title="" />
            <div className="w-full flex flex-col justify-center items-center pt-3.5 md:pt-7 pb-1">
                <span className="text-lg md:text-xl text-teal-700 underline underline-offset-[12px]">{title}</span>
                <button className="w-44 rounded-2xl text-sm md:text-base text-white py-1.5 text-center bg-teal-600 mt-5">مشاهده پیش نمایش</button>
                <Link href="" className="w-44 rounded-2xl text-sm md:text-base text-white py-1.5 text-center bg-teal-500 mt-1.5">مشاهده زنده</Link>
            </div>
        </div>
    );
};

export default WebDesignPortfolioPreviewSliderCard;
