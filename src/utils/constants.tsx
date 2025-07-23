export const SERVER_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL;

export const ROUTES = {
  NONE: "/404",

  // signup flow: role-selection -> researcher / admin signup (diff routes but the same page)
  ROLE_SELECTION: "/role-selection",
  RESEARCHER_SIGNUP: "/researcher-signup",
  ADMIN_SIGNUP: "/administrator-signup",

  // login flow: root (welcome) -> researcher / admin login
  WELCOME: "/",
  RESEARCHER_LOGIN: "/researcher-login",
  ADMIN_LOGIN: "/administrator-login",

  VERIFY: "/verify",

  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  ADMIN_REQUESTS: "/admin-requests",

  PAINTINGS: "/paintings",
  // these vvvv are all subroutes of /paintings/:id/
  EDIT_BASIC_INFO: "basic-info",
  EDIT_ANNOTATIONS: "annotations",
  EDIT_CURATOR_HEATMAP: "curator-heatmap",
  EDIT_POSTVIEW_IMAGE: "postview-image",

  // HEATMAPS: "/heatmaps",

  NOT_FOUND: "/not-found",
};

export const FEATURES = {
  POST_VIEWING: { title: "Post-viewing", color: "#8D126D" },
  CURATOR_HEATMAP: { title: "Curator's Heatmap", color: "#C055D1" },
  ANNOTATIONS: { title: "Annotations", color: "#E67A50" },
};
