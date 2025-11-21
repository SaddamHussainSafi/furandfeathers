import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import AuthShowcase from "../components/AuthShowcase";
import api from "../api";
import "../styles/auth.css";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("ADOPTER");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
    if (!fullName) {
      setError("Please share your name.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!acceptedTerms) {
      setError("Please agree to the terms to continue.");
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting registration with:", { name: fullName, email, password: "***", role });
      const response = await api.post("/auth/signup", { name: fullName, email, password, role });
      console.log("Registration response:", response.data);
      if (response.data.status === "success") {
        login(response.data.user, response.data.token);
        navigate("/redirect");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = (user, token) => {
    login(user, token);
    navigate("/dashboard");
  };

  return (
    <AuthShowcase mode="signup">
      <div className="auth-form-card">
        <div className="auth-form__header">
          <p className="auth-form__eyebrow">Adoption Community</p>
          <h1 className="auth-form__title">Create an Account</h1>
          <p className="auth-form__subtitle">
            Craft a modern adoption workspace with beautifully organized pet profiles, applications, and AI insights.
          </p>
          <p className="auth-form__toggle">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>

        {error && <div className="auth-feedback auth-feedback--error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__grid">
            <div className="auth-input">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="auth-input">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-input">
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="ADOPTER">Adopter</option>
              <option value="SHELTER">Shelter</option>
            </select>
          </div>

          <div className="auth-input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-input">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <label className="auth-checkbox" htmlFor="terms">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            I agree to the{" "}
            <a href="/terms" target="_blank" rel="noreferrer">
              Terms &amp; Conditions
            </a>
          </label>

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        <div className="auth-social">
          <GoogleLoginButton onLogin={handleGoogleLogin} />
        </div>
      </div>
    </AuthShowcase>
  );
}

