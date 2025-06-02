// src/screens/SignUpPage.tsx
import React, { useState } from "react";
import "./SignUpPage.css";
import daliLogo from "../../assets/dali_light.png";
import { UserScopes } from "@/types/users";
import { ROUTES } from "@/utils/constants";
import { Link } from "react-router-dom";

interface SignupPageProps {
  role: UserScopes;
}

const SignUpPage: React.FC<SignupPageProps> = ({ role }) => {
  // State for form fields with empty initial values
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // const { mutate: mutateCreateUser } = createUser();
  // const { mutate: mutateUpdateUser } = updateUser();
  // const { mutate: mutateDeleteUser } = deleteUser();

  // const handleCreateUserSubmit = () => {
  //   // Send only if all fields filled in
  //   if (!createEmail) alert("Please enter an email!");
  //   else if (!createPassword) alert("Please enter a password!");
  //   else if (!createName) alert("Please enter a name!");
  //   else {
  //     mutateCreateUser({
  //       email: createEmail,
  //       password: createPassword,
  //       name: createName,
  //     });
  //   }
  // };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleConfirmClick = () => {
    console.log("Confirm button clicked with data:", formData);
    // Add functionality later
  };

  return (
    <div className="signup-container">
      <Link to={ROUTES.ROLE_SELECTION}>
        <button className="back-button">Back</button>
      </Link>

      <h1 className="signup-title">Sign Up</h1>

      <div className="signup-form">
        <div className="form-group">
          <label htmlFor="id">
            {role == UserScopes.Admin ? "Museum" : "University"} ID
          </label>
          <input
            type="text"
            id="id"
            className="form-input"
            value={formData.id}
            onChange={handleChange}
            placeholder=""
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Work/School Email Address</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={formData.email}
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

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder=""
          />
        </div>

        <button className="confirm-button" onClick={handleConfirmClick}>
          Confirm
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

export default SignUpPage;
