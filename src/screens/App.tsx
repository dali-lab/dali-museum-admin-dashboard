import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import { UserScopes } from "@/types/users";
import DashboardPage from "./DashboardPage";
import ErrorPage from "./ErrorPage";
import ForbiddenPage from "./ForbiddenPage";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import PaintingsPage from "./PaintingsPage";
import HeatmapsPage from "./HeatmapsPage";
import VerifyPage from "./VerifyPage";
import { getConnection } from "@/api/connection";
import { getAuthUser, jwtSignIn, logout, setCredentials } from "@/api/auth";
import { getBearerToken, setBearerToken } from "@/utils/localStorage";

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
        <Route path={ROUTES.SIGNIN} element={<SignInPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
        <Route
          path={ROUTES.VERIFY}
          element={
            // <ProtectedRoute allowableScopes={[UserScopes.Unverified]}>
            <VerifyPage />
            // </ProtectedRoute>
          }
        />
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
        <Route
          path={ROUTES.HEATMAPS}
          element={
            // <ProtectedRoute allowableScopes={[UserScopes.Admin]}>
            <HeatmapsPage />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
