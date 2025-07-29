import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import "./SignUpPage.scss";
import { ROUTES } from "@/utils/constants";
import Footer from "@/components/Footer/Footer";
import { signUp } from "@/api/auth";
import { readableScope, UserScopes } from "@/types/users";
import TextInput from "@/components/TextInput";
import { AuthErrors, EMPTY_AUTH_ERRORS } from "@/types/errors";

interface SignUpPageProps {
  role: UserScopes;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ role }) => {
  const { mutate: mutateSignUp } = signUp();

  // State for form fields with empty initial values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState(EMPTY_AUTH_ERRORS);
  const updateError = useCallback(
    (newValue: Partial<AuthErrors>) => {
      setErrors((prev) => ({ ...prev, ...newValue }));
    },
    [setErrors]
  );
  const getErrors = useCallback(() => {
    const newErrors = { ...EMPTY_AUTH_ERRORS };
    if (formData.name === "") newErrors.name = "Name cannot be empty";
    if (formData.email === "") newErrors.email = "Email cannot be empty";
    if (!formData.email.includes("@"))
      newErrors.email = "Email must be a valid email address";
    if (formData.password.length > 0 && formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (
      (formData.password.length > 0 || formData.confirmPassword.length > 0) &&
      formData.confirmPassword !== formData.password
    )
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  }, [formData]);

  const handleConfirmClick = () => {
    // verify that the information is valid
    const newErrors = getErrors();
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    // remove confirmPassword
    const { confirmPassword, ...rest } = formData;

    mutateSignUp({
      ...rest,
      role,
    });
  };

  return (
    <div className="signup-container">
      <Link
        className="back-button button transparent"
        to={ROUTES.ROLE_SELECTION}
      >
        Back
      </Link>

      <h1 className="signup-title">{readableScope(role)} Sign Up</h1>

      <div className="signup-form">
        <TextInput
          label="Full Name"
          value={formData.name}
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, name: value }));
            updateError({ name: "" });
          }}
          error={errors.name}
        />
        <TextInput
          label={
            (role == UserScopes.Admin ? "Work" : "School") + " Email Address"
          }
          value={formData.email}
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, email: value }));
            updateError({ email: "" });
          }}
          error={errors.email}
        />
        <TextInput
          type="password"
          label="Password"
          value={formData.password}
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, password: value }));
            // remove the error for confirm password too
            updateError({ password: "", confirmPassword: "" });
          }}
          error={errors.password}
        />
        <TextInput
          type="password"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, confirmPassword: value }));
            updateError({ confirmPassword: "" });
          }}
          error={errors.confirmPassword}
        />

        <div className="button-container">
          <button className="button primary" onClick={handleConfirmClick}>
            Sign up
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignUpPage;
