import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import { UserScopes } from "@/types/users";
import FrontPage from "./FrontPage";
import ErrorPage from "./ErrorPage";
import ForbiddenPage from "./ForbiddenPage";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import UsersPage from "./UsersPage";
import ResourcesPage from "./ResourcesPage";
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

  if (!isConnected) return <ErrorPage />;

  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<FrontPage />} />
        <Route path={ROUTES.SIGNIN} element={<SignInPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
        <Route
          path={ROUTES.USERS}
          element={
            <ProtectedRoute allowableScopes={[UserScopes.Admin]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.RESOURCES}
          element={
            <ProtectedRoute
              allowableScopes={[UserScopes.User, UserScopes.Admin]}
            >
              <ResourcesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.VERIFY}
          element={
            <ProtectedRoute allowableScopes={[UserScopes.Unverified]}>
              <VerifyPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
