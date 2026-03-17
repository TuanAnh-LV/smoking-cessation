import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.scss";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AuthService } from "../../services/auth.service";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "../../context/authContext";
import { auth, provider } from "../../config/firebase.config";
import { ROUTER_URL } from "../../const/router.const";
import { message } from "antd";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loginGoogle, handleLogin } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await loginGoogle(idToken);
      message.success("Successfully signed in with Google!");
      navigate(ROUTER_URL.COMMON.HOME);
    } catch {
      message.error("Google sign-in failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthService.login({
        email: formData.email,
        password: formData.password,
      });

      const token = response?.data?.token;
      const user = response?.data?.user;

      if (token && user) {
        await handleLogin(token, user);
        message.success("Login successful!");

        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "coach") {
          navigate("/coach");
        } else {
          navigate(ROUTER_URL.COMMON.HOME);
        }
      } else {
        message.error("Invalid login response.");
      }
    } catch {
      message.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="main-title">Welcome back!</h1>
        <p className="subtitle">
          Welcome to Moca! Wishing you a happy and healthy day!
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address*</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Please enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="eye-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>
          </div>

          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="social-login-divider">
            <span>Or sign in with</span>
          </div>

          <button
            type="button"
            className="google-login-button"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="google-icon" />
          </button>

          <p className="signup-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
