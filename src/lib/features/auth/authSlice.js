import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    otp: "",
    step: 1,
    lastName: "",
    firstName: "",
    phoneNumber: "",
    isAuthOpen: false,
    registerType: null, //? Can be 'raw' or 'verify'
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsAuthOpen: (state, action) => {
            state.isAuthOpen = action.payload || !state.isAuthOpen;
        },
        setPhoneNumber: (state, action) => {
            state.phoneNumber = action.payload;
        },
        setRegisterType: (state, action) => {
            state.registerType = action.payload;
        },
        setOtp: (state, action) => {
            state.otp = action.payload;
        },
        setFirstName: (state, action) => {
            state.firstName = action.payload;
        },
        setLastName: (state, action) => {
            state.lastName = action.payload;
        },
    },
});

export const { setPhone, setRegisterType, setOtp, setName, setSurname, setIsAuthOpen } = authSlice.actions;
export default authSlice.reducer;
