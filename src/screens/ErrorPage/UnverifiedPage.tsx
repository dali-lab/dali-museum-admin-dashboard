import { logout } from "@/api/auth";
import "./ErrorPage.scss";

const UnverifiedPage: React.FC = () => {
  const { mutate: mutateLogout } = logout();

  return (
    <div className="error-page">
      <div className="error-container">
        <h1>Signed up successfully</h1>
        <h3>Waiting for verification</h3>

        <p>
          You must be verified to access the dashboard. Please wait for an admin
          to approve your request.
        </p>

        <button className="danger" onClick={() => mutateLogout()}>
          Log out
        </button>
      </div>
    </div>
  );
};

export default UnverifiedPage;
