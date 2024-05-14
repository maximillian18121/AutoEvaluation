import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isLog : false,
}

const logSlice = createSlice({
    name:'log',
    initialState,
    reducers:{
        setIsLog:(state,{payload})=>{
            state.isLog = payload;
        }
    }
})

export const {setIsLog} = logSlice.actions;
export default logSlice.reducer;