"use client";

import { Provider } from "react-redux";

const ClientProvider = ({ children }) => {
    return <Provider>{children}</Provider>;
};

export default ClientProvider;
