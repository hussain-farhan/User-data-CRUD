import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Typography, Box, TextField,Divider, Button, Paper, TableCell, TableRow, Table, TableHead, TableBody} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {fetchUsers, selectUserList, selectCurrentUser, deleteUser, setCurrentUser, logout} from '../features/users/userSlice';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector(selectUserList);
  const currentUser = useSelector(selectCurrentUser);
  const status = useSelector((state) => state.user.status);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
     dispatch(fetchUsers());

     const cookieUser = Cookies.get('user');
     if(cookieUser) {
      try{
        const parsedUser = JSON.parse(cookieUser);
        dispatch(setCurrentUser(parsedUser));
      }catch(err){
        console.error('Failed to parse the user cookie', err);
      }
     }
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {     
      const res = await axios.post('http://localhost:5000/login', loginForm);
      const user = res.data?.user;

      if(!user){
        throw new Error('Login Failed');
      }

      dispatch(setCurrentUser(user));

      Cookies.set('user', JSON.stringify(user), {expires: 7});
         
      
      if(user.role === 'student')
        navigate('/student-dashboard');
      else if(user.role === 'teacher')
        navigate('/teacher-dashboard');
      else 
      navigate('/');
     
    } catch (e) {
      alert('Login failed: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleDelete = (id) => dispatch(deleteUser(id));
  const handleUpdate = (user) => navigate('/update-user', { state: user });

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove('user');
    navigate('/login');
  };

return (
    <Box sx={{ maxWidth: 650, mx: 'auto', p: 3 }}>
      <Typography variant="h5">Login</Typography>
      <Box component="form" onSubmit={handleLogin}>
        <TextField
          fullWidth
          placeholder="Email"
          value={loginForm.email}
          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          placeholder="Password"
          type="password"
          value={loginForm.password}
          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          sx={{ mt: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>

      <Link to="/signup">Don't have an account? Sign up</Link>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => setShowUsers(!showUsers)}
        >
          {showUsers ? 'Hide Users' : 'Show Users'}
        </Button>
      </Box>

      {showUsers && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>
            All Users:
          </Typography>
          {status === 'loading' ? (
            <Typography>Loading users...</Typography>
          ) : (
            <Paper sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.phone}</TableCell>
                      <TableCell>{u.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}