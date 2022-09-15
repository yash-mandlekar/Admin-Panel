require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const errormiddleware = require("./middleware/error");

require("./config/database").databaseconnection();
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
app.use(require("cors")({ credentials: true, origin: process.env.FRONTEND_URL }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/user/", userRouter);
app.use("/", adminRouter);
app.use(errormiddleware);

app.listen(
  process.env.PORT,
  console.log(`Server started on port ${process.env.PORT}`)
);
