"use client";

import { useEffect } from "react";

import Aos from "aos";
import { Provider } from "react-redux";
import { makeStore } from "../lib/store";

export default function StoreProvider({ children }) {
    // const storeRef = useRef();
    // if (!storeRef.current) {
    //     // Create the store instance the first time this renders
    //     storeRef.current = makeStore();
    // }

    const store = makeStore();

    useEffect(() => {
        Aos.init({
            duration: 1500,
            once: false,
        });
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
