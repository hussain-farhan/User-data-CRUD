// import React, { useState, useEffect } from 'react';

// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const username = e.target.username.value;
//     const password = e.target.password.value;

//     if (username === "admin" && password === "password") {
//       navigate("/home"); 
//     } else if(username === "play" && password === "chess"){
//       navigate("/tic-tac-toe"); 
//     }else{
//       setError("Invalid credentials");
//     }
//   };

//   return (
//     <div style={{
//       fontFamily: "Arial, sans-serif", background: "#eddada", height: "100vh"
//     }}>
//       <div className="login-container" style={{
//         width: 300, margin: "100px auto", padding: 20,
//         background: "#e4d9d9", borderRadius: 8, boxShadow: "0 2px 8px #ccc"
//       }}>
//         <h2 style={{ textAlign: "center" }}>Welcome To Login</h2>
//         <form id="loginForm" onSubmit={handleSubmit}>
//           <input type="text" name="username" placeholder="Username" required style={{
//             width: "100%", padding: 10, margin: "8px 0",
//             border: "1px solid #846969", borderRadius: 4
//           }} />
//           <input type="password" name="password" placeholder="Password" required style={{
//             width: "100%", padding: 10, margin: "8px 0",
//             border: "1px solid #846969", borderRadius: 4
//           }} />
//           <button type="submit" style={{
//             width: "100%", padding: 10, background: "#007bff",
//             color: "#fff", border: "none", borderRadius: 4, cursor: "pointer"
//           }}>Login</button>
//           {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import TopNavBar from './components/navbar';
// import HomePage from './pages/home';
// import LoginPage from './pages/login';
// import GamePage from './pages/tic-tac-toe'; 

// function App() {
//   return (
//     <Router>
//       <TopNavBar />
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/home" element={<HomePage />} />
//         <Route path ="/tic-tac-toe" element={<GamePage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Typography, Box, TextField, Button, Paper, TableCell, TableRow, Table, TableHead, TableBody} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {fetchUsers, selectUserList, selectCurrentUser, deleteUser, setCurrentUser, logout} from '../features/users/userSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector(selectUserList);
  const currentUser = useSelector(selectCurrentUser);
  const status = useSelector((state) => state.user.status);

  const [loginForm, setLoginForm] = React.useState({ email: '', password: '' });

  useEffect(() => {
    if (currentUser) dispatch(fetchUsers());
  }, [currentUser, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', loginForm);
      if (!res.data?.user) throw new Error('No user returned');
      dispatch(setCurrentUser(res.data.user));
    } catch (e) {
      alert('Login failed: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleDelete = (id) => dispatch(deleteUser(id));
  const handleUpdate = (user) => navigate('/update-user', { state: user });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ maxWidth: 650, mx: 'auto', p: 3 }}>
      {!currentUser ? (
        <>
          <Typography variant="h5">Login</Typography>
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth placeholder="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              sx={{ mt:2 }}
            />
            <TextField
              fullWidth placeholder="Password" type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              sx={{ mt:2 }}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt:2 }}>Login</Button>
          </Box>
          <Link to="/signup">Don't have an account? Sign up</Link>
        </>
      ) : (
        <>
          <Typography>Logged in as: {currentUser.name} ({currentUser.email})</Typography>
          {status === 'loading' && <Typography>Loading users...</Typography>}
          <Paper sx={{ mt:2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Phone</TableCell><TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phone}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleUpdate(u)}>Edit</Button>
                      <Button disabled={u.id === currentUser.id} onClick={() => handleDelete(u.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Button fullWidth variant="outlined" color="error"  sx={{ mt:2 }} onClick={handleLogout}>Logout</Button>
        </>
      )}
    </Box>
  );
}
