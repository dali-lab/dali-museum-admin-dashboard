import { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginPage.scss";
import { signIn } from "@/api/auth";
import { ROUTES } from "@/utils/constants";
import Footer from "@/components/Footer/Footer";
import { readableScope, UserScopes } from "@/types/users";
import TextInput from "@/components/TextInput";

type LoginProps = {
  role: UserScopes;
};

const LoginPage: React.FC<LoginProps> = ({ role }) => {
  const { mutate: mutateSignIn } = signIn();

  // State for form fields with empty initial values
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    if (!formData.email) alert("Please enter your userId!");
    else if (!formData.password) alert("Please enter your password!");
    else {
      mutateSignIn({ email: formData.email, password: formData.password });
    }
  };

  const onForgotDetails = () => {
    // TODO
  };

  return (
    <div className="login-container">
      <Link className="back-button button transparent" to={ROUTES.WELCOME}>
        Back
      </Link>

      <h1 className="login-title">{readableScope(role)} Log In</h1>

      <div className="login-form">
        <TextInput
          label={
            (role == UserScopes.Admin ? "Work" : "School") + " Email Address"
          }
          value={formData.email}
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, email: value }));
          }}
        />
        <TextInput
          type="password"
          label="Password"
          value={formData.password}
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, password: value }));
          }}
        />

        <button className="confirm-button primary" onClick={handleLogin}>
          Confirm
        </button>

        <button
          className="forgot-details-button transparent"
          onClick={onForgotDetails}
        >
          Forgot Details?
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
