require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Connect to MongoDB Atlas
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const errormiddleware = require("./middleware/error");
const path = require("path");
require("./config/database").databaseconnection();
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
app.use(
  require("cors")({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/user/", userRouter);
app.use("/", adminRouter);
app.use(errormiddleware);

app.listen(
  process.env.PORT,
  console.log(`Server started on port ${process.env.PORT}`)
);
