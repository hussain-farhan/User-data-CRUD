import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/signup';
import LoginPage from './pages/login';
import UpdateUserPage from './pages/updateUser';
import DeleteUserPage from './pages/deleteUser';
import StudentDashboard from './pages/studentDashboard';
import TeacherDashboard from './pages/teachersDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/update-user" element={<UpdateUserPage />} />
        <Route path="/delete-user" element={<DeleteUserPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
}
export default App;