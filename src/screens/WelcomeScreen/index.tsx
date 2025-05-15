// src/screens/WelcomeScreen.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../WelcomeScreen/WelcomeScreen.css";
import daliLogo from "../../assets/dali_light.png";
import { ROUTES } from "@/utils/constants";

const WelcomeScreen: React.FC = () => {
	const navigate = useNavigate();

	// Handler for the Sign Up button
	const handleSignUpClick = () => {
		navigate(ROUTES.ROLE_SELECTION);
	};

	// Handlers for the role tiles
	const handleResearcherClick = () => {
		navigate(ROUTES.LOGIN_RESEARCHER);
	};

	const handleAdministratorClick = () => {
		navigate(ROUTES.LOGIN_ADMIN);
	};

	return (
		<div className="welcome-container">
			<h1 className="welcome-title">Welcome {}</h1>

			<div className="tiles-container">
				<button
					className="role-tile"
					onClick={handleResearcherClick}
				>
					<div className="icon-circle">
						<svg viewBox="0 0 24 24" fill="white" width="24" height="24">
							<circle cx="12" cy="8" r="4" />
							<path d="M12,14c-6.1,0-8,4-8,4v2h16v-2C20,18,18.1,14,12,14z" />
						</svg>
					</div>
					<h2>Researcher</h2>
					<p>Log In</p>
				</button>

				<button
					className="role-tile"
					onClick={handleAdministratorClick}
				>
					<div className="icon-circle">
						<svg viewBox="0 0 24 24" fill="white" width="24" height="24">
							<circle cx="12" cy="8" r="4" />
							<path d="M12,14c-6.1,0-8,4-8,4v2h16v-2C20,18,18.1,14,12,14z" />
							<path d="M18,8h-2v2h2V8z" />
						</svg>
					</div>
					<h2>Administrator</h2>
					<p>Log In</p>
				</button>
			</div>

			<div className="footer">
				<div className="logo-container">
					<img src={daliLogo} alt="DALI Lab" className="dali-logo" />
				</div>

				<button
					className="sign-up-button"
					onClick={handleSignUpClick}
				>
					Sign Up
				</button>

				<div className="help-text">
					how do i<br />look?
				</div>
			</div>
		</div>
	);
};

export default WelcomeScreen;
