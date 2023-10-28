import { createSlice } from '@reduxjs/toolkit'

const adminSlice = createSlice({
   name: 'admin',
   initialState: {
      keyAdminUpdated: false,
   },
   reducers: {
      updateAdmin: (state) => {
         state.keyAdminUpdated = !state.keyAdminUpdated
      },
   },
})

export const { updateAdmin } = adminSlice.actions

export default adminSlice.reducer
