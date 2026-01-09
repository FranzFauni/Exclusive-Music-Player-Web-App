const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ContactForm')
const db = mongoose.connection
db.once('open', () => {
    console.log("Database is now connected YIPPIE")
})

// MongoDB schema for the form
const formSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
})
const User = mongoose.model("User", formSchema)

// Posting the data from the contact form
app.post("/post", async (req, res) => {
    const { name, email, subject, message } = req.body
    const user = new User({
        name,
        email,
        subject,
        message
    })
    await user.save()
    console.log(user)
    res.send("Message successfully sent")
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
