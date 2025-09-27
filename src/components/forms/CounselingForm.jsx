"use client";

const CounselingForm = () => {
    return (
        <form
            onSubmit={() => {}}
            className="w-full flex flex-col gap-3 md:gap-4 p-3 md:p-3.5 rounded-2xl border border-teal-500 shadow-md shadow-teal-500"
            data-aos="fade-right"
            data-aos-delay="250"
        >
            <input type="tel" name="" id="" className="w-full rounded-md outline-none bg-slate-50 p-3 md:p-3.5 text-sm placeholder:text-right" placeholder="شماره موبایل" />
            <div className="flex items-center gap-1.5 md:gap-4">
                <input type="text" className="w-full rounded-md outline-none bg-slate-50 p-3 md:p-3.5 text-sm" placeholder="نام" />
                <input type="text" className="w-full rounded-md outline-none bg-slate-50 p-3 md:p-3.5 text-sm" placeholder="نام خانوادگی" />
            </div>
            <input type="email" id="" name="" className="w-full rounded-md outline-none bg-slate-50 p-2.5 md:p-3.5 text-sm" placeholder="ایمیل (اختیاری)" />
            <textarea name="" id="" className="w-full rounded-md outline-none bg-slate-50 p-3 md:p-3.5 text-sm" placeholder="افزودن جزئیات (اختیاری)"></textarea>
            <button className="w-full rounded-md outline-none bg-teal-500 hover:bg-teal-700 text-white font-bold p-3 md:p-3.5 text-sm transition-colors duration-300 ease-in-out">
                درخواست مشاوره
            </button>
        </form>
    );
};

export default CounselingForm;
