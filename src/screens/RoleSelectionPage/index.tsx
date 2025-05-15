// src/screens/RoleSelectionPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelectionPage.css";
import daliLogo from "../../assets/dali_light.png";
import { ROUTES } from "@/utils/constants";

const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  const handleResearchClick = () => {
    // For now, both buttons lead to the same sign up form
    navigate(ROUTES.SIGNUP_RESEARCHER);
  };

  const handleAdministrationClick = () => {
    // For now, both buttons lead to the same sign up form
    navigate(ROUTES.SIGNUP_ADMIN);
  };

  return (
    <div className="role-selection-container">
      <button className="back-button" onClick={handleBackClick}>
        Back
      </button>

      <h1 className="role-selection-title">Sign Up</h1>

      <h2 className="role-selection-subtitle">
        What Is Your Purpose For Accessing "How Do I Look"?
      </h2>

      <div className="tiles-container">
        <button className="role-tile" onClick={handleResearchClick}>
          <div className="icon-circle">
            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
              <circle cx="12" cy="8" r="4" />
              <path d="M12,14c-6.1,0-8,4-8,4v2h16v-2C20,18,18.1,14,12,14z" />
            </svg>
          </div>
          <h2>Research</h2>
        </button>

        <button className="role-tile" onClick={handleAdministrationClick}>
          <div className="icon-circle">
            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
              <circle cx="12" cy="8" r="4" />
              <path d="M12,14c-6.1,0-8,4-8,4v2h16v-2C20,18,18.1,14,12,14z" />
            </svg>
          </div>
          <h2>Administration</h2>
        </button>
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
