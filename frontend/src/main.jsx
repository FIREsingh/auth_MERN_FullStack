import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./App";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={AppRouter} />
    <Toaster />
  </React.StrictMode>
);
