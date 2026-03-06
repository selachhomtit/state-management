import { createSlice } from "@reduxjs/toolkit"

// Define a type or interface
export interface CounterState {
  value: number
}

// 1. define initialstate
const initialState: CounterState = {
  value: 0,
}
// 2.Define Reducer
export const counterReducer = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1
        },
        decrement: (state) => {
            state.value -= 1
        }
    }
}) 
    
// 3. Export the actions of the reducer
export const { increment, decrement } = counterReducer.actions
// 4. Export the reducer
export default counterReducer.reducer