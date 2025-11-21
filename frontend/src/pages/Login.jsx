import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import AuthShowcase from "../components/AuthShowcase";
import api from "../api";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { email, password: "***" });
      const response = await api.post("/auth/login", { email, password });
      console.log("Login response:", response.data);
      if (response.data.status === "success") {
        login(response.data.user, response.data.token);
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = (user, token) => {
    login(user, token);
    navigate("/dashboard");
  };

  return (
    <AuthShowcase mode="login">
      <div className="auth-form-card">
        <div className="auth-form__header">
          <p className="auth-form__eyebrow">Portal Access</p>
          <h1 className="auth-form__title">Log in to Fur &amp; Feathers</h1>
          <p className="auth-form__subtitle">
            Manage shelter messages, update pets, and match adopters faster with our calm control center.
          </p>
          <p className="auth-form__toggle">
            Don’t have an account? <Link to="/register">Create one</Link>
          </p>
        </div>

        {error && <div className="auth-feedback auth-feedback--error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-form__meta">
            <label className="auth-checkbox" htmlFor="remember">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="mailto:support@furandfeathers.com">Forgot password?</a>
          </div>

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Logging in…" : "Log in"}
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


