import { createSlice } from '@reduxjs/toolkit'

export const user = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    metadata: null,
},
  reducers: {
    updateLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload
    },
    updateUserMetadata: (state, action) => {
      state.metadata = action.payload
    },
  },
})


export const userActions = user.actions
export default user.reducer