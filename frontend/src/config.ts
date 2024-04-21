interface NavigationConfig {
  main: {
    title: string;
    path: string;
  }[];
  side: {
    title: string;
    items: {
      title: string;
      path: string;
      label?: string;
    }[];
  }[];
}

export const navigationConfig: NavigationConfig = {
  main: [
    {
      title: "Teams",
      path: "/teams",
    },
    {
      title: "Tournaments",
      path: "/tournaments",
    },
    {
      title: "Users",
      path: "/users",
    },
  ],
  side: [
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          path: "/dashboard",
        },
      ],
    },
    {
      title: "Team Management",
      items: [
        {
          title: "Your Teams",
          path: "/dashboard/teams",
        },
        {
          title: "Create Team",
          path: "/dashboard/teams/create",
        },
      ],
    },
    {
      title: "Team Invitations",
      items: [
        {
          title: "Your Invitations",
          path: "/dashboard/invitations",
        },
        {
          title: "Sent Invitations",
          path: "/dashboard/invitations/sent",
        },
      ],
    },
    {
      title: "Tournament Management",
      items: [
        {
          title: "Your Tournaments",
          path: "/dashboard/tournaments",
        },
        {
          title: "Create Tournament",
          path: "/dashboard/tournaments/create",
        },
      ],
    },
    {
      title: "Follow Management",
      items: [
        {
          title: "Your Followers",
          path: "/dashboard/followers",
          label: "",
        },
        {
          title: "Your Following",
          path: "/dashboard/following",
          label: "",
        },
      ],
    },
  ],
};
