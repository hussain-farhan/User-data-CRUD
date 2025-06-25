import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/users/userSlice';
import courseReducer from '../features/users/courseSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        courses: courseReducer
    },
    });

    export default store;