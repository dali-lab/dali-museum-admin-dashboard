import { signIn } from "@/api/auth";
import { ROUTES } from "@/utils/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import daliLogo from "../../assets/dali_light.png";

type RoleLoginProps = {
  role: "admin" | "researcher";
};

function RoleLoginPage(props: RoleLoginProps) {
  const nav = useNavigate();

  // State for form fields with empty initial values
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });

  // Handle input changes
  const handleFormEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const signinQuery = signIn();

  const onGoBack = () => {
    nav("/");
  };

  const onLogIn = () => {
    signinQuery.mutate({ email: formData.userId, password: formData.password });
  };

  const onForgotDetails = () => {
    nav(ROUTES.NONE);
  };

  return (
    <div className="login-container">
      <button className="back-button" onClick={onGoBack}>
        Back
      </button>

      <h1 className="login-title">
        {props.role == "researcher" ? "Researcher " : "Admin "}
        Log In
      </h1>

      <div className="login-form">
        <div className="form-group">
          <label htmlFor="userId">User ID</label>
          <input
            type="text"
            id="userId"
            className="form-input"
            value={formData.userId}
            onChange={handleFormEdit}
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
            onChange={handleFormEdit}
            placeholder=""
          />
        </div>

        <button className="confirm-button" onClick={onLogIn}>
          Confirm
        </button>

        <button className="forgot-details-button" onClick={onForgotDetails}>
          Forgot Details?
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
}

export default RoleLoginPage;
