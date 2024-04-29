import { Course } from "../models/courseModel.js";
import { User } from "../models/userModal.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const adminDashboard = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(409, "User don't exists");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, user, "user data fetched successfully"));
};

//================= Calculate Average Price of Courses =================

const averageCoursePrice = async (req, res) => {
  try {
    const averagePrice = await Course.aggregate([
      {
        $group: {
          _id: null,
          averagePrice: { $avg: "$price" },
        },
      },
    ]);
    res.json(averagePrice);
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate average price" });
  }
};

const countCoursesPerTeacher = async (req, res) => {
  try {
    const coursesPerTeacher = await Course.aggregate([
      {
        $group: {
          _id: "$teacher",
          totalCourses: { $sum: 1 },
        },
      },
    ]);
    res.json(coursesPerTeacher);
  } catch (error) {
    res.status(500).json({ error: "Failed to count courses per teacher" });
  }
};

const expensiveCourses = async (req, res) => {
  try {
    const priceThreshold = req.params.priceThreshold; // Assuming price threshold is passed as a parameter
    const expensiveCourses = await Course.aggregate([
      {
        $match: {
          price: { $gt: parseInt(priceThreshold) },
        },
      },
    ]);
    res.json(expensiveCourses);
  } catch (error) {
    res.status(500).json({ error: "Failed to find expensive courses" });
  }
};

const topEnrolledCourses = async (req, res) => {
  try {
    const topEnrolledCourses = await Course.aggregate([
      {
        $project: {
          title: 1,
          numStudentsEnrolled: { $size: "$studentsEnrolled" },
        },
      },
      {
        $sort: { numStudentsEnrolled: -1 },
      },
      {
        $limit: 5,
      },
    ]);
    res.json(topEnrolledCourses);
  } catch (error) {
    res.status(500).json({ error: "Failed to get top enrolled courses" });
  }
};

const aggregateCourseAndEnrollment = async (req, res) => {
  try {
    const result = await Course.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "teacher",
          foreignField: "_id",
          as: "teacherInfo",
        },
      },
      {
        $unwind: "$teacherInfo",
      },
      {
        $lookup: {
          from: "users",
          localField: "studentsEnrolled",
          foreignField: "_id",
          as: "studentsInfo",
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          description: { $first: "$description" },
          price: { $first: "$price" },
          teacher: { $first: "$teacherInfo" },
          studentsEnrolled: { $push: "$studentsInfo" },
        },
      },
    ]);

    // Populate teacher and studentsEnrolled fields with user information
    await Course.populate(result, { path: "teacher", model: "User" });
    await Course.populate(result, { path: "studentsEnrolled", model: "User" });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Aggregation failed" });
  }
};

export {
  averageCoursePrice,
  countCoursesPerTeacher,
  expensiveCourses,
  adminDashboard,
  topEnrolledCourses,
  aggregateCourseAndEnrollment,
};
