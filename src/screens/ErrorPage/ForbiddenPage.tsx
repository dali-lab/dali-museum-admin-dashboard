import { logout } from "@/api/auth";
import "./ErrorPage.scss";

const ForbiddenPage: React.FC = () => {
  const { mutate: mutateLogout } = logout();

  const handleLogin = () => {
    mutateLogout();
    // this will redirect to welcome page
    // and also reset the local storage token in case it was expired or something
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <h1>403</h1>
        <h3>Forbidden</h3>

        <p>You must be logged in to view this page.</p>

        <button onClick={handleLogin}>Log in</button>
      </div>
    </div>
  );
};

export default ForbiddenPage;
