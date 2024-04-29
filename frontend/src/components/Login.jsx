import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  //======== event handlers ==============

  function changeHandler(event) {
    setLoginData((preData) => ({
      ...preData,
      [event.target.name]: event.target.value,
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();
    await axios
      .post("/api/v1/user/login", loginData)
      .then((res) => {
        navigate("/home");
        console.log(res);
        console.log("redirected");
      })
      .catch((rej) => {
        console.log("error", rej);
        console.log(rej.response);
      });
  }

  return (
    <form
      onSubmit={submitHandler}
      className=" bg-neutral-800  shadow-lg p-10 space-y-7 rounded-lg "
    >
      <h1> Login </h1>
      <div className="flex flex-col gap-2">
        <input
          onChange={changeHandler}
          type="email"
          name="email"
          placeholder="Email"
          className=" h-14 rounded-lg p-4"
        />
        <input
          onChange={changeHandler}
          type="password"
          name="password"
          placeholder="Password"
          className=" h-14 rounded-lg p-4"
        />
      </div>
      <button
        type="submit"
        className=" py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        Login
      </button>
    </form>
  );
}
