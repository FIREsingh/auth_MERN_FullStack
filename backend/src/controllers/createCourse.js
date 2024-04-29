import { Course } from "../models/courseModel.js";

const createCourse = async (req, res) => {
  try {
    const { title, description, price, teacher } = req.body;

    const newCourse = new Course({
      title,
      description,
      price,
      teacher,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).json({ error: "Failed to create course" });
  }
};

export { createCourse };
