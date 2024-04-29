import { Router } from "express";
import { checkRole, verifyJWT } from "../middlewares/authMiddleware.js";
import { createCourse } from "../controllers/createCourse.js";

const teacherRouter = Router();

teacherRouter.route("/createCourse").post(createCourse);

export default teacherRouter;
