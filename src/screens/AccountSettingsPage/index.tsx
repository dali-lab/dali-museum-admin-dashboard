import { deleteUser, updateUser } from "@/api/users";
import PageHeader from "@/components/PageHeader";
import TextInput from "@/components/TextInput";
import { useCallback, useState } from "react";
import "./styles.scss";
import Modal from "@/components/Modal";
import { ROUTES } from "@/utils/constants";
import { getAuthUser, logout } from "@/api/auth";
import { AuthErrors, EMPTY_AUTH_ERRORS } from "@/types/errors";

const AccountSettingsPage: React.FC = () => {
  // get current user data either from local storage or from the store
  // depending on how login is set up
  const user = getAuthUser().data;

  const [updatedUser, setUpdatedUser] = useState(user);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  const { mutate: mutateUpdateUser } = updateUser();
  const { mutate: mutateDeleteUser } = deleteUser();
  const { mutate: mutateLogout } = logout();

  const [errors, setErrors] = useState(EMPTY_AUTH_ERRORS);
  const updateError = useCallback(
    (newValue: Partial<AuthErrors>) => {
      setErrors((prev) => ({ ...prev, ...newValue }));
    },
    [setErrors]
  );
  const getErrors = useCallback(() => {
    const newErrors = { ...EMPTY_AUTH_ERRORS };
    if (updatedUser.name === "") newErrors.name = "Name cannot be empty";
    if (updatedUser.email === "") newErrors.email = "Email cannot be empty";
    if (!updatedUser.email.includes("@"))
      newErrors.email = "Email must be a valid email address";
    if (password.length > 0 && password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (
      (password.length > 0 || confirmPassword.length > 0) &&
      confirmPassword !== password
    )
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  }, [updatedUser, password, confirmPassword]);

  const handleSave = useCallback(() => {
    // verify that the information is valid
    const newErrors = getErrors();
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      alert("Please correct the errors and try again.");
      return;
    }

    // make request to backend
    mutateUpdateUser({
      ...updatedUser,
      id: user.id,
      password: password === "" ? undefined : password,
    });
  }, [getErrors, mutateUpdateUser, updatedUser, user.id, password]);

  const handleDelete = useCallback(() => {
    mutateDeleteUser({ id: user.id });
    mutateLogout();
  }, [mutateDeleteUser, mutateLogout, user.id]);

  return (
    <>
      <PageHeader title={"Settings"} selected={ROUTES.SETTINGS} />

      <div className="account-settings-page">
        <div className="settings-container">
          <TextInput
            label="User Name"
            value={updatedUser.name}
            onChange={(value) => {
              setUpdatedUser({ ...updatedUser, name: value });
              updateError({ name: "" });
            }}
            onBlur={() => setErrors(getErrors())}
            error={errors.name}
          />
          <TextInput
            label="Email"
            value={updatedUser.email}
            onChange={(value) => {
              setUpdatedUser({ ...updatedUser, email: value });
              updateError({ email: "" });
            }}
            onBlur={() => setErrors(getErrors())}
            error={errors.email}
          />
          <TextInput
            type="password"
            label="Change Password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              // remove the error for confirm password too
              updateError({ password: "", confirmPassword: "" });
            }}
            onBlur={() => setErrors(getErrors())}
            error={errors.password}
          />
          <TextInput
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(value) => {
              setConfirmPassword(value);
              updateError({ confirmPassword: "" });
            }}
            onBlur={() => setErrors(getErrors())}
            error={errors.confirmPassword}
          />

          <div className="button-container">
            <button
              className="danger"
              onClick={() => setConfirmDeleteModalOpen(true)}
            >
              Delete account
            </button>
            <button className="danger" onClick={() => mutateLogout()}>
              Log out
            </button>
            <button className="primary" onClick={handleSave}>
              Save changes
            </button>
          </div>
        </div>
      </div>

      {/* confirmation modal */}
      <Modal
        isOpen={confirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
      >
        <h2>Are you sure you want to delete your account?</h2>
        <p>You will lose access to the HDIL admin dashboard and data.</p>

        <div className="delete-modal-button-container">
          <button onClick={() => setConfirmDeleteModalOpen(false)}>
            Cancel
          </button>
          <button className="danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AccountSettingsPage;
