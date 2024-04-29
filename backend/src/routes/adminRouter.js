import { Router } from "express";
import { checkRole, verifyJWT } from "../middlewares/authMiddleware.js";
import {
  adminDashboard,
  aggregateCourseAndEnrollment,
  averageCoursePrice,
  countCoursesPerTeacher,
  expensiveCourses,
  topEnrolledCourses,
} from "../controllers/adminControllers.js";

const adminRouter = Router();

adminRouter
  .route("/adminDashboard")
  .get(verifyJWT, checkRole(["admin"]), adminDashboard);
adminRouter
  .route("/averageCoursePrice")
  .get(verifyJWT, checkRole(["admin"]), averageCoursePrice);
adminRouter
  .route("/countCoursesPerTeacher")
  .get(verifyJWT, checkRole(["admin"]), countCoursesPerTeacher);
adminRouter
  .route("/expensiveCourses")
  .get(verifyJWT, checkRole(["admin"]), expensiveCourses);
adminRouter
  .route("/topEnrolledCourses")
  .get(verifyJWT, checkRole(["admin"]), topEnrolledCourses);
adminRouter
  .route("/aggregateCourseAndEnrollment")
  .get(verifyJWT, checkRole(["admin"]), aggregateCourseAndEnrollment);

export default adminRouter;
