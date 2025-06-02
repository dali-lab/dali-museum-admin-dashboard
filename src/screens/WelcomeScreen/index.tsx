// src/screens/WelcomeScreen.tsx
import React from "react";
import "../WelcomeScreen/WelcomeScreen.css";
import daliLogo from "../../assets/dali_light.png";
import { ROUTES } from "@/utils/constants";
import { Link } from "react-router-dom";

const WelcomeScreen: React.FC = () => {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome</h1>

      <div className="tiles-container">
        <Link to={ROUTES.RESEARCHER_LOGIN}>
          <button className="role-tile">
            <div className="icon-circle">
              <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                <circle cx="12" cy="8" r="4" />
                <path d="M12,14c-6.1,0-8,4-8,4v2h16v-2C20,18,18.1,14,12,14z" />
              </svg>
            </div>
            <h2>Researcher</h2>
            <p>Log In</p>
          </button>
        </Link>

        <Link to={ROUTES.ADMIN_LOGIN}>
          <button className="role-tile">
            <div className="icon-circle">
              <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                <circle cx="12" cy="8" r="4" />
                <path d="M12,14c-6.1,0-8,4-8,4v2h16v-2C20,18,18.1,14,12,14z" />
                <path d="M18,8h-2v2h2V8z" />
              </svg>
            </div>
            <h2>Administrator</h2>
            <p>Log In</p>
          </button>
        </Link>
      </div>

      <div className="footer">
        <div className="logo-container">
          <img src={daliLogo} alt="DALI Lab" className="dali-logo" />
        </div>

        <Link to={ROUTES.ROLE_SELECTION}>
          <button className="sign-up-button">Sign Up</button>
        </Link>

        <div className="help-text">
          how do i<br />
          look?
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
