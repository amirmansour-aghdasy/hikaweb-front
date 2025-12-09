"use client";

import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { HiXMark, HiArrowLeft, HiPhone, HiShare } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function QuickViewModal({ service, isOpen, onClose }) {
    if (!service) return null;

    const serviceName = typeof service.name === 'string' 
        ? service.name 
        : (service.name?.fa || service.name?.en || "");
    const serviceSlug = service.slug?.fa || service.slug?.en || service.slug || "";
    const shortDescription = typeof service.shortDescription === 'string'
        ? service.shortDescription
        : (service.shortDescription?.fa || service.shortDescription?.en || "");
    const description = typeof service.description === 'string'
        ? service.description
        : (service.description?.fa || service.description?.en || "");
    const featuredImage = service.featuredImage || "/assets/giff/market-research.gif";
    const serviceUrl = `/service/${serviceSlug}`;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: serviceName,
                    text: shortDescription || description,
                    url: `${window.location.origin}${serviceUrl}`,
                });
                toast.success("خدمت به اشتراک گذاشته شد");
            } catch (error) {
                if (error.name !== 'AbortError') {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(`${window.location.origin}${serviceUrl}`);
                    toast.success("لینک خدمت کپی شد");
                }
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${window.location.origin}${serviceUrl}`);
            toast.success("لینک خدمت کپی شد");
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
                </TransitionChild>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
                                <DialogTitle className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
                                    {serviceName}
                                </DialogTitle>
                                <div className="flex items-center gap-2">
                                    {/* Share Button */}
                                    <button
                                        onClick={handleShare}
                                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        aria-label="اشتراک‌گذاری"
                                    >
                                        <HiShare className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    </button>
                                    {/* Close Button */}
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        aria-label="بستن"
                                    >
                                        <HiXMark className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                                <div className="w-full flex flex-col gap-6">
                                    {/* Image */}
                                    <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900">
                                        <Image
                                            src={featuredImage}
                                            alt={serviceName}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover"
                                            unoptimized={featuredImage.includes('.gif')}
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-4">
                                        {shortDescription && (
                                            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                                {shortDescription}
                                            </p>
                                        )}
                                        
                                        {/* Sub Services */}
                                        {service.subServices && service.subServices.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                                                    خدمات زیرمجموعه
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {service.subServices.map((subService, idx) => {
                                                        const subTitle = typeof subService.title === 'string'
                                                            ? subService.title
                                                            : (subService.title?.fa || subService.title?.en || "");
                                                        const iconSrc = subService.icon || "";
                                                        
                                                        return subTitle ? (
                                                            <div
                                                                key={idx}
                                                                className="group w-full rounded-lg flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 shadow-md hover:shadow-lg px-4 py-3 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-teal-50 dark:hover:bg-teal-900/20 border border-slate-200 dark:border-slate-600 hover:border-teal-300 dark:hover:border-teal-600 cursor-pointer"
                                                            >
                                                                {iconSrc && iconSrc.trim() ? (
                                                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center group-hover:bg-teal-100 dark:group-hover:bg-teal-800 transition-colors">
                                                                        <Image 
                                                                            src={iconSrc} 
                                                                            width={24} 
                                                                            height={24} 
                                                                            className="w-6 h-6 mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform" 
                                                                            alt={subTitle} 
                                                                            title={subTitle}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center group-hover:bg-teal-200 dark:group-hover:bg-teal-800 transition-colors">
                                                                        <span className="text-teal-600 dark:text-teal-400 text-lg">✨</span>
                                                                    </div>
                                                                )}
                                                                <span className="flex-1 text-sm md:text-base font-medium text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                                                                    {subTitle}
                                                                </span>
                                                            </div>
                                                        ) : null;
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Pricing Preview */}
                                        {service.pricing && service.pricing.packages && service.pricing.packages.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
                                                    قیمت‌ها از
                                                </h3>
                                                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                                                    {(() => {
                                                        const prices = service.pricing.packages
                                                            .map(pkg => {
                                                                const value = typeof pkg.value === 'string' 
                                                                    ? pkg.value 
                                                                    : (pkg.value?.fa || pkg.value?.en || String(pkg.value || "0"));
                                                                return parseInt(value.replace(/[^0-9]/g, '')) || 0;
                                                            })
                                                            .filter(p => p > 0);
                                                        return prices.length > 0 
                                                            ? `${Math.min(...prices).toLocaleString('fa-IR')} تومان`
                                                            : "تماس بگیرید";
                                                    })()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 md:p-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
                                <Link
                                    href={serviceUrl}
                                    onClick={onClose}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 text-white rounded-lg font-semibold transition-colors"
                                >
                                    <span>مطالعه کامل</span>
                                    <HiArrowLeft className="w-4 h-4" />
                                </Link>
                                <a
                                    href={`/#counseling?service=${serviceSlug}`}
                                    onClick={onClose}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 border-2 border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-lg font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                                >
                                    <HiPhone className="w-4 h-4" />
                                    <span>درخواست مشاوره</span>
                                </a>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}

