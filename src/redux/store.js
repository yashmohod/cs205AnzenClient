import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slices/user"
import themeReducer from "./slices/user"

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer
  },
})

