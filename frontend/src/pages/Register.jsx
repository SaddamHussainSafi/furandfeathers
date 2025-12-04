import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import AuthShowcase from "../components/AuthShowcase";
import api from "../api";
import "../styles/auth.css";

const ROLE_OPTIONS = ["ADOPTER", "SHELTER"];
const NAME_REGEX = /^(?=.{2,40}$)[A-Za-z]+(?:[A-Za-z' -]*[A-Za-z])?$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const validateRegistrationForm = ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  role,
  acceptedTerms,
}) => {
  const errors = {};
  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();
  const normalizedEmail = email.trim();

  if (!trimmedFirst) {
    errors.firstName = "First name is required.";
  } else if (!NAME_REGEX.test(trimmedFirst)) {
    errors.firstName = "Use 2-40 letters; spaces or hyphens allowed.";
  }

  if (!trimmedLast) {
    errors.lastName = "Last name is required.";
  } else if (!NAME_REGEX.test(trimmedLast)) {
    errors.lastName = "Use 2-40 letters; spaces or hyphens allowed.";
  }

  if (!normalizedEmail) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_REGEX.test(normalizedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (!PASSWORD_REGEX.test(password)) {
    errors.password = "Use 8+ characters with letters and numbers.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!ROLE_OPTIONS.includes(role)) {
    errors.role = "Select a valid role.";
  }

  if (!acceptedTerms) {
    errors.acceptedTerms = "You must accept the terms to continue.";
  }

  return errors;
};

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (hasSubmitted) {
      setFieldErrors(
        validateRegistrationForm({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          role,
          acceptedTerms,
        })
      );
    }
  }, [firstName, lastName, email, password, confirmPassword, role, acceptedTerms, hasSubmitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setHasSubmitted(true);

    const validationResults = validateRegistrationForm({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      role,
      acceptedTerms,
    });

    setFieldErrors(validationResults);

    if (Object.keys(validationResults).length) {
      setError("Please review the highlighted fields.");
      return;
    }

    setLoading(true);

    try {
      const trimmedFirst = firstName.trim();
      const trimmedLast = lastName.trim();
      const normalizedEmail = email.trim().toLowerCase();
      const fullName = [trimmedFirst, trimmedLast].filter(Boolean).join(" ");

      console.log("Attempting registration with:", {
        name: fullName,
        email: normalizedEmail,
        password: "***",
        role,
      });
      const response = await api.post("/auth/signup", {
        name: fullName,
        email: normalizedEmail,
        password,
        role,
      });
      console.log("Registration response:", response.data);
      if (response.data.status === "success") {
        login(response.data.user, response.data.token);
        navigate("/redirect");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const serverMessage = err.response?.data?.message;
      const serverFieldErrors = err.response?.data?.errors;

      if (serverFieldErrors && typeof serverFieldErrors === "object") {
        setFieldErrors((prev) => ({ ...prev, ...serverFieldErrors }));
        const firstError = Object.values(serverFieldErrors)[0];
        setError((firstError && String(firstError)) || serverMessage || "Registration failed. Please try again.");
        return;
      }

      setError(serverMessage || "Registration failed. Please try again.");
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
            <div className={`auth-input ${fieldErrors.firstName ? "auth-input--error" : ""}`}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                aria-invalid={Boolean(fieldErrors.firstName)}
                required
              />
              {fieldErrors.firstName && <p className="auth-input__error">{fieldErrors.firstName}</p>}
            </div>
            <div className={`auth-input ${fieldErrors.lastName ? "auth-input--error" : ""}`}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                aria-invalid={Boolean(fieldErrors.lastName)}
                required
              />
              {fieldErrors.lastName && <p className="auth-input__error">{fieldErrors.lastName}</p>}
            </div>
          </div>

          <div className={`auth-input ${fieldErrors.email ? "auth-input--error" : ""}`}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              required
            />
            {fieldErrors.email && <p className="auth-input__error">{fieldErrors.email}</p>}
          </div>

          <div className={`auth-input ${fieldErrors.role ? "auth-input--error" : ""}`}>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-invalid={Boolean(fieldErrors.role)}
              required
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "ADOPTER" ? "Adopter" : "Shelter"}
                </option>
              ))}
            </select>
            {fieldErrors.role && <p className="auth-input__error">{fieldErrors.role}</p>}
          </div>

          <div className={`auth-input ${fieldErrors.password ? "auth-input--error" : ""}`}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              required
            />
            {fieldErrors.password && <p className="auth-input__error">{fieldErrors.password}</p>}
          </div>

          <div className={`auth-input ${fieldErrors.confirmPassword ? "auth-input--error" : ""}`}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              required
            />
            {fieldErrors.confirmPassword && <p className="auth-input__error">{fieldErrors.confirmPassword}</p>}
          </div>

          <div className={`auth-checkbox-group ${fieldErrors.acceptedTerms ? "auth-checkbox-group--error" : ""}`}>
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
            {fieldErrors.acceptedTerms && <p className="auth-input__error">{fieldErrors.acceptedTerms}</p>}
          </div>

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

