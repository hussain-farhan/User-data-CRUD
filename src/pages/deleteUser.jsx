
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteUser } from '../features/users/userSlice';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';

export default function DeleteUserPage() {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState('');
  const [msg, setMsg] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();

    if(!userId) {
        console.error('User ID is undefined');
        return;
    }
    
    try {
      await dispatch(deleteUser(Number(userId))).unwrap();
      setMsg('Deleted successfully!');
      setUserId('');
    } catch (e) {
      setMsg('Delete failed: ' + e.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" align="center">Delete User</Typography>
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleDelete}>
          <TextField
            label="User ID"
            fullWidth
            value={userId}
            onChange={e => setUserId(e.target.value)}
            type="number"
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" color="error" fullWidth>
            Delete
            </Button>
            </form>

        {msg && <Typography sx={{ mt: 2 }} color={msg.includes('successfully') ? 'green' : 'error'}>
            {msg}
            </Typography>}
            
      </Paper>
    </Box>
  );
}
