// src/components/GoogleLoginButton.js
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import api from "../api";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function GoogleLoginButton({ onLogin }) {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    try {
      console.log("Google login response:", response);
      const res = await api.post("/auth/google", { idToken: response.credential });
      console.log("Backend response:", res.data);
      if (res.data.status === "success") {
        // call context login so app state and storage are set consistently
        const user = res.data.user;
        const token = res.data.token;
        if (login) login(user, token);
        if (onLogin) onLogin(user, token);
        navigate('/dashboard');
      } else {
        alert(res.data.message || "Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed. Please try again.");
    }
  };

  // Replace with your actual Google OAuth client ID from Google Cloud Console
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1047749868973-5k7qq63t5o34f4usvtj74rfo05t3adlm.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={(error) => {
            console.error("Google OAuth error:", error);
            alert("Google login failed");
          }}
          theme="outline"
          size="large"
        />
      </div>
    </GoogleOAuthProvider>
  );
}

