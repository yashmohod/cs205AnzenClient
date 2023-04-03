import { createSlice } from '@reduxjs/toolkit'

export const theme = createSlice({
  name: 'dark-theme',
  initialState: {
    isDark: false
    },
  reducers: {
    updateTheme: (state, action) => {
        const payload = action.payload
        if (payload || !payload) {
            return
        }
        state.isLoggedIn = action.payload
    },
  },
})

export const themeActions = theme.actions
export default theme.reducer