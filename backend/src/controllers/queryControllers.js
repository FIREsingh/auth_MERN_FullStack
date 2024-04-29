import { sqlDB } from "../config/dbConnection.js";
import { Course } from "../models/courseModel.js";
import fs from "fs";
import mysql from "mysql2";
import multer from "multer";
import csvParser from "csv-parser";

//=========== Get the total number of purchases for each course =============
const getCoursePurchases = async (req, res) => {
  try {
    const coursePurchases = await Purchase.aggregate([
      {
        $group: {
          _id: "$courseId",
          totalPurchases: { $sum: 1 },
        },
      },
    ]);
    res.json(coursePurchases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAverageCoursePrice = async (req, res) => {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getCoursesWithPurchaseCount = async (req, res) => {
  try {
    const coursesWithPurchaseCount = await Course.aggregate([
      {
        $lookup: {
          from: "purchases",
          localField: "_id",
          foreignField: "courseId",
          as: "purchases",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          price: 1,
          purchaseCount: { $size: "$purchases" },
        },
      },
    ]);
    res.json(coursesWithPurchaseCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getCoursesSortedByPurchaseCount = async (req, res) => {
  try {
    const coursesSortedByPurchaseCount = await Course.aggregate([
      {
        $lookup: {
          from: "purchases",
          localField: "_id",
          foreignField: "courseId",
          as: "purchases",
        },
      },
      {
        $addFields: {
          purchaseCount: { $size: "$purchases" },
        },
      },
      {
        $sort: { purchaseCount: -1 },
      },
    ]);
    res.json(coursesSortedByPurchaseCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getStudentsForCourse = async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const studentsForCourse = await Purchase.aggregate([
      {
        $match: { courseId: mongoose.Types.ObjectId(courseId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $unwind: "$student",
      },
      {
        $project: {
          _id: "$student._id",
          username: "$student.username",
          email: "$student.email",
        },
      },
    ]);
    res.json(studentsForCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
//=========== Get the average salary for each employee =============
const averageSalary = async (req, res) => {
  try {
    const { empId } = req.params;

    if (!empId) {
      return res.status(400).send("Please provide an employee ID");
    }
    const [salaryResults] = await sqlDB
      .promise()
      .query(
        "SELECT AVG(salary) as averageSalary FROM salaryTable WHERE empId = ?",
        [empId]
      );

    const averageSalary = salaryResults[0].averageSalary;

    res.json({ empId, averageSalary });
  } catch (error) {
    console.error("Error fetching average salary:", error);
    res.status(500).send("An error occurred while fetching average salary.");
  }
};

//=========== Get the average salary for ALl employee =============
const averageSalaryAll = async (req, res) => {
  try {
    const [avgSalaryResults] = await sqlDB
      .promise()
      .query(
        "SELECT st.empId,name,AVG(salary) as averageSalary FROM salaryTable as st join myEmpTable as et on st.empId = et.empId group by st.empId "
      );

    res.json({ avgSalaryResults });
  } catch (error) {
    console.error("Error fetching average salary:", error);
    res.status(500).send("An error occurred while fetching average salary.");
  }
};

//======================== upload CSV ============================
const upload = multer({ dest: "./public/temp" });
const uploadCSV = async (req, res) => {
  console.log("entered");
  try {
    // Check if file is provided

    console.log("OK");

    const filePath = req.file?.path;

    // Parse CSV file
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => {
        console.log("row is", data);
        // Parse empId as integer
        const empId = parseInt(data.empId);
        // Check if empId is a valid integer
        if (isNaN(empId)) {
          console.error("Invalid empId:", data.empId);
          return; // Skip this row if empId is not a valid integer
        }
        // Convert salary to float
        if (data.salary !== undefined) {
          data.salary = parseFloat(data.salary);
        }
        // Convert month to integer
        if (data.month !== undefined) {
          data.month = parseInt(data.month);
        }
        results.push({ ...data, empId });
      })
      .on("end", async () => {
        for (const data of results) {
          console.log("Processing row:", data);
          const empId = data.empId;
          const name = data.name;
          console.log("empId:", empId);
          console.log("name:", name);
          const salary = data.salary;
          const month = data.month;

          // Check if empId is present and not NULL
          if (!empId) {
            console.error("empId is missing or NULL for a row:", data);
            continue; // Skip this row and move to the next one
          }

          // Check if empId already exists in myEmpTable
          const [empResults] = await sqlDB
            .promise()
            .query("SELECT * FROM myEmpTable WHERE empId = ?", [empId]);

          if (empResults.length > 0) {
            // Employee already exists, get the current maximum month from salaryTable
            const [currentMonthRow] = await sqlDB
              .promise()
              .query(
                "SELECT MAX(month) as maxMonth FROM salaryTable WHERE empId = ?",
                [empId]
              );

            let currentMonth = 1;
            if (currentMonthRow[0].maxMonth) {
              currentMonth = currentMonthRow[0].maxMonth + 1;
            }

            // Insert data into salaryTable with incremented month
            await sqlDB
              .promise()
              .query(
                "INSERT INTO salaryTable (empId, salary, month) VALUES (?, ?, ?)",
                [empId, salary, currentMonth]
              );
          } else {
            // Employee doesn't exist, insert into myEmpTable
            await sqlDB
              .promise()
              .query("INSERT INTO myEmpTable (empId, name) VALUES (?, ?)", [
                empId,
                name,
              ]);

            // Insert into salaryTable with month = 1
            await sqlDB
              .promise()
              .query(
                "INSERT INTO salaryTable (empId, salary, month) VALUES (?, ?, ?)",
                [empId, salary, 1]
              );
          }
        }

        // Delete uploaded file after processing
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting uploaded file: " + err);
          } else {
            console.log("Uploaded file deleted successfully");
          }
        });

        // Send response after processing all rows and deleting the file
        res.send("Data inserted successfully");
      });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send("An error occurred while processing the file.");
  }
};

export {
  getCoursePurchases,
  getAverageCoursePrice,
  getCoursesWithPurchaseCount,
  getCoursesSortedByPurchaseCount,
  getStudentsForCourse,
  uploadCSV,
  averageSalary,
  averageSalaryAll,
};
