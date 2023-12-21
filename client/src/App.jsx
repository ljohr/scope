import "./App.css";
import axios from "axios";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Courses from "./pages/Courses/Courses";
import Professors from "./pages/Professors/Professors";
import Majors from "./pages/Majors/Majors";
import TopRated from "./pages/TopRated/TopRated";
import ProfessorSingle from "./pages/ProfessorSingle/ProfessorSingle";
import CourseSingle from "./pages/CourseSingle/CourseSingle";
import MajorProfs from "./pages/MajorProfs/MajorProfs";
import Core from "./pages/Core/Core";
import Login from "./pages/LoginRegister/Login";
import Register from "./pages/LoginRegister/Register";
import ResetPassword from "./pages/LoginRegister/ResetPassword";
import PageNotFound from "./pages/PageNotFound/PageNotFound.jsx";
import UserReview from "./pages/UserReview/UserReview.jsx";
import UserProvider from "./utils/UserProvider.jsx";
import MajorCourses from "./pages/MajorCourses/MajorCourses.jsx";

axios.defaults.baseURL = "https://scopeapi.onrender.com";

const LayOut = () => {
  return (
    <UserProvider>
      <header>
        <Navbar />
      </header>
      <ToastContainer />
      <Outlet />
      <Footer />
    </UserProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayOut />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/professors",
        element: <Professors />,
      },
      {
        path: "/majors",
        element: <Majors />,
      },
      {
        path: "/top-rated",
        element: <TopRated />,
      },
      {
        path: "/core",
        element: <Core />,
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
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/:deptcode/:profname",
        element: <ProfessorSingle />,
      },
      {
        path: "/:deptcode/:profname/:coursecode",
        element: <CourseSingle />,
      },
      {
        path: "/:deptcode/professors",
        element: <MajorProfs />,
      },
      {
        path: "/:deptcode/all-courses",
        element: <MajorCourses />,
      },
      {
        path: "/:deptcode/:profname/:coursecode/new-review",
        element: <UserReview />,
      },
      {
        path: "/page-not-found",
        element: <PageNotFound />,
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
