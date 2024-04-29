import { Router } from "express";
import { checkRole, verifyJWT } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
  enrollUserInCourse,
  login,
  registerUser,
  updateUser,
} from "../controllers/userControllers.js";
import {
  getCoursePurchases,
  getAverageCoursePrice,
  getCoursesWithPurchaseCount,
  getCoursesSortedByPurchaseCount,
  getStudentsForCourse,
} from "../controllers/queryControllers.js";

const userRouter = Router();

userRouter.route("/register").post(upload.single("image"), registerUser);
userRouter.route("/login").post(login);
userRouter.route("/updateUser/:id").post(upload.single("image"), updateUser);
userRouter.route("/:userId/course/:courseId").post(enrollUserInCourse);

userRouter.get("/course-purchases", getCoursePurchases);
userRouter.get("/average-course-price", getAverageCoursePrice);
userRouter.get("/courses-with-purchase-count", getCoursesWithPurchaseCount);
userRouter.get(
  "/courses-sorted-by-purchase-count",
  getCoursesSortedByPurchaseCount
);
userRouter.get("/students-for-course/:courseId", getStudentsForCourse);

export default userRouter;
