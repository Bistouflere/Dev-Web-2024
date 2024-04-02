import "./index.css";
import DashboardLayout from "./layouts/dashboard-layout";
import RootLayout from "./layouts/root-layout";
import NotFoundPage from "./not-found";
import IndexPage from "./routes";
import CreateTeamPage from "./routes/dashboard/createTeam";
import DashboardPage from "./routes/dashboard/index";
import TeamPage from "./routes/dashboard/teams";
import SignInPage from "./routes/sign-in";
import SignUpPage from "./routes/sign-up";
import TeamsPage from "./routes/teams";
import TeamProfile from "./routes/teams.teamId";
import TournamentsPage from "./routes/tournaments";
import TournamentProfile from "./routes/tournaments.tournamentId";
import UsersPage from "./routes/users";
import UserProfile from "./routes/users.userId";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "/teams", element: <TeamsPage /> },
      { path: "/teams/:teamId", element: <TeamProfile /> },
      { path: "/tournaments", element: <TournamentsPage /> },
      { path: "/tournaments/:tournamentId", element: <TournamentProfile /> },
      { path: "/users", element: <UsersPage /> },
      { path: "/users/:userId", element: <UserProfile /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        path: "dashboard",
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/dashboard/teams", element: <TeamPage /> },
          { path: "/dashboard/teams/create", element: <CreateTeamPage /> },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
