// src/components/AuthForm.js
import React, { useState } from "react";
import api from "../api";
import GoogleLoginButton from "./GoogleLoginButton";

const AuthForm = ({ onLogin, isSignup: initialIsSignup = false }) => {
  const [isSignup, setIsSignup] = useState(initialIsSignup);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "ADOPTER" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const endpoint = isSignup ? "/auth/signup" : "/auth/login";
    try {
      console.log(`Attempting ${isSignup ? 'signup' : 'login'} with:`, { ...form, password: "***" });
      const res = await api.post(endpoint, form);
      console.log(`${isSignup ? 'Signup' : 'Login'} response:`, res.data);
      if (res.data.status === "success") onLogin(res.data.user, res.data.token);
      else alert(res.data.message);
    } catch (error) {
      console.error(`${isSignup ? 'Signup' : 'Login'} error:`, error);
      alert(`${isSignup ? 'Signup' : 'Login'} failed. Please try again.`);
    }
  };

  return (
    <div className="card shadow-lg border-0 rounded-4 overflow-hidden w-75 mx-auto mt-5">
      <div className="row g-0">
        <div className="col-md-5 bg-teal text-white d-flex flex-column align-items-center justify-content-center p-4">
          <h2 className="fw-bold">Fur &amp; Feathers</h2>
          <p className="text-center small mt-2">Adopt. Connect. Love.</p>
        </div>

        <div className="col-md-7 p-5 bg-light">
          <h4 className="fw-bold mb-4 text-center">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h4>

          {isSignup && (
            <>
              <input name="name" placeholder="Full Name" className="form-control mb-3" onChange={handleChange} />
              <select name="role" className="form-control mb-3" onChange={handleChange} value={form.role}>
                <option value="">Select Role</option>
                <option value="ADOPTER">Adopter</option>
                <option value="SHELTER">Shelter</option>
              </select>
            </>
          )}
          <input name="email" placeholder="Email" className="form-control mb-3" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" className="form-control mb-4" onChange={handleChange} />

          <button className="btn btn-teal w-100 mb-3" onClick={handleSubmit}>
            {isSignup ? "Sign Up" : "Log In"}
          </button>

          <div className="text-center">or</div>
          <div className="d-flex justify-content-center mt-3">
            <GoogleLoginButton onLogin={onLogin} />
          </div>

          <div className="text-center mt-4">
            <small>
              {isSignup ? "Already have an account?" : "New here?"}{" "}
              <button
                className="btn btn-link p-0 text-coral fw-bold"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Log In" : "Sign Up"}
              </button>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

