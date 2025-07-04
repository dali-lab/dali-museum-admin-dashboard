// src/screens/RoleSelectionPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./RoleSelectionPage.css";
import daliLogo from "../../assets/dali_light.png";
import { ROUTES } from "@/utils/constants";

const RoleSelectionPage: React.FC = () => {
  return (
    <div className="role-selection-container">
      <Link to={ROUTES.WELCOME}>
        <button className="back-button">Back</button>
      </Link>

      <h1 className="role-selection-title">Sign Up</h1>

      <h2 className="role-selection-subtitle">
        What Is Your Purpose For Accessing "How Do I Look"?
      </h2>

      <div className="tiles-container">
        <Link to={ROUTES.RESEARCHER_SIGNUP}>
          <button className="role-tile">
            <div className="icon-circle">
              <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                <circle cx="12" cy="8" r="4" />
                <path d="M12,14c-6.1,0-8,4-8,4v2h16v-2C20,18,18.1,14,12,14z" />
              </svg>
            </div>
            <h2>Research</h2>
          </button>
        </Link>

        <Link to={ROUTES.ADMIN_SIGNUP}>
          <button className="role-tile">
            <div className="icon-circle">
              <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                <circle cx="12" cy="8" r="4" />
                <path d="M12,14c-6.1,0-8,4-8,4v2h16v-2C20,18,18.1,14,12,14z" />
              </svg>
            </div>
            <h2>Administration</h2>
          </button>
        </Link>
      </div>

      <div className="footer">
        <div className="logo-container">
          <img src={daliLogo} alt="DALI Lab" className="dali-logo" />
        </div>

        <div className="help-text">
          how do i<br />
          look?
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
