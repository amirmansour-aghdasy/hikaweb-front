"use client";

import dynamic from "next/dynamic";

// Dynamic import for map component (client-side only)
const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-72 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse flex items-center justify-center">
            <p className="text-slate-500">در حال بارگذاری نقشه...</p>
        </div>
    )
});

export default function MapWrapper() {
    return <InteractiveMap />;
}

