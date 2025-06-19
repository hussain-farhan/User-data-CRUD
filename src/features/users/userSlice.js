import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { createSelector } from 'reselect';

const backendUrl ='http://localhost:5000';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const res = await axios.get(`${backendUrl}/users`);
    return res.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
    await axios.delete(`${backendUrl}/users/${id}`);
    return id; 
});

// export const updateUser = createAsyncThunk('users/updateUser', async (user) => {
//     const res = await axios.put(`${backendUrl}/users/${user.id}`, user);
//     return res.data;
// });

export const updateUser = createAsyncThunk('users/updateUser', async (user, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${backendUrl}/users/${user.id}`, user);
    return res.data;
  } catch (err) {
    // Return error from backend if exists
    return rejectWithValue(err.response?.data?.message || 'Failed to update user');
  }
});

const userSlice = createSlice({
    name: 'users',
    initialState:{
       list: [],
       status: 'idle',  
         error: null,
         currentUser:null, 
    },

    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
            state.list = [];
            state.status = 'idle';
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

        .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {   
        const idx = state.list.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },

});

export const { setCurrentUser, logout } = userSlice.actions;

// Selector for user list and current user
export const selectUserList = createSelector(
  (state) => state.user,
  (usr) => usr.list
);
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectStatus = (state) => state.user.status;
export const selectError = (state) => state.user.error;

export default userSlice.reducer;


