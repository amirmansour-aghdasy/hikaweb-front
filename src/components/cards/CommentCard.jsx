import Image from "next/image";

import { getInitials } from "@/utils";
import { MdStar, MdOutlineDateRange } from "react-icons/md";

const CommentCard = ({ comment: { writer, text, position, thumbnail } }) => {
    return (
        <div className="w-full h-full flex flex-col gap-y-2 sm:gap-y-3.5 rounded-2xl border border-teal-500 p-3">
            <div className="flex items-center gap-x-2">
                {thumbnail ? (
                    <Image src={thumbnail} alt={writer} title={writer} sizes="100vw" width={0} height={0} className="rounded-full border border-slate-100 w-11 h-11 md:w-12 md:h-12 shadow-md" />
                ) : (
                    <div className="rounded-full w-10 h-10 md:w-12 md:h-12 bg-slate-200 text-teal-600 shadow-md grid place-items-center">
                        <span className="text-sm text-teal-600 text-center font-bold">{getInitials(writer)}</span>
                    </div>
                )}
                <div className="flex flex-col gap-y-1 items-start">
                    <span className="text-xs md:text-sm text-slate-700 font-bold">{writer}</span>
                    <span className="text-[10px] md:text-xs text-slate-600">{position}</span>
                </div>
            </div>
            <p className="text-sm sm:text-base text-slate-500 leading-normal md:leading-7 line-clamp-3">{text}</p>
            <span className="inline-flex w-full rounded bg-slate-200 h-0.5"></span>
            <div className="w-full flex justify-between items-center">
                <span className="flex items-center gap-x-1 text-[10px] font-semibold text-slate-500">
                    <MdOutlineDateRange size={"1.3em"} />
                    1403/07/14
                </span>
                <span className="flex items-center justify-end gap-x-0.5">
                    {[...Array(5)].map((_, index) => (
                        <MdStar key={index} className="text-yellow-500" />
                    ))}
                </span>
            </div>
        </div>
    );
};

export default CommentCard;
