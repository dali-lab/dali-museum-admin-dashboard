import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import { UserScopes } from "@/types/users";
import DashboardPage from "./DashboardPage";
import ErrorPage from "./ErrorPage/ErrorPage";
import ForbiddenPage from "./ErrorPage/ForbiddenPage";
import PaintingsPage from "./PaintingsPage";
// import HeatmapsPage from "./HeatmapsPage";
import AdminRequests from "@/screens/AdminRequests"; // Import the AdminRequests component
import { getConnection } from "@/api/connection";
import { getAuthUser, jwtSignIn, setCredentials } from "@/api/auth";
import AccountSettingsPage from "./AccountSettingsPage";
import EditPaintingPage from "./EditPaintingPages/EditPaintingPage";
import EditBasicInfoPage from "./EditPaintingPages/EditBasicInfoPage";
import EditAnnotationsPage from "./EditPaintingPages/EditAnnotationsPage/EditAnnotationsPage";
import EditCuratorHeatmapPage from "./EditPaintingPages/EditCuratorHeatmapPage";
import EditPostviewImagePage from "./EditPaintingPages/EditPostviewImagePage";
import { getBearerToken } from "@/utils/localStorage";
import WelcomeScreen from "./AuthPages/WelcomeScreen";
import LoginPage from "./AuthPages/LoginPage/LoginPage";
import RoleSelectionPage from "./AuthPages/RoleSelectionPage";
import SignUpPage from "./AuthPages/SignUpPage/SignUpPage";
import UnverifiedPage from "./ErrorPage/UnverifiedPage";

interface ProtectedRouteProps {
  allowableScopes: UserScopes[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ allowableScopes, children }: ProtectedRouteProps) => {
  const { data, isFetched } = getAuthUser();
  if (!isFetched) return null;

  const { authenticated, role } = data;
  if (!authenticated) {
    return <ForbiddenPage />;
  }
  if (!allowableScopes.includes(role)) {
    return <UnverifiedPage />;
  }

  return <>{children}</>;
};

function App() {
  const { isConnected } = getConnection().data;

  useEffect(() => {
    const token = getBearerToken();
    if (token) {
      setCredentials(token);
    }
  }, []);

  const { mutate: mutateJwtSignIn } = jwtSignIn();

  useEffect(() => {
    if (isConnected) {
      mutateJwtSignIn();
    }
  }, [isConnected, mutateJwtSignIn]);

  return (
    <Router>
      <Routes>
        <Route path={ROUTES.WELCOME} element={<WelcomeScreen />} />
        <Route
          path={ROUTES.LOGIN_RESEARCHER}
          element={<LoginPage role={UserScopes.Researcher} />}
        />
        <Route
          path={ROUTES.LOGIN_ADMIN}
          element={<LoginPage role={UserScopes.Admin} />}
        />

        <Route path={ROUTES.ROLE_SELECTION} element={<RoleSelectionPage />} />
        <Route
          path={ROUTES.SIGNUP_RESEARCHER}
          element={<SignUpPage role={UserScopes.Researcher} />}
        />
        <Route
          path={ROUTES.SIGNUP_ADMIN}
          element={<SignUpPage role={UserScopes.Admin} />}
        />

        <Route
          path={ROUTES.ADMIN_REQUESTS}
          element={
            <ProtectedRoute
              allowableScopes={[UserScopes.Admin, UserScopes.Researcher]}
            >
              <AdminRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <ProtectedRoute
              allowableScopes={[UserScopes.Admin, UserScopes.Researcher]}
            >
              <AccountSettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute
              allowableScopes={[UserScopes.Admin, UserScopes.Researcher]}
            >
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PAINTINGS}
          element={
            <ProtectedRoute
              allowableScopes={[UserScopes.Admin, UserScopes.Researcher]}
            >
              <PaintingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PAINTINGS + "/:paintingId"}
          element={
            <ProtectedRoute
              allowableScopes={[UserScopes.Admin, UserScopes.Researcher]}
            >
              <EditPaintingPage />
            </ProtectedRoute>
          }
        >
          <Route
            path={ROUTES.EDIT_BASIC_INFO}
            element={
              <ProtectedRoute
                allowableScopes={[UserScopes.Admin, UserScopes.Researcher]}
              >
                <EditBasicInfoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EDIT_ANNOTATIONS}
            element={
              <ProtectedRoute
                allowableScopes={[UserScopes.Admin, UserScopes.Researcher]}
              >
                <EditAnnotationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EDIT_CURATOR_HEATMAP}
            element={
              <ProtectedRoute
                allowableScopes={[UserScopes.Admin, UserScopes.Researcher]}
              >
                <EditCuratorHeatmapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EDIT_POSTVIEW_IMAGE}
            element={
              <ProtectedRoute
                allowableScopes={[UserScopes.Admin, UserScopes.Researcher]}
              >
                <EditPostviewImagePage />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* <Route
          path={ROUTES.HEATMAPS}
          element={
            // <ProtectedRoute allowableScopes={[UserScopes.Admin]}>
            <HeatmapsPage />
            // </ProtectedRoute>
          }
        /> */}
        <Route path={ROUTES.NOT_FOUND} element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
