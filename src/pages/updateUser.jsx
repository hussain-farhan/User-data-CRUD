import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUser } from '../features/users/userSlice';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';


const roles = ['student', 'teacher'];

export default function UpdateUserPage() {
  const { state: user } = useLocation();
  const [form, setForm] = useState(user || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!form?.id) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          Invalid User Data. Please go back and try again.
        </Typography>
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUser(form)).unwrap();
      navigate('/login');
    } catch (errorMessage) {
      alert('Update failed: ' + errorMessage);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" align="center">Update User</Typography>
      <Paper sx={{ p: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {['name', 'email', 'password', 'phone'].map((fld) => (
            <TextField
              key={fld}
              label={fld}
              fullWidth
              margin="normal"
              value={form[fld] || ''}
              onChange={(e) => setForm({ ...form, [fld]: e.target.value })}
            />
          ))}
          <FormControl fullWidth margin="normal">
  <InputLabel id="role-label">Role</InputLabel>
  <Select
    labelId="role-label"
    value={form.role || ''}
    label="Role"
    onChange={(e) => setForm({ ...form, role: e.target.value })}
  >
    {roles.map((role) => (
      <MenuItem key={role} value={role}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </MenuItem>
    ))}
  </Select>
</FormControl>
          <Button type="submit" variant="contained" fullWidth>
            Save
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
