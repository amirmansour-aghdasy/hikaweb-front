import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/auth/authSlice";
import appReducer from "./features/appSlice";

export const makeStore = () => {
    return configureStore({
        reducer: { auth: authReducer, app: appReducer },
    });
};
