import React from "react";
import { Link } from "react-router-dom";
import "./RoleSelectionPage.scss";
import { ROUTES } from "@/utils/constants";
import RoleWidget from "../RoleWidget/RoleWidget";
import Footer from "@/components/Footer/Footer";
import { UserScopes } from "@/types/users";

const RoleSelectionPage: React.FC = () => {
  return (
    <div className="role-selection-container">
      <h1 className="role-selection-title">Sign Up</h1>

      <h2 className="role-selection-subtitle">
        What Is Your Purpose For Accessing "How Do I Look"?
      </h2>

      <div className="tiles-container">
        <RoleWidget
          role={UserScopes.Researcher}
          to={ROUTES.SIGNUP_RESEARCHER}
          subtitle="Sign Up"
        />
        <RoleWidget
          role={UserScopes.Admin}
          to={ROUTES.SIGNUP_ADMIN}
          subtitle="Sign Up"
        />
      </div>

      <Link to={ROUTES.WELCOME} className="button transparent">
        Log In
      </Link>

      <Footer />
    </div>
  );
};

export default RoleSelectionPage;
