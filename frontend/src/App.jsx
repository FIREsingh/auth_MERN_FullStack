import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createBrowserRouter, Outlet } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Home from "./components/Home";
import AdminPage from "./components/AdminPage";
import Dashboard from "./components/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Outlet isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
}

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
      },
    ],
  },
]);

export default AppRouter;
