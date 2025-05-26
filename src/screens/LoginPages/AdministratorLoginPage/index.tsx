// src/screens/AdministratorLoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LoginPage.css";
import daliLogo from "../../../assets/dali_light.png";
import { signIn } from "@/api/auth";

const AdministratorLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const { mutate: mutateSignIn } = signIn();
  
  // State for form fields with empty initial values
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const handleConfirmClick = () => {
    console.log("Administrator login attempt with:", formData);
    // Add authentication logic later
    if (!formData.userId) alert("Please enter your userId!");
    else if (!formData.password) alert("Please enter your password!");
    else {
      mutateSignIn({ email: formData.userId, password: formData.password });
    }
  };

  const handleForgotDetails = () => {
    console.log("Forgot details clicked");
    // Add password recovery flow later
  };

  return (
    <div className="login-container">
      <button className="back-button" onClick={handleBackClick}>
        Back
      </button>

      <h1 className="login-title">Administrator Log In</h1>
      
      <div className="login-form">
        <div className="form-group">
          <label htmlFor="userId">User ID</label>
          <input 
            type="text" 
            id="userId" 
            className="form-input"
            value={formData.userId}
            onChange={handleChange}
            placeholder=""
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            placeholder=""
          />
        </div>

        <button 
          className="confirm-button"
          onClick={handleConfirmClick}
        >
          Confirm
        </button>
        
        <button 
          className="forgot-details-button"
          onClick={handleForgotDetails}
        >
          Forgot Details?
        </button>
      </div>
      
      <div className="footer">
        <div className="logo-container">
          <img src={daliLogo} alt="DALI Lab" className="dali-logo" />
        </div>
        
        <div className="help-text">
          how do i<br />look?
        </div>
      </div>
    </div>
  );
};

export default AdministratorLoginPage;