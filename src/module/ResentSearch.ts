import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState:any[] = []

export const ResentSlice = createSlice({
  name: "ResentSearch",
  initialState,
  reducers:{
    resentPush : (state, action: PayloadAction<string>) => {
      state.unshift(action.payload)
    },
    resentDelete : (state, action: PayloadAction<string>) => {
      return state.filter((state) => state !== action.payload)
    },
    resentAllDelete : (state) => {
      return state = []
    }
  }
})

export const { resentPush, resentDelete ,resentAllDelete } = ResentSlice.actions;
export default ResentSlice.reducer;