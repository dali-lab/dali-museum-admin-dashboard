import { Modes } from "@/types/painting";

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
  CURATOR_HEATMAP: { title: "Curator's Heatmap", color: "#C055D1" },
  ANNOTATIONS: { title: "Annotations", color: "#E67A50" },
  POST_VIEWING: { title: "Comparative Image", color: "#8D126D" },
};

export const MODES: Record<
  Modes,
  {
    key: Modes;
    label: string;
    conditions: string;
  }
> = {
  [Modes.EXHIBITION]: {
    key: Modes.EXHIBITION,
    label: "Exhibition",
    conditions:
      "A painting must have a title, description, annotations, and a curator heatmap to be enabled for exhibition mode.",
  },
  [Modes.POSTVIEW]: {
    key: Modes.POSTVIEW,
    label: "Post-viewing",
    conditions:
      "A painting must have a title, description, annotations, and a curator heatmap to be enabled for post-viewing mode.",
  },
  [Modes.COMPARATIVE]: {
    key: Modes.COMPARATIVE,
    label: "Comparative",
    conditions:
      "A painting must have a title, description, and a comparative image to be enabled for comparative mode.",
  },
};

export const MAX_PAINTINGS = 12; // maximum number of paintings in any mode

export const MAX_HEATMAP_POINTS = 1800; // maximum number to allow in a heatmap.
// this is the number of gaze points the tobii collects for a normal gazepath
export const HEATMAP_POINT_FREQUENCY = 60; // in hz

export const MIN_BRUSH_SIZE = 25;
export const MAX_BRUSH_SIZE = 100;
export const MIN_POINTS_ADDED = 1;
export const MAX_POINTS_ADDED = 5;
