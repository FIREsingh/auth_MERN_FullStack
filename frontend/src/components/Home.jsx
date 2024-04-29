import React from "react";

export default function Home() {
  return (
    <div className=" space-y-6">
      <h1 className=" text-9xl"> Welcome</h1>
      <h2 className=" text-3xl">Topic covered in this project are :- </h2>
      <div className=" flex flex-col text-left text-lg ">
        <h3>
          <span className=" font-semibold text-xl">Backend:</span> ExpressJS,
          Authentication, Authorisation, JWT, Middleware, JOI, Multer,
          Cloudinary, Cookies, CORS, API (get, post, put, delete).
        </h3>
        <h3>
          <span className=" font-semibold text-xl">Frontend:</span> React,
          Hooks.
        </h3>
        <h3>
          <span className=" font-semibold text-xl">Database:</span> MongoDb,
          SQL, Join/Lookup, Handled multi tables/collections.
        </h3>
        <h5 className=" text-cyan-600">
          Proper file structure and clean code**
        </h5>
      </div>
    </div>
  );
}
