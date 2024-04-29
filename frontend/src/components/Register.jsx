import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    role: "student",
    username: "",
    image: "", // This will hold the selected image file
  });

  function changeHandler(event) {
    if (event.target.name === "image") {
      // If input is file upload, set the image file
      setRegisterData((preData) => ({
        ...preData,
        [event.target.name]: event.target.files[0],
      }));
    } else {
      // Otherwise, update the state normally
      setRegisterData((preData) => ({
        ...preData,
        [event.target.name]: event.target.value,
      }));
    }
  }

  function roleHandler(event) {
    setRegisterData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();
    setLoading(true);

    // FormData for file upload
    const formData = new FormData();
    formData.append("email", registerData.email);
    formData.append("password", registerData.password);
    formData.append("role", registerData.role);
    formData.append("username", registerData.username);
    formData.append("image", registerData.image);

    console.log(registerData);
    // Uncomment below after handling file upload properly

    await axios
      .post("/api/v1/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        navigate("/login");
      })
      .catch((rej) => {
        console.log("error");
        console.log(rej);
      });
    setLoading(false);
  }

  return loading ? (
    <Loading />
  ) : (
    <form
      onSubmit={submitHandler}
      className="bg-neutral-800  shadow-lg p-10 space-y-7 rounded-lg"
    >
      <h1>Register</h1>

      <div className="flex flex-col gap-2">
        <input
          onChange={changeHandler}
          type="text"
          name="username"
          placeholder="username"
          className="h-14 rounded-lg p-4"
        />
        <input
          onChange={changeHandler}
          type="email"
          name="email"
          placeholder="Email"
          className="h-14 rounded-lg p-4"
        />

        <input
          onChange={changeHandler}
          type="password"
          name="password"
          placeholder="New Password"
          className="h-14 rounded-lg p-4"
        />
        <input
          onChange={changeHandler}
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="h-14 rounded-lg p-4"
        />
        <fieldset className="border space-y-3 border-cyan-700 rounded-lg p-4">
          <legend>Role</legend>
          <div className=" flex justify-between gap-2">
            <div className="flex items-center  ">
              <input
                id="student"
                type="radio"
                value="student"
                name="role"
                onChange={roleHandler}
                checked={registerData.role === "student"}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="student"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Student
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="teacher"
                type="radio"
                value="teacher"
                name="role"
                onChange={roleHandler}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="teacher"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Teacher
              </label>
            </div>
            <div className="flex items-center ">
              <input
                id="admin"
                type="radio"
                value="admin"
                name="role"
                onChange={roleHandler}
                checked={registerData.role === "admin"}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="admin"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Admin
              </label>
            </div>
          </div>
        </fieldset>
        <div className=" mt-4 space-y-4">
          <h2 className=" text-lg font-semibold text-cyan-600">
            Upload Profile Photo
          </h2>
          <input
            type="file"
            name="image"
            accept="image/*" // Specify accepted file types
            onChange={changeHandler}
          />
        </div>
      </div>
      <button
        type="submit"
        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        Sign Up
      </button>
    </form>
  );
}
