export const SERVER_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL;

export const ROUTES = {
  SIGNIN: "/signin",
  ROLE_SELECTION: "/role-selection",
  SIGNUP: "/signup",
  RESEARCHER_LOGIN: "/researcher-login",
  ADMIN_LOGIN: "/admin-login",
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
