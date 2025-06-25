import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Box,TextField,Button,Card,CardContent,Typography,Avatar,Divider,CircularProgress,} from '@mui/material';
import { selectCurrentUser, logout } from '../features/users/userSlice';
import CourseManager from '../components/CourseManager';
import { fetchCourses } from '../features/users/courseSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const { courses, status } = useSelector((state) => state.courses);
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', role: '' });
  const [editMode, setEditMode] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [teacherCourse, setTeacherCourses] = useState([]);
  const [editCourseId, setEditCourseId] = useState(null);
  const [editCourseForm, setEditCourseForm] = useState({name: "", description: "" });


  const fetchTeacherData = useCallback(() => {
     if (currentUser?.id) {
      setLoadingUser(true);
      axios
        .get(`http://localhost:5000/teacher-data/${currentUser.id}`)
        .then((res) => {
          const teacher = res.data;
          setForm({
            name: teacher.teacherName,
            email: teacher.email,
            phone: teacher.phone,
            role: teacher.role,
          });
          
          console.log(teacher);
        setTeacherCourses(teacher.courses || []);
        setLoadingUser(false);
        
        })
        .catch((err) => {
          console.error(err);
          setLoadingUser(false);
        });
    }
  }, [currentUser]);


 useEffect(() => {
    if (!currentUser){
       navigate('/login');
    }else {
      fetchTeacherData();
    }
  }, [currentUser, navigate, fetchTeacherData]);

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
        fetchTeacherData();
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to update teacher data');
      });
  };


 const handleEditCourseClick = (course) => {
  setEditCourseId(course.id);
  setEditCourseForm({ name: course.name, description: course.description });
  };

const handleEditCourseChange = (e) => {
  const { name, value } = e.target;
  setEditCourseForm((prev) => ({ ...prev, [name]: value }));
};

const handleUpdateCourse = async (courseId) => {
  try {
    await axios.put(`http://localhost:5000/courses/${courseId}`, editCourseForm);
    setEditCourseId(null);
    fetchTeacherData();
  } catch (err) {
    alert('Failed to update course');
  }
};

const handleDeleteCourse = async (courseId) => {
  if (!window.confirm('Are you sure you want to delete this course?')) return;
  try {
    await axios.delete(`http://localhost:5000/courses/${courseId}`);
    fetchTeacherData();
  } catch (err) {
    alert('Failed to delete course');
  }
};

  const teacherCourses = courses.filter(
    (course) => course.teacherId === currentUser?.id
  );

  if (loadingUser || status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

 
 return (
  <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
    <Card sx={{ width: 400, borderRadius: 3, boxShadow: 4 }}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: '#1976d2', width: 80, height: 80, mb: 1 }}>
            <Typography variant="h4" color="white">
              {form.name?.[0] || 'T'}
            </Typography>
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {form.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {currentUser?.id || 'Unknown'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {!editMode ? (
          <>
            <Typography variant="body1"><strong>Email:</strong> {form.email}</Typography>
            <Typography variant="body1"><strong>Phone:</strong> {form.phone}</Typography>
            <Typography variant="body1"><strong>Role:</strong> {form.role}</Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={handleEditToggle}>
              Edit Profile
            </Button>
          </>
        ) : (
          <Box component="form" onSubmit={handleUpdateProfile}>
            <TextField label="Name" fullWidth name="name" value={form.name} onChange={handleFormChange} sx={{ mt: 1 }} />
            <TextField label="Email" fullWidth name="email" value={form.email} onChange={handleFormChange} sx={{ mt: 1 }} />
            <TextField label="Phone" fullWidth name="phone" value={form.phone} onChange={handleFormChange} sx={{ mt: 1 }} />
            <TextField label="Role" fullWidth name="role" value={form.role} onChange={handleFormChange} sx={{ mt: 1 }} />
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button type="submit" variant="contained" color="primary">Save</Button>
              <Button variant="outlined" onClick={handleEditToggle}>Cancel</Button>
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

    <Box mt={4} width="80%">
      <Typography variant="h6" gutterBottom>Students Currently Enrolled 🥷</Typography>

      {teacherCourse.length > 0 ? (
        teacherCourse.map((course, index) => {
          const isEditing = editCourseId === course.id;
          return (
            <Card key={index} sx={{ mt: 2, p: 2 }}>
              {isEditing ? (
                <>
                  <TextField
                    label="Course Name"
                    name="name"
                    value={editCourseForm.name}
                    onChange={handleEditCourseChange}
                    sx={{ mb: 1 }}
                    fullWidth
                  />
                  <TextField
                    label="Description"
                    name="description"
                    value={editCourseForm.description}
                    onChange={handleEditCourseChange}
                    sx={{ mb: 1 }}
                    fullWidth
                  />
                  <Box display="flex" justifyContent="flex-end" mt={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateCourse(course.id)}
                      sx={{ mr: 1 }}
                    >
                      Save
                    </Button>
                    <Button variant="outlined" onClick={() => setEditCourseId(null)}>
                      Cancel
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="subtitle1" fontWeight="bold">{course.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{course.title}</Typography>
                  
                  <Typography mt={1} variant="body2" fontWeight="bold">Enrolled Students:</Typography>
                  {course.students?.length > 0 ? (
                    <ul style={{ paddingLeft: 20 }}>
                      {course.students.map((student, i) => (
                        <li key={i}>{student.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No students enrolled
                    </Typography>
                  )}

                </>
              )}
            </Card>
          );
        })
      ) : (
        <Typography color="text.secondary" mt={2}>
          No courses assigned
        </Typography>
      )}
    </Box>

    <Box mt={4} width="100%">
      <CourseManager userRole="teacher" currentUser={currentUser} onCoursesUpdated={fetchTeacherData} />
      
    </Box>

  </Box>
);
}

export default TeacherDashboard;  