"use client";

import { useState } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";

const GalleryLightbox = ({ images, initialIndex = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    if (!images || images.length === 0) {
        return null;
    }

    const openLightbox = (index) => {
        setCurrentIndex(index);
        setIsOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setIsOpen(false);
        document.body.style.overflow = "unset";
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
    };

    const currentImage = images[currentIndex];

    return (
        <>
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => openLightbox(index)}
                    >
                        <Image
                            src={image.url || image.imageSrc || image}
                            alt={image.alt?.fa || image.alt || image.title || `تصویر ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                    onKeyDown={handleKeyDown}
                    tabIndex={-1}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 z-10 text-white hover:text-teal-400 transition-colors p-2"
                        aria-label="بستن"
                    >
                        <XMarkIcon className="w-8 h-8" />
                    </button>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-teal-400 transition-colors p-2 bg-black/50 rounded-full"
                                aria-label="تصویر قبلی"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-teal-400 transition-colors p-2 bg-black/50 rounded-full"
                                aria-label="تصویر بعدی"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Main Image */}
                    <div
                        className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={currentImage.url || currentImage.imageSrc || currentImage}
                            alt={currentImage.alt?.fa || currentImage.alt || currentImage.title || `تصویر ${currentIndex + 1}`}
                            width={1200}
                            height={800}
                            className="max-w-full max-h-full object-contain rounded-lg"
                            priority
                        />

                        {/* Image Info */}
                        {(currentImage.title || currentImage.caption) && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
                                {currentImage.title?.fa || currentImage.title || currentImage.caption?.fa || currentImage.caption}
                            </div>
                        )}

                        {/* Image Counter */}
                        {images.length > 1 && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
                                {currentIndex + 1} / {images.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default GalleryLightbox;

