import { configureStore } from '@reduxjs/toolkit'
import { userSliceReducers } from './user'

export default configureStore({
  reducer: {
    user: userSliceReducers
  },
})