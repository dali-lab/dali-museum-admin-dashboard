import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import { UserScopes } from "@/types/users";
import DashboardPage from "./DashboardPage";
import ErrorPage from "./ErrorPage";
import ForbiddenPage from "./ForbiddenPage";
import SignUpPage from "./SignUpPage";
import PaintingsPage from "./PaintingsPage";
import HeatmapsPage from "./HeatmapsPage";
import WelcomeScreen from "@/screens/WelcomeScreen";
import RoleSelectionPage from "@/screens/RoleSelectionPage";
import ResearcherLoginPage from "@/screens/LoginPages/ResearcherLoginPage";
import AdministratorLoginPage from "@/screens/LoginPages/AdministratorLoginPage";
import AdminRequests from "@/screens/AdminRequests"; // Import the AdminRequests component
import { getConnection } from "@/api/connection";
import { getAuthUser, jwtSignIn, logout, setCredentials } from "@/api/auth";
import { getBearerToken, setBearerToken } from "@/utils/localStorage";
import AccountSettingsPage from "./AccountSettingsPage";

interface ProtectedRouteProps {
  allowableScopes: UserScopes[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ allowableScopes, children }: ProtectedRouteProps) => {
  const { authenticated, role } = getAuthUser().data;
  if (!allowableScopes.includes(role) || !authenticated) {
    return <ForbiddenPage />;
  }
  return <>{children}</>;
};

function App() {
  const { isConnected } = getConnection().data;
  const { mutate: logoutMutate } = logout();

  useEffect(() => {
    const token = getBearerToken();
    if (token) {
      setCredentials(token);
    } else {
      logoutMutate();
    }
  }, []);

  const { mutate: mutateJwtSignIn } = jwtSignIn();

  useEffect(() => {
    if (isConnected) {
      mutateJwtSignIn();
    }
  }, [isConnected]);

  // if (!isConnected) return <ErrorPage />;

  return (
    <Router>
      <Routes>
        <Route path={ROUTES.ROLE_SELECTION} element={<RoleSelectionPage />} />
        <Route
          path={ROUTES.RESEARCHER_SIGNUP}
          element={<SignUpPage role={UserScopes.Researcher} />}
        />
        <Route
          path={ROUTES.ADMIN_SIGNUP}
          element={<SignUpPage role={UserScopes.Admin} />}
        />

        <Route path={ROUTES.WELCOME} element={<WelcomeScreen />} />
        <Route
          path={ROUTES.RESEARCHER_LOGIN}
          element={<ResearcherLoginPage />}
        />
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdministratorLoginPage />} />

        <Route path={ROUTES.ADMIN_REQUESTS} element={<AdminRequests />} />
        <Route path={ROUTES.SETTINGS} element={<AccountSettingsPage />} />

        <Route
          path={ROUTES.DASHBOARD}
          element={
            // <ProtectedRoute allowableScopes={[UserScopes.Admin]}>
            <DashboardPage />
            // </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PAINTINGS}
          element={
            // <ProtectedRoute allowableScopes={[UserScopes.Admin]}>
            <PaintingsPage />
            // </ProtectedRoute>
          }
        />
        {/* <Route
          path={ROUTES.HEATMAPS}
          element={
            // <ProtectedRoute allowableScopes={[UserScopes.Admin]}>
            <HeatmapsPage />
            // </ProtectedRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
