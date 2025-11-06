"use client";

import { useEffect } from "react";

import clarity from "@microsoft/clarity";

export const ClarityTracker = () => {
    useEffect(() => {
        if (process.env.NODE_ENV === "production") {
            clarity.init("tu7fzvfypy");
        }
    }, []);

    return null;
};

export default ClarityTracker;
