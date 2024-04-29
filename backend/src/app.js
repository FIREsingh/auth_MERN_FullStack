import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "../src/routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";
import teacherRouter from "./routes/teacherRouter.js";
import dashboardRouter from "./routes/dashboardRouter.js";

const app = express();

app.use(express.static("build"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//router declarations
app.use("/api/v1/user", userRouter);
app.use("/api/v1/teacher", teacherRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/dashboard", dashboardRouter);

export { app };
