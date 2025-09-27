import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOffCanvasVisible: false,
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setIsOffCanvasVisible: (state, action) => {
            state.isOffCanvasVisible = action.payload;
        },
    },
});

export const { setIsOffCanvasVisible } = appSlice.actions;
export default appSlice.reducer;