const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
const adminRouter = require("./routes/adminRoutes");
const teacherRouter = require("./routes/taacherRoutes");
const studentRouter = require("./routes/studentRoutes");
const parentRouter = require("./routes/parentRoutes");
const classRouter = require("./routes/classRoutes");
const subjectRouter = require("./routes/subjectRoutes");
const assignmentRouter = require("./routes/assignmentRoutes");
const examController = require("./routes/examRoutes");
const feeController = require("./routes/feeRoutes");
const submitAssignmnet = require("./routes/sumbitAssignmentRoutes");
const eventRoutes = require("./routes/eventRoutes");
const AppError = require("./utils/AppErrorr");
const globalErrorHandler = require("./controllers/errController");
require("dotenv").config();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

//Routes
app.use("/api/v1/school", adminRouter);
app.use("/api/v1/school", teacherRouter);
app.use("/api/v1/school", studentRouter);
app.use("/api/v1/school", parentRouter);
app.use("/api/v1/school", classRouter);
app.use("/api/v1/school", subjectRouter);
app.use("/api/v1/school", assignmentRouter);
app.use("/api/v1/school", examController);
app.use("/api/v1/school", feeController);
app.use("/api/v1/school", submitAssignmnet);
app.use("/api/v1/school", eventRoutes);
//handel unHndeled Routes
app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this Server!`, 404));
});
//Global Error Handler
app.use(globalErrorHandler);
module.exports = app;
