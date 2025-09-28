"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle, FaLinkedinIn } from "react-icons/fa6";
import { HiMiniDevicePhoneMobile } from "react-icons/hi2";
import Image from "next/image";

export default function LoginPage() {
    const [step, setStep] = useState("phone"); // phone | code
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");

    const sendOtp = async () => {
        const res = await fetch("http://localhost:4000/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone }),
        });
        if (res.ok) {
            setStep("code");
            alert("کد ارسال شد");
        }
    };

    const verifyOtp = async () => {
        await signIn("sms-otp", {
            phone,
            code,
            redirect: true,
            callbackUrl: "/dashboard",
        });
    };

    return (
        <div className="relative w-full max-w-4xl h-[550px] mx-auto bg-white m-5 rounded-3xl shadow-lg overflow-hidden">
            <div className="absolute right-0 w-1/2 h-full z-[1] bg-white flex items-center text-gray-800 text-center p-10 transition-[all,visibility] duration-[600ms] ease-in-out delay-[1200ms] [transition:visibility_0s_1s] max-[650px]:bottom-0 max-[650px]:w-full max-[650px]:h-[70%]">
                <form className="w-full" onSubmit={() => {}}>
                    <h1 className="text-4xl -mt-2 text-slate-700" data-aos="fade-down">
                        ورود و ثبت نام
                    </h1>
                    <div className="relative my-[30px]" data-aos="fade-left">
                        <input
                            type="phone"
                            placeholder="شماره همراه"
                            autoComplete="false"
                            autoCorrect="false"
                            autoFocus="true"
                            className="w-full py-3 pr-12 pl-[20px] bg-slate-200 rounded-lg border-none outline-none text-base text-slate-500 font-medium placeholder:text-[#888] placeholder:font-normal"
                        />
                        <HiMiniDevicePhoneMobile className="bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#888]" />
                    </div>
                    <button
                        data-aos="fade-right"
                        type="submit"
                        className="w-full h-12 bg-teal-500 hover:bg-teal-600 transition-all duration-300 ease-in-out rounded-[8px] shadow-[0_0_10px_rgba(0,0,0,0.1)] text-white font-semibold text-[16px]"
                    >
                        ارسال
                    </button>
                    <p className="text-[14.5px] my-[15px] text-slate-500" data-aos="zoom-in">
                        یا ورود با حساب های
                    </p>
                    <div className="flex justify-center">
                        <span
                            data-aos="fade-up"
                            data-aos-delay="0"
                            className="inline-flex p-2 border-2 border-slate-500 hover:border-teal-500 rounded-[8px] text-base text-slate-700 hover:text-teal-700 transition-all duration-300 ease-in-out mx-2 cursor-pointer"
                        >
                            <FaGoogle />
                        </span>
                        <span
                            data-aos="fade-up"
                            data-aos-delay="250"
                            className="inline-flex p-2 border-2 border-slate-500 hover:border-teal-500 rounded-[8px] text-base text-slate-700 hover:text-teal-700 transition-all duration-300 ease-in-out mx-2 cursor-pointer"
                        >
                            <FaLinkedinIn />
                        </span>
                        <span
                            data-aos="fade-up"
                            data-aos-delay="500"
                            className="inline-flex p-2 border-2 border-slate-500 hover:border-teal-500 rounded-[8px] text-base text-slate-700 hover:text-teal-700 transition-all duration-300 ease-in-out mx-2 cursor-pointer"
                        >
                            <FaGithub />
                        </span>
                    </div>
                </form>
            </div>

            {/* Toggle Box */}
            <div className="absolute w-full h-full">
                <div
                    className="
            absolute left-[-250%] w-[300%] h-full animate-bgPulse rounded-[150px] z-[2] transition-[all] duration-[1800ms] ease-in-out 
            max-[650px]:left-0 max-[650px]:top-[-270%] max-[650px]:w-full max-[650px]:h-[300%] max-[650px]:rounded-[20vw]
          "
                ></div>

                <div className="absolute left-0 w-1/2 h-full text-white flex flex-col justify-center items-center z-[2] transition-all duration-[600ms] ease-in-out delay-[1200ms] max-[650px]:w-full max-[650px]:h-[30%] max-[650px]:top-0">
                    <Image
                        src="/assets/logo/large-logo-text.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        data-aos="zoom-out"
                        className="w-6/12 md:w-10/12 h-auto mask-animation"
                        alt="هیکاوب"
                        title="هیکاوب"
                    />
                </div>
            </div>
        </div>
    );
}
