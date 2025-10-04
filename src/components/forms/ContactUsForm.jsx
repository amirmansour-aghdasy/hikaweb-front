"use client";

const ContactUsForm = () => {
    const handleSubmit = () => {
        console.log("first");
    };

    return (
        <form onSubmit={() => handleSubmit()} className="w-full rounded-2xl bg-[#008987] flex flex-col gap-3.5 pb-5 md:pb-10 pt-5 md:pt-10">
            <h2 className="text-xs text-slate-700 rounded-xl bg-white shadow-md px-3.5 py-2 mx-auto" data-aos="fade-down">تماس با ما</h2>
            <div className="w-full flex justify-center items-center">
                <span className="w-full h-0.5 bg-white" data-aos="fade-left" />
                <span className="text-xs text-slate-700 whitespace-nowrap rounded-xl bg-white shadow-md px-3.5 py-2" data-aos="zoom-out">
                    ما پس از دریافت پیام تا 24 ساعت آینده با شما تماس خواهیم گرفت.
                </span>
                <span className="w-full h-0.5 bg-white" data-aos="fade-right" />
            </div>
            <div className="w-11/12 md:w-10/12 mx-auto flex flex-col gap-3.5 mt-3.5 md:mt-0">
                <input type="text" name="" id="" className="w-full rounded-lg text-sm p-2.5 md:p-3.5 placeholder:text-xs border border-[#0E443C]" placeholder="نام و نام خانوادگی" data-aos="fade-left" />
                <input type="text" name="" id="" className="w-full rounded-lg text-sm p-2.5 md:p-3.5 placeholder:text-xs border border-[#0E443C]" placeholder="شماره همراه" data-aos="fade-right" />
                <input type="text" name="" id="" className="w-full rounded-lg text-sm p-2.5 md:p-3.5 placeholder:text-xs border border-[#0E443C]" placeholder="ایمیل خود را وارد نمائید" data-aos="zoom-out" />
                <textarea name="" id="" rows="4" className="w-full rounded-lg text-sm p-2.5 md:p-3.5 placeholder:text-xs border border-[#0E443C]" placeholder="پیام خود را بنویسید" data-aos="zoom-in"></textarea>
                <button type="submit" className="w-full text-[#0E443C] font-bold text-sm rounded-lg p-2.5 md:p-3.5 border border-white bg-[#E2E8F0] shadow-md" data-aos="fade-up">
                    ثبت درخواست
                </button>
            </div>
        </form>
    );
};

export default ContactUsForm;
