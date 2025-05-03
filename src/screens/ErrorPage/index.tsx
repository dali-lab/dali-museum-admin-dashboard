import { ROUTES } from "@/utils/constants";
import React from "react";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="container">
      <h1>404</h1>
      <h3>Page not found.</h3>
      <p>The page you are looking for does not exist.</p>
      <Link to={ROUTES.DASHBOARD}>
        <button> Return to dashboard </button>
      </Link>
    </div>
  );
}

export default ErrorPage;
