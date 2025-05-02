import RoleChecker from "../components/RoleChecker";
import Login from "../pages/auth/login";
import Dashboard from "../pages/dashboard";
import AddGroup from "../pages/groups/addGroups";
import Groups from "../pages/groups/groups";
import Home from "../pages/home/home";
import AddStudent from "../pages/students/addStudents";
import Students from "../pages/students/students";
import AddTeacher from "../pages/teachers/addTeachers";
import Teachers from "../pages/teachers/teachers";

export const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <RoleChecker roles={["admin", "teacher"]}>
        <Dashboard />
      </RoleChecker>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "students",
        element: <Students />,
      },
      {
        path: "/students/add",
        element: <AddStudent />,
      },
      {
        path: "teachers",
        element: <Teachers />,
      },
      {
        path: "/teachers/add",
        element: <AddTeacher />,
      },
      {
        path: "groups",
        element: <Groups />,
      },
      {
        path: "/groups/add",
        element: <AddGroup />,
      },
    ],
  },
];
