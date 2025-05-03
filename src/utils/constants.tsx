export const SERVER_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL;

export const ROUTES = {
  // signup flow: role-selection -> researcher / admin signup (diff routes but the same page)
  ROLE_SELECTION: "/role-selection",
  RESEARCHER_SIGNUP: "/researcher-signup",
  ADMIN_SIGNUP: "/administrator-signup",

  // login flow: root (welcome) -> researcher / admin login
  WELCOME: "/",
  RESEARCHER_LOGIN: "/researcher-login",
  ADMIN_LOGIN: "/administrator-login",

  DASHBOARD: "/dashboard",
  PAINTINGS: "/paintings",
  // HEATMAPS: "/heatmaps",

  SETTINGS: "/settings",
  ADMIN_REQUESTS: "/admin-requests",
};

export const FEATURES = {
  POST_VIEWING: { title: "Post-viewing", color: "#8D126D" },
  CURATOR_HEATMAP: { title: "Curator's Heatmap", color: "#C055D1" },
  ANNOTATIONS: { title: "Annotations", color: "#E67A50" },
};
