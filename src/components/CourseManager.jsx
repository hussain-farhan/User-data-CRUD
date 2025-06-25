    import React, { useEffect, useState } from 'react';
    import { useDispatch, useSelector } from 'react-redux';
    import axios from 'axios';
    import { fetchCourses, addCourse, registerCourse, withdrawCourse, updateCourse,deleteCourse } from '../features/users/courseSlice';
    import {TextField, Button, Typography, Box, Paper,Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material';



    export default function CourseManager({ currentUser,onCoursesUpdated }) {
    const dispatch = useDispatch();
    const { courses, status } = useSelector(s => s.courses);
    const [form, setForm] = useState({ title: '', description: '' });
    const [editingCourseId, setEditingCourseId] = useState(null);

    useEffect(() => {
        dispatch(fetchCourses());   
    }, [dispatch]);

    
    const isTeacher = currentUser?.role === 'teacher';
    const isStudent = currentUser?.role === 'student';

    console.log('CurrentUser:', currentUser);

    if (!currentUser?.id) {
        return <Typography color='error' sx={{ mt: 4 }}>Login required</Typography>;
    }

    // const handleAddOrUpdateCourse = (e) => {
    //     e.preventDefault();
    //     if(editingCourseId){
    
    //     dispatch(updateCourse({ ...form, id: editingCourseId, teacherId: currentUser.id }))
    //     .unwrap()
    //     .then(() => {
    //       setForm({ title: '', description: '' });
    //       setEditingCourseId(null);
    //       dispatch(fetchCourses());
    //     });
    // }else{
    //         dispatch(addCourse({ ...form, teacherId: currentUser.id }));
    //         setForm({ title: '', description: '' });
    //     }
    //     dispatch(addCourse({ ...form, teacherId: currentUser.id }));
    //     setForm({ title: '', description: '' });
    // };

    const handleAddOrUpdateCourse = async (e) => {
  e.preventDefault();

  try {
    if (editingCourseId) {
      await dispatch(updateCourse({ ...form, id: editingCourseId, title: form.title, description: form.description, teacherId: currentUser.id })).unwrap();
      setEditingCourseId(null);
    } else {
      await dispatch(addCourse({ ...form, teacherId: currentUser.id })).unwrap();
    }

    setForm({ title: '', description: '' });
    dispatch(fetchCourses());
  } catch (error) {
    console.error('Error while adding/updating course:', error);
    alert('Failed to add or update course. Please try again.');
  }
};


    const handleDeleteCourse = async (courseId) => {
       
    if (window.confirm('Are you sure you want to delete this course?')) {
     
        try{
             await dispatch(deleteCourse(courseId)).unwrap();
             dispatch(fetchCourses());
            }catch(err){
                 console.error('Delete failed:', err);
                   alert('Failed to delete course. ' + (err?.message || JSON.stringify(err)));
                }
             }
  };
    
    const handleRegister = async(cid) => {
        await dispatch(registerCourse({ courseId: cid, studentId: currentUser.id })).unwrap();
        await dispatch(fetchCourses()).unwrap();
        if(onCoursesUpdated){
            onCoursesUpdated();
        }  
    };

    const registeredCourseIds = courses
        .filter(c => c.studentIds?.includes(currentUser.id))
        .map(c => c.id);

   const handleEditCourseClick = (course) => {
    setEditingCourseId(course.id);
    setForm({ title: course.title, description: course.description });
  };

    
    
    const handleWithdraw = async (cid) => {
        try{
    await dispatch(withdrawCourse({ courseId: cid, studentId: currentUser.id })).unwrap();
    await dispatch(fetchCourses()).unwrap();
    if (onCoursesUpdated) {
        onCoursesUpdated();
    }
        }catch(err){
             alert(
      err?.message ||
      (err?.data && JSON.stringify(err.data)) ||
      JSON.stringify(err) ||
      'Withdraw failed'
    );
    console.error('Withdraw error:', err);
  }
};        

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
        {currentUser.role === 'teacher' && (
            <>
             <Typography variant="h5">{editingCourseId ? 'Update Course' : 'Add Course'}</Typography>
            <Box component="form" onSubmit={handleAddOrUpdateCourse} sx={{ mt: 2 }}>
                <TextField
                label="Course Title"
                fullWidth
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                sx={{ mb: 2 }}
                />
                <TextField
                label="Description"
                fullWidth
                multiline
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" color="primary">
                     {editingCourseId ? 'Update Course' : 'Add Course'}
               </Button>
               
               {editingCourseId && (
              <Button
                variant="text"
                color="secondary"
                onClick={() => {
                  setEditingCourseId(null);
                  setForm({ title: '', description: '' });
                }}
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            )}
          </Box>

          <Typography variant="h6" sx={{ mt: 4 }}>Your Courses</Typography>
          <Paper sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.filter((c) => c.teacherId === currentUser.id).map((course, i) => (
                  <TableRow key={i}>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditCourseClick(course)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                       <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        Delete
                      </Button>

                       </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}

        {currentUser.role === 'student' && (
            <>
            <Typography variant="h6" sx={{ mt: 4 }}>Available Courses</Typography>
            <Paper sx={{ mt: 2 }}>
                <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courses
                    .filter(c => c.teacherId !== currentUser.id && !registeredCourseIds.includes(c.id))
                    .map((c, i) => (
                        <TableRow key={i}>
                        <TableCell>{c.title}</TableCell>
                        <TableCell>{c.description}</TableCell>
                        <TableCell>
                            <Button variant="contained" onClick={() => handleRegister(c.id)}>
                            Register
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Paper>

            <Typography variant="h6" sx={{ mt: 4 }}>Your Registered Courses</Typography>
            <Paper sx={{ mt: 2 }}>
                <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courses
                    .filter(c => c.studentIds?.includes(currentUser.id))
                    .map((c, i) => (
                        <TableRow key={i}>
                        <TableCell>{c.title}</TableCell>
                        <TableCell>{c.description}</TableCell>
                        <TableCell>
                            <Button variant="outlined" color="error" onClick={() => handleWithdraw(c.id)}>
                                Withdraw
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Paper>
            </>
        )}
        </Box>
    );
    }
