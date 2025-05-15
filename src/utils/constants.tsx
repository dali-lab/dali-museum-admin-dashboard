export const SERVER_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL;

export const ROUTES = {
  NONE: "/404",

  ROLE_SELECTION: "/roles",
  LOGIN: "/login",
  LOGIN_RESEARCHER: "/login-researcher",
  LOGIN_ADMIN: "/login-admin",
  SIGNUP: "/signup",
  SIGNUP_RESEARCHER: "/signup-researcher",
  SIGNUP_ADMIN: "/signup-ADMIN",
  VERIFY: "/verify",
  DASHBOARD: "/dashboard",

  PAINTINGS: "/paintings",
  HEATMAPS: "/heatmaps",
  USERS: "/users",

  SETTINGS: "/settings",
  ADMIN_REQUESTS: "/admin-requests",
};

export const FEATURES = {
  POST_VIEWING: { title: "Post-viewing", color: "#8D126D" },
  CURATOR_HEATMAP: { title: "Curator's Heatmap", color: "#C055D1" },
  ANNOTATIONS: { title: "Annotations", color: "#E67A50" },
};
