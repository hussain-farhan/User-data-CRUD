import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";

const TopNavBar = () => {
  return (
    <AppBar position="static" sx={{ 
      backgroundColor: '#1a3e1a',
      boxShadow: 1 
    }}>
      <Toolbar>
        <Typography variant="h6" sx={{ 
          flexGrow: 1, 
          fontWeight: 'bold', 
          color: '#ffffff'
        }}>
            Training Session
        </Typography>
        <Button color="inherit" component={Link} to="/" sx={{ color: '#ffffff' }}>Home</Button>
        
        <Button 
           color="inherit"
           component={Link}
           to="/about"
           sx={{ color: '#ffffff' }}
        >
            About
            
        </Button>     
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;