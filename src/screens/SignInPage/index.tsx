import React, { useState } from "react";
import { signIn } from "@/api/auth";
import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/constants";

function SignInPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { mutate: mutateSignIn } = signIn();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Send only if all fields filled in
    if (!email) alert("Please enter an email address!");
    else if (!password) alert("Please enter a password!");
    else {
      mutateSignIn({ email, password });
    }
  };

  return (
    <div className="container">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value="Sign In" />
      </form>

      <Link to={ROUTES.SIGNUP}>
        <h1>or Sign Up</h1>
      </Link>
    </div>
  );
}

export default SignInPage;
