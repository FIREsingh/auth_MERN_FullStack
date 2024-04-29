import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware.js";

import {
  averageSalary,
  averageSalaryAll,
  uploadCSV,
} from "../controllers/queryControllers.js";

const dashboardRouter = Router();

dashboardRouter.route("/averageSalary/:empId").get(averageSalary);
dashboardRouter.route("/averageSalaryAll").get(averageSalaryAll);
dashboardRouter.route("/uploadCSV").post(upload.single("csvFile"), uploadCSV);

// dashboardRouter.route("/averageSalary").get(() => console.log("ok"));

export default dashboardRouter;
