import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "User",
    initialState: {
        isLoggedIn: false,
        loggedInUser: null,
    },
    reducers: {
        setLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload
        }
    }
})


export const userSliceActions = userSlice.actions
export const userSliceReducers = userSlice.reducer