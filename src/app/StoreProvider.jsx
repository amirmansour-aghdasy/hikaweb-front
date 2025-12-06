"use client";

import { Provider } from "react-redux";
import { makeStore } from "../lib/store";

export default function StoreProvider({ children }) {
    const store = makeStore();

    return <Provider store={store}>{children}</Provider>;
}
