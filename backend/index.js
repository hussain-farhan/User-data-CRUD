    const express = require('express');          // import express framework  
    const app = express();                      // it is used to define the app and start the server
    const bodyParser = require('body-parser'); // it is used to parse the request body
    const cors = require('cors');             // it is used to enable CORS (Cross-Origin Resource Sharing) for the server
    const fs = require('fs');                // it is used to read and write files

        

    const PORT = 5000;
    const DATA_FILE = 'users.json';
    const COURSES_FILE = 'courses.json';

    app.use(cors());
    app.use(bodyParser.json()); // parsing the request body as JSON


    function readCourses() { // this is a helper function which reads the user data from the user.json file

        if(!fs.existsSync(COURSES_FILE)) {
            return [];
        }
            const data = fs.readFileSync(COURSES_FILE);
            return JSON.parse(data);

    }

    function writeCourses(data) { // this is a helper function which writes the user data to the user.json file
        fs.writeFileSync(COURSES_FILE, JSON.stringify(data, null, 2));
    }

    function readUser() { // this is a helper function which reads the user data from the user.json file

        if(!fs.existsSync(DATA_FILE)) {
            return [];
        }
            const data = fs.readFileSync(DATA_FILE);
            return JSON.parse(data);

    }

    function writeUser(data) { // this is a helper function which writes the user data to the user.json file
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    }

    app.post("/signup", (req, res) => { // signup endpoint to create a new user
        const {name,email,password, phone, role} = req.body; // destructuring the request body to get the name, email, password and phone
    
        if(!name || !email || !password || !phone || !role) {
            return res.status(400).json({message: "All fields are requires"});
        }
    
        let users = readUser(); // reading the user data from the user.json file

        const userExists = users.some(user => user.email === email); // checking if the user already exists in the user.json file
        if (userExists) { // if the user already exists, return an error response
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = {
            id: users.length + 1,
            name,   
            email,
            password,
            phone,
            role
        };

        users.push(newUser); // adding the new user to the user.json file
        writeUser(users); // writing the updated user data to the user.json file
        
        res.status(201).json({ message: "User created successfully", user: newUser }); // returning a success response with the new user data
    });

    app.post("/login", (req, res) => { // login endpoint to authenticate the user

        const { email, password } = req.body; // the request body will get the email and password
        const users = readUser(); // reading the user data from the user.json file

        const user = users.find(u => u.email === email && u.password === password); // finding the user in the user.json file

        if (user) {
            res.json({ message: "Login successful", user });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    });

    app.get("/users", (req,res) => { // endpoint to get all users
        const users = readUser(); // reading the user data from the user.json file
        res.json(users); // returning the user data as a JSON response
    })

    app.put("/users/:id", (req, res) => { // update a user
        const id = parseInt(req.params.id);
        const {name, email, password, phone, role} = req.body;
        
        let users = readUser(); 
        let user = users.find(u => u.id == id); // finding the user in the user.json file

        if(!user) {
            return res.status(404).json({message: "USer not found"});
        }
        
        const emailTaken = users.some(u => u.email === email && u.id !== id);
        if (emailTaken) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        if(name) user.name = name;
        if(email) user.email = email;
        if(phone) user.phone = phone;
        if(password) user.password = password;
        if(role) user.role = role;


        writeUser(users); // writing the updated user data to the user.json file
        res.json({message: "User updated successfully", user});
    });

    app.delete("/users/:id", (req,res) => { // delete a user
        const id = parseInt(req.params.id);
        let users = readUser();

        const index = users.findIndex(u => u.id == id);

        if(index === -1) {
            return res.status(404).json({ message: "User not found" });
        }

        const deletedUser = users.splice(index,1)[0]; // getting the user to be deleted
        writeUser(users); 

        res.json({ message: "User deleted successfully", deletedUser });
    });

    app.get("/student-data/:id", (req, res) => {

        const id = parseInt(req.params.id);
        const users = readUser();
        const student = users.find(u => u.id === id && u.role === "student");
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const courses = readCourses();
        const enrolledCourses = courses.filter(course => course.studentIds.includes(id));

        const enrolledCourse = enrolledCourses[0];

        const instructor = enrolledCourse
            ? users.find(u => u.id === enrolledCourse.teacherId)
            : null;

        const response = {
            studentName: student.name,
            email: student.email,
            phone: student.phone,
            role: student.role,
        course: enrolledCourse ? enrolledCourse.title : "Not Enrolled",
            instructorName: instructor ? instructor.name : "To be assigned"
        };

        res.json(response);
    });


    app.get("/teacher-data/:id", (req, res) => {
        const id = parseInt(req.params.id);
        const users = readUser();

        const teacher = users.find(u => u.id === id && u.role === "teacher");
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        const courses = readCourses();
        const teacherCourses = courses.filter(course => course.teacherId === teacher.id);

        const coureWithStudents = teacherCourses.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description,
            students: c.studentIds.map(sid => {
                const student = users.find(u => u.id === sid && u.role === "student");
                return student ? {id: student.id, name: student.name, email: student.email } : null;
            }).filter(Boolean)
        }));
        
console.log(coureWithStudents);
        const response = {
            teacherName: teacher.name,
            email: teacher.email,
            phone: teacher.phone,
            role: teacher.role,
            courses: coureWithStudents
        };

        res.json(response);
    });


    app.get('/courses', (req,res) => {
        const course = readCourses();
        if(course.length === 0){
            return res.status(404).json({message: "No Available Courses"});
        }
        res.json(course);
    });

    app.get('/courses/teacher/:id', (req, res) => {
    const { id } = req.params;
    const courses = readCourses();
    const filtered = courses.filter(c => c.teacherId == id);
    res.json(filtered);
    });

    app.get('/courses/student/:id', (req, res) => {
    const { id } = req.params;
    const courses = readCourses();
    const filtered = courses.filter(c => c.studentIds.includes(Number(id)));

    if(filtered.length === 0){
        return res.status(404).json({message: "No Course Registered"});
    }
    res.json(filtered);
    });

    app.post('/courses', (req, res) => {
        const {title, description, teacherId } = req.body;
        if(!title || !description || !teacherId) {
            return res.status(400).json({ error: 'title, description, and teacherId are required'});
        }
    const courses = readCourses();
    const newCourse = { id: Date.now(), title, description, teacherId, studentIds: [] };
    courses.push(newCourse);
    writeCourses(courses);

    res.status(201).json(newCourse);
    });

    app.post('/courses/register', (req, res) => {
    const { courseId, studentId } = req.body;

    if (!courseId || !studentId) {
        return res.status(400).json({ error: 'Course ID and Student ID required' });
    }

    const courses = readCourses();
    const course = courses.find(c => c.id === Number(courseId));

    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }

    if (!course.studentIds.includes(studentId)) {
        course.studentIds.push(studentId);
        writeCourses(courses);
    } else {
        return res.status(400).json({ error: 'Student already registered' });
    }
    
    res.status(200).json({ message: 'Student registered successfully', course });
    });

    app.post('/courses/withdraw', (req, res) => {
    const { courseId, studentId } = req.body;

    if (!courseId || !studentId) {
        return res.status(400).json({ error: 'Course ID and Student ID are required' });
    }

    const courses = readCourses();
    const course = courses.find(c => c.id === Number(courseId));

    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }

    const index = course.studentIds.indexOf(studentId);
    if (index === -1) {
        return res.status(400).json({ error: 'Student not enrolled in this course' });
    }

    course.studentIds.splice(index, 1); 
    writeCourses(courses); 

    res.status(200).json({ message: 'Student withdrawn successfully', course });
    });

    app.delete('/courses/:id', (req, res) => {
        const id = parseInt(req.params.id);
        let courses = readCourses();
        
        const index = courses.findIndex(c => c.id === id);
        if (index === -1) {
            return res.status(404).json({ message: "Course not found" });
        }

        const deletedCourse = courses.splice(index, 1)[0];
        writeCourses(courses);

        res.json({ message: "Course deleted successfully", deletedCourse });
    });

    app.put('/courses/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const { title, description, teacherId } = req.body;

        let courses = readCourses();
        let course = courses.find(c => c.id === id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (title) course.title = title;
        if (description) course.description = description;
        if (teacherId) course.teacherId = teacherId;

        writeCourses(courses);
        res.json({ message: "Course updated successfully", course });
    });

        

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });