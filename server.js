// imports
const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors');
const fileUploader = require("express-fileupload");
const { database } = require("./utils");
const path = require('path');

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

// Env varaibles
dotenv.config("./.env");

const PORT = process
  .env.PORT || 3000;
const FRONTEND_URL = process
  .env.FRONTEND_URL || "http://localhost:3000";
const DATABASE_URL = process
  .env.DATABASE_URL || "mongodb://localhost:27017/test";

// Express Settings
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(fileUploader());
app.use(cors({
  origin: FRONTEND_URL,
  methods: "*",
}));

// connect to database
database(DATABASE_URL);

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);

// on wrong url
app.use("*", (req, res) => {
  res.status(404).json("Failed to access the url!")
});

// Server Listener
app.listen(PORT, () => {
  console.log(`--- Server is listening on port ${PORT}`)
});