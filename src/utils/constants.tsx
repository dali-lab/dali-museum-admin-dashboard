export const SERVER_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL;

export const ROUTES = {
  // signup flow: role-selection -> researcher / admin signup (diff routes but the same page)
  ROLE_SELECTION: "/signup",
  SIGNUP_RESEARCHER: "/researcher-signup",
  SIGNUP_ADMIN: "/administrator-signup",

  // login flow: root (welcome) -> researcher / admin login
  WELCOME: "/login",
  LOGIN_RESEARCHER: "/researcher-login",
  LOGIN_ADMIN: "/administrator-login",

  VERIFY: "/verify",

  DASHBOARD: "/",
  SETTINGS: "/settings",
  ADMIN_REQUESTS: "/admin-requests",

  PAINTINGS: "/paintings",
  // these vvvv are all subroutes of /paintings/:id/
  EDIT_BASIC_INFO: "basic-info",
  EDIT_ANNOTATIONS: "annotations",
  EDIT_CURATOR_HEATMAP: "curator-heatmap",
  EDIT_POSTVIEW_IMAGE: "postview-image",

  // HEATMAPS: "/heatmaps",

  NOT_FOUND: "/404",
};

export const FEATURES = {
  POST_VIEWING: { title: "Post-viewing", color: "#8D126D" },
  CURATOR_HEATMAP: { title: "Curator's Heatmap", color: "#C055D1" },
  ANNOTATIONS: { title: "Annotations", color: "#E67A50" },
};
