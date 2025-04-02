import { createBrowserRouter, Link, Outlet, redirect } from "react-router-dom";
import { Counters } from "./modules/counters/counters";
import { UserInfo } from "./modules/users/user-info";
import { UsersList } from "./modules/users/users-list";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="app">
        <header>
          <Link to={"users"}>Users</Link>
          <Link to={"counters"}>Counters</Link>
        </header>
        <Outlet />
      </div>
    ),
    children: [
      {
        index: true,
        loader: () => redirect("/users"),
      },
      {
        path: "users",
        element: <UsersList />,
      },
      {
        path: "users/:id",
        element: <UserInfo />,
      },
      {
        path: "counters",
        element: <Counters />,
      },
    ],
  },
]);
