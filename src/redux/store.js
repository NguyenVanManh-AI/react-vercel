import { configureStore } from '@reduxjs/toolkit'
import adminSlice from './adminSlice'
import userSlice from './userSlice'
import bookingSlice from './bookingSlice'

const store = configureStore({
   reducer: {
      admin: adminSlice,
      user: userSlice,
      booking: bookingSlice,
   },
})

export default store
