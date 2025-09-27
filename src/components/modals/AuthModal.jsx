"use client"
import Image from "next/image";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setIsAuthOpen } from "@/lib/features/auth/authSlice";

const AuthModal = () => {
    const { isAuthOpen } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const handleSubmit = () => {
        console.log("first")
    };

    return (
        <Dialog open={isAuthOpen} as="div" className="relative focus:outline-none z-[9999999999]" onClose={() => dispatch(setIsAuthOpen())}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 bg-slate-950 bg-opacity-80">
                    <DialogPanel
                        transition
                        className="w-full max-w-md flex flex-col  items-center rounded-2xl bg-white p-5 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <Image src="/assets/logo/logo-text.png" width="0" height="0" alt="هیکاوب" title="هیکاوب" className="w-auto" sizes="100vw" />
                        <DialogTitle as="h2" className="text-sm font-semibold text-slate-500 mt-5">
                            ورود | ثبت نام
                        </DialogTitle>
                        <form onSubmit={() => handleSubmit()} className="w-10/12 md:w-9/12 flex flex-col gap-y-5 mt-7">
                            <input
                                type="text"
                                name=""
                                id=""
                                placeholder="شماره همراه"
                                className="rounded-md p-3 border text-sm text-slate-700 text-left border-slate-300 focus:border-teal-500 outline-none transition-all duration-300 ease-in-out placeholder:text-sm placeholder:text-right"
                            />
                            <Button
                                className="w-full rounded-md bg-teal-500 p-3 text-sm text-center font-semibold text-white data-[hover]:bg-teal-600 transition-colors duration-300 ease-in-out outline-none"
                                onClick={() => dispatch(setIsAuthOpen())}
                            >
                                ارسال
                            </Button>
                        </form>
                        <p className="text-[10px] text-slate-700 mt-7">
                            ورود شما به معنای <span className="text-teal-600"> پذیرش شرایط هیکاوب</span> و <span className="text-teal-600">قوانین حریم‌ خصوصی</span> است.{" "}
                        </p>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default AuthModal;
