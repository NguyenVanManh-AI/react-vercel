import { createSlice } from '@reduxjs/toolkit'

const bookingSlice = createSlice({
   name: 'booking',
   initialState: {
      keyBookingUpdated: 1,
   },
   reducers: {
      changeBooking: (state) => {
         state.keyBookingUpdated += 1
      },
   },
})

export const { changeBooking } = bookingSlice.actions

export default bookingSlice.reducer
