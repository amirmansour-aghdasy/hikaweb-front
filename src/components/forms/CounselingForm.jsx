"use client";
import { useState } from "react";

import clsx from "clsx";
import { HiCheck, HiChevronDown } from "react-icons/hi2";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { services_list } from "@/lib/constants";

const titles = services_list.map((service) => service.title);

const CounselingForm = () => {
    const [selected, setSelected] = useState(null);

    return (
        <form onSubmit={() => {}} className="w-full flex flex-col gap-3 md:gap-4 p-3 md:p-3.5 rounded-2xl border border-teal-500 shadow-md shadow-teal-500" data-aos="fade-right" data-aos-delay="250">
            <input type="tel" name="" id="" className="w-full rounded-md outline-none bg-slate-50 p-3 md:p-3.5 text-sm placeholder:text-right" placeholder="شماره موبایل" />
            <div className="flex items-center gap-1.5 md:gap-4">
                <input type="text" className="w-full rounded-md outline-none bg-slate-50 p-3 md:p-3.5 text-sm" placeholder="نام" />
                <input type="text" className="w-full rounded-md outline-none bg-slate-50 p-3 md:p-3.5 text-sm" placeholder="نام خانوادگی" />
            </div>
            <Listbox value={selected} onChange={setSelected}>
                <ListboxButton
                    className={clsx(
                        "relative w-full rounded-md bg-slate-50 py-3 pl-8 pr-3 text-right text-slate-400 text-base",
                        "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
                    )}
                >
                   {selected ? selected : "خدمت مورد نظر را انتخاب کنید."}
                    <HiChevronDown className="group pointer-events-none absolute top-4 left-2.5 size-4 fill-slate-500" aria-hidden="true" />
                </ListboxButton>
                <ListboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                        "w-(--button-width) rounded-xl border border-teal-500 bg-slate-200 p-1 [--anchor-gap:--spacing(1)] focus:outline-none",
                        "transition duration-100 ease-in data-leave:data-closed:opacity-0"
                    )}
                >
                    {titles.map((title, index) => (
                        <ListboxOption key={index} value={title} className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10">
                            <HiCheck className="invisible size-4 fill-slate-700 group-data-selected:visible" />
                            <div className="text-sm/6 text-slate-500">{title}</div>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Listbox>
            <input type="email" id="" name="" className="w-full rounded-md outline-none bg-slate-50 p-2.5 md:p-3.5 text-sm" placeholder="ایمیل (اختیاری)" />
            <button className="w-full rounded-md outline-none bg-teal-500 hover:bg-teal-700 text-white font-bold p-3 md:p-3.5 text-sm transition-colors duration-300 ease-in-out">
                درخواست مشاوره
            </button>
        </form>
    );
};

export default CounselingForm;
