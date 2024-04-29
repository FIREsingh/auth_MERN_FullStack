import { User } from "../models/userModal.js";
import { Course } from "../models/courseModel.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//==================== register the user ======================
const registerUser = async (req, res) => {
  //data from req.body
  const { username, email, password, role, image } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }
  //if user's email already exists then out.
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User whith this mail already exists");
  }
  //multer will give us access of .files inside it different different key value pairs

  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image file required (localPath)");
  }
  //create user in database before it do cloudnary stuff
  const cloudinaryUrl = await uploadOnCloudinary(imageLocalPath);
  if (!cloudinaryUrl) {
    throw new ApiError(400, "Image file required (cloudinary path) ");
  }
  //create user in database
  const user = await User.create({
    email,
    password,
    username: username.toLowerCase(),
    role,
    image: cloudinaryUrl,
  });
  //new user data has been saved in database
  //now send user data on response and remove the password from it.
  user.password = undefined;

  return res
    .status(201)
    .json(new ApiResponse(200, user, "User registered successfully"));
};

//==================== login ====================
const login = async (req, res) => {
  //user data from request body
  const { email, password } = req.body;

  //validate
  if (!email || !password) {
    throw new ApiError(400, "user password and email are required");
  }

  //check user exists or not in database
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  //now we know user exists, do password validation
  const passwordIsValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!passwordIsValid) {
    throw new ApiError(401, "Password is wrong");
  }

  //password is valid, now create a JWT
  const token = await jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );

  //fetch details of logined user and remove password and refreshToken from it.
  const loggedInUser = await User.findById(user._id).select("-password");

  //options for cookies(cookies cant be edited by user)
  const options = {
    httpOnly: true,
    secure: true,
  };

  //response to user with data
  return res
    .status(200)
    .cookie("token", token)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          token,
        },
        "user logged in successfully"
      )
    );
};
//================== updateUser =====================
const updateUser = async (req, res) => {
  // Extract user ID from request parameters
  const { id } = req.params;

  try {
    // Find the user by ID in the database
    let user = await User.findById(id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json(new ApiResponse(404, "User not found"));
    }

    // Extract updated user information from request body
    const { username, email, role } = req.body;

    // Keep track of the old Cloudinary URL
    const oldCloudinaryUrl = user.image;

    // Update only the fields that have changed
    if (email !== undefined && email !== user.email) {
      user.email = email;
    }
    if (username !== undefined && username !== user.username) {
      user.username = username;
    }
    if (role !== undefined && role !== user.role) {
      user.role = role;
    }

    // If a new image is provided, update the image
    if (req.file) {
      // Upload new image to Cloudinary
      const imageLocalPath = req.file.path;

      // Attempt to upload image to Cloudinary
      const cloudinaryUrl = await uploadOnCloudinary(imageLocalPath);

      if (!cloudinaryUrl) {
        throw new ApiError(400, "Failed to upload image to Cloudinary");
      }

      // Update the user's image field with the new Cloudinary URL
      user.image = cloudinaryUrl;

      // Delete old image from Cloudinary
      if (oldCloudinaryUrl) {
        await cloudinary.uploader.destroy(cloudinaryUrl);
      }
    }

    // Save the updated user in the database
    await user.save({ validateBeforeSave: true });

    // Remove password field from user object before sending response
    user.password = undefined;

    // Send response with updated user data
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  } catch (error) {
    // Log the error for debugging
    console.error("Error updating user:", error);

    // Send error response
    return res.status(500).json(new ApiResponse(500, "Unable to update user"));
  }
};

//====================== log out =================

const logout = async (req, res) => {};

//=================== enrollUserInCourse =====================
const enrollUserInCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if the user is already enrolled in the course
    if (course.studentsEnrolled.includes(userId)) {
      return res
        .status(400)
        .json({ error: "User is already enrolled in this course" });
    }

    // Add the course to the user's courses array
    user.courses.push(courseId);
    await user.save();

    // Add the user to the course's studentsEnrolled array
    course.studentsEnrolled.push(userId);
    await course.save();

    res.status(200).json({ message: "User enrolled in course successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to enroll user in course" });
  }
};
export { registerUser, login, logout, updateUser, enrollUserInCourse };
