import React,{useState,useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Typography, Box, TextField, Button, Paper, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import userReducer from '../features/users/userSlice';


const SignupPage = () => {


    const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "" }); // state to hold the form data
     const [successMessage, setSuccessMessage] = useState(""); // state to hold the success message
     const [error, setError] = useState(""); // state to hold the error message

      const navigate = useNavigate(); // using useNavigate hook to navigate to different pages
       
       const backendUrl = "http://localhost:5000"; // backend URL

       const handleSignup = async (e) => {
      e.preventDefault(); // preventing the default form submission behavior
         
            if(!form.name || !form.email || !form.password || !form.phone) {
           setError("All fields are required!"); // checking if all fields are filled
              return; // returning if any field is empty
            }
            
            try{
           await axios.post(`${backendUrl}/signup`,form); // sending the signup request to the backend
           setSuccessMessage("Sign up successful!"); // alerting the user that the signup was successful
           setError(""); // resetting the error message
           setForm({name: "", email: "", password: "", phone: "",role: ""}); // resetting the form
           navigate("/login"); // navigating to the login page after successful signup
         }
         catch(e) {
           setError("Error signing up: " + (e.response.data.message || e.message)); // alerting the user that there was an error signing up
           setSuccessMessage(""); // resetting the success message
         
        }
       };
       const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

       return (
       <Box sx={{ height: '100vh', background: 'linear-gradient(to right, #fbeec1, #e0c097)',display: 'flex',flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
           outline: '1px solid black',
          justifyContent: 'center',
          alignItems: 'center',
         
          flex: 1, // To make the form center vertically
        }}
      >
        <Paper elevation={2} sx={{ padding: 2, width: 400, borderRadius: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            User Signup
          </Typography>
          <form onSubmit={handleSignup}>
            <TextField
            name="name"
              label="Name"
              fullWidth
              margin="normal"
              value={form.name}
              onChange={handleChange}
              required
            />
            <TextField
                name="phone"
              label="Phone Number"
              type="tel"
              fullWidth
              margin="normal"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <TextField
                name="email"
              label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={form.email}
                onChange={handleChange}
                required    
            />
            <TextField  
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={form.password}
                onChange={handleChange}
                required    
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={form.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
              </Select>
            </FormControl>
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            {successMessage && (
              <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
                {successMessage}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                backgroundColor: '#a47148',
                '&:hover': { backgroundColor: '#8a5a3c' },
              }}
            >
              Sign Up    
            </Button>
            <h3 style={{textAlign: 'center'}}>OR</h3>

          <Button 
          variant="contained"
           color="primary"
            fullWidth 
            sx={{ mt: 0 }} 
      onClick={() => navigate('/login')} 
      >
        Login
        </Button>
        <h3 style={{textAlign: 'center'}}>If you Already have an account</h3>

          </form>
          
        </Paper>
      </Box>
    </Box>
  );

};
export default SignupPage;