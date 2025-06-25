
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl ='http://localhost:5000';

export const fetchCourses = createAsyncThunk("courses/fetchCourses", async () => {
  const res = await axios.get(`${backendUrl}/courses`);
  return res.data;
});

export const addCourse = createAsyncThunk("courses/addCourse", async ({title, description,teacherId}) => {
  console.log(teacherId);

  const res = await axios.post(`${backendUrl}/courses`,{title, description,teacherId});
  return res.data;
});

export const registerCourse = createAsyncThunk('courses/registerCourse', async ({ courseId, studentId }) => {
  const res = await axios.post(`${backendUrl}/courses/register`, { courseId, studentId });
  return res.data.course;
});

export const withdrawCourse = createAsyncThunk('courses/withdraw', async ({courseId, studentId}) => {
  const res = await axios.post(`${backendUrl}/courses/withdraw`, {courseId, studentId});
  return res.data;
});

export const updateCourse = createAsyncThunk('courses/updateCourse', async ({id, title, description,teacherId}) => {
    const res = await axios.put(`${backendUrl}/courses/${id}`, { title, description,teacherId });
    return res.data;
  }
);

export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (courseId) => {
    await axios.delete(`${backendUrl}/courses/${courseId}`);
    return courseId;
  }
);



const courseSlice = createSlice({
  name: "courses",
  initialState: { courses: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.status = "succeeded";
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
        const idx = state.courses.findIndex(c => c.id === action.payload.id);
        if(idx !== -1){
          state.courses[idx] = action.payload;
        }
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
          const idx = state.courses.findIndex(course => course.id === action.payload.id);
          if (idx !== -1) {
          state.courses[idx] = action.payload;
        }
      })

      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(course => course.id !== action.payload);
      })

  },
});

export default courseSlice.reducer;



