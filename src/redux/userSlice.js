import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
   name: 'user',
   initialState: {
      keyUserUpdated: 1,
   },
   reducers: {
      updateUser: (state) => {
         state.keyUserUpdated += 1
      },
   },
})

export const { updateUser } = userSlice.actions

export default userSlice.reducer
