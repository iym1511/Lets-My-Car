import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState:string[] = []

export const ResentSlice = createSlice({
  name: "ResentSearch",
  initialState,
  reducers:{
    resentPush : (state, action: PayloadAction<string>) => {
      const searchTag = state.includes(action.payload)
      if(searchTag){
        const filteredState = state.filter((state) => state !== action.payload);
        return [action.payload, ...filteredState];
      }else if(action.payload == ""){
        // 히스토리를 눌렀을때 값이 안들어가게 하기위한 else if
      }else{
        state.unshift(action.payload);
      }
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