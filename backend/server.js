const express = require('express');          // import express framework 
const app = express();                      // it is used to define the app and start the server
const bodyParser = require('body-parser'); // it is used to parse the request body
const cors = require('cors');             // it is used to enable CORS (Cross-Origin Resource Sharing) for the server
const fs = require('fs');                // it is used to read and write files

    

const PORT = 5000;
const DATA_FILE = 'user.json';

app.use(cors());
app.use(bodyParser.json()); // parsing the request body as JSON

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
    const {name,email,password, phone} = req.body; // destructuring the request body to get the name, email, password and phone
   
    if(!name || !email || !password || !phone) {
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
        phone
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
    const {name, email, password, phone} = req.body;
    
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});