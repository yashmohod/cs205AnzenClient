import { createSlice } from '@reduxjs/toolkit'

export const theme = createSlice({
  name: 'theme',
  initialState: {
    mode: ""
},
  reducers: {
    updateTheme: (state, action) => {
      state.mode = action.payload
    },
  },
})

export const themeActions = theme.actions
export default theme.reducer