import React from "react";
import { Link } from "react-router-dom";
import "./WelcomeScreen.scss";
import { ROUTES } from "@/utils/constants";
import Footer from "@/components/Footer/Footer";
import RoleWidget from "../RoleWidget/RoleWidget";
import { UserScopes } from "@/types/users";

const WelcomeScreen: React.FC = () => {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome</h1>

      <div className="tiles-container">
        <RoleWidget
          to={ROUTES.LOGIN_RESEARCHER}
          role={UserScopes.Researcher}
          subtitle="Log In"
        />
        <RoleWidget
          to={ROUTES.LOGIN_ADMIN}
          role={UserScopes.Admin}
          subtitle="Log In"
        />
      </div>

      <Link className="button transparent" to={ROUTES.ROLE_SELECTION}>
        Sign Up
      </Link>

      <Footer />
    </div>
  );
};

export default WelcomeScreen;
