import { ROUTES } from "@/utils/constants";
import { Link } from "react-router-dom";
import "./ErrorPage.scss";

const ErrorPage: React.FC = () => {
  return (
    <div className="error-page">
      <div className="error-container">
        <h1>404</h1>
        <h3>Page not found.</h3>
        <p>The page you are looking for does not exist.</p>

        <Link to={ROUTES.DASHBOARD}>
          <button> Return to dashboard </button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
