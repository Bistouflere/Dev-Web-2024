import "./index.css";
import DashboardLayout from "./layouts/dashboard-layout";
import RootLayout from "./layouts/root-layout";
import NotFoundPage from "./not-found";
import IndexPage from "./routes";
import CreateTeamPage from "./routes/dashboard/create-team";
import CreateTournamentPage from "./routes/dashboard/create-tournament";
import FollowersPage from "./routes/dashboard/followers";
import FollowingPage from "./routes/dashboard/following";
import DashboardPage from "./routes/dashboard/index";
import InvitationsPage from "./routes/dashboard/invitations";
import SentInvitationsPage from "./routes/dashboard/sent-invitations";
import TeamPage from "./routes/dashboard/teams";
import TeamDetailPage from "./routes/dashboard/teams.teamId";
import TournamentPage from "./routes/dashboard/tournaments";
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
      { path: "/teams/:searchTeamId", element: <TeamProfile /> },
      { path: "/tournaments", element: <TournamentsPage /> },
      {
        path: "/tournaments/:searchTournamentId",
        element: <TournamentProfile />,
      },
      { path: "/users", element: <UsersPage /> },
      { path: "/users/:searchUserId", element: <UserProfile /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        path: "dashboard",
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/dashboard/teams", element: <TeamPage /> },
          { path: "/dashboard/teams/create", element: <CreateTeamPage /> },
          {
            path: "/dashboard/teams/:searchTeamId",
            element: <TeamDetailPage />,
          },
          {
            path: "/dashboard/invitations",
            element: <InvitationsPage />,
          },
          {
            path: "/dashboard/invitations/sent",
            element: <SentInvitationsPage />,
          },
          { path: "/dashboard/tournaments", element: <TournamentPage /> },
          {
            path: "/dashboard/tournaments/create",
            element: <CreateTournamentPage />,
          },
          {
            path: "/dashboard/followers",
            element: <FollowersPage />,
          },
          {
            path: "/dashboard/following",
            element: <FollowingPage />,
          },
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
