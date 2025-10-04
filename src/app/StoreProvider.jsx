"use client";

import { useEffect } from "react";

import Aos from "aos";
import { Provider } from "react-redux";
import { makeStore } from "../lib/store";

export default function StoreProvider({ children }) {
    const store = makeStore();

    useEffect(() => {
        Aos.init({
            duration: 1700,
            once: true,
        });
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
