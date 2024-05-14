import {configureStore} from '@reduxjs/toolkit';
import logReducer from './feature/logSlice';

export const  store = configureStore({
    reducer:{
        logState:logReducer
    }
})