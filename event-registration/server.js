const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'nirvana_secret_key',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static("public"));

// Routes
const eventRoutes = require("./routes/eventRoutes");
app.use("/", eventRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Server
app.listen(3000, () => {
    console.log("Server running on https://event-registration-3-vmdk.onrender.com");
});