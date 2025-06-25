import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectCurrentUser } from '../features/users/userSlice';
import { useNavigate } from 'react-router-dom';
import {Card,TextField,CardContent,Typography,CircularProgress,Box,Avatar,Chip,Stack,Divider,Grid,Button,} from '@mui/material';
import CourseManager from '../components/CourseManager';

const StudentDashboard = () => {
  const currentUser = useSelector(selectCurrentUser);

  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchStudentData = useCallback(() => {
    if (currentUser?.id) {
      setLoading(true);
      setError(null);
      axios
        .get(`http://localhost:5000/student-data/${currentUser.id}`)
        .then((res) => {
          setData(res.data);
          setForm({
            name: res.data.studentName,
            email: res.data.email,
            phone: res.data.phone,
            role: res.data.role,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to fetch student data');
          setLoading(false);
        });
    }
  }, [currentUser]);

  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      fetchStudentData();
    }
  }, [currentUser, navigate, fetchStudentData]);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleEditToggle = () => setEditMode(!editMode);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/users/${currentUser.id}`, form)
      .then(() => {
        setEditMode(false);
        fetchStudentData();
      })
      .catch((err) => {
        console.error(err);
        alert('Update failed');
      });
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

 return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: '#2e7d32', width: 80, height: 80, mb: 1 }}>
                  <Typography variant="h4" color="white">
                    {form.name?.[0] || 'S'}
                  </Typography>
                </Avatar>
                <Typography variant="h5" fontWeight="bold">
                  {form.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {currentUser.id}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {!editMode ? (
                <Box>
                  <Typography variant="body2"><strong>Email:</strong> {form.email}</Typography>
                  <Typography variant="body2"><strong>Phone:</strong> {form.phone}</Typography>
                  <Typography variant="body2"><strong>Role:</strong> {form.role}</Typography>

                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={handleEditToggle}
                  >
                    Edit Profile
                  </Button> 
                </Box>
              ) : (
                <Box component="form" onSubmit={handleUpdateProfile}>
                  <TextField
                    label="Name"
                    fullWidth
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    label="Phone"
                    fullWidth
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    label="Role"
                    fullWidth
                    name="role"
                    value={form.role}
                    onChange={handleFormChange}
                    sx={{ mt: 1 }}
                  />
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button type="submit" variant="contained" color="primary">
                      Save
                    </Button>
                    <Button variant="outlined" onClick={handleEditToggle}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}

              <Box display="flex" justifyContent="center" mt={2}>
                <Button variant="outlined" color="error" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <CourseManager
            userRole="student"
            currentUser={currentUser}
            onCoursesUpdated={fetchStudentData}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;