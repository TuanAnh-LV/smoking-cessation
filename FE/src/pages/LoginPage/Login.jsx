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
import quit from "../../assets/quit.png";

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
      <div className="login-shell">
        <section className="login-hero">
          <h1 className="login-hero__title">Return to your quit journey.</h1>
          <p className="login-hero__description">
            Track milestones, stay close to your coach, and keep your plan in
            motion with the same calm experience used across the rest of SC.
          </p>

          <div className="login-hero__media">
            <img src={quit} alt="Quit smoking support journey" />
          </div>
        </section>

        <div className="login-container">
          <div className="login-container__header">
            <span className="login-container__tag">Sign in</span>
            <h2 className="main-title">Welcome back</h2>
            <p className="subtitle">
              Continue where you left off and manage your progress with one
              account.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <div className="form-group__label-row">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="eye-icon"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="social-login-divider">
              <span>Or continue with</span>
            </div>

            <button
              type="button"
              className="google-login-button"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="google-icon" />
              <span>Sign in with Google</span>
            </button>

            <p className="signup-link">
              Don&apos;t have an account?{" "}
              <Link to={ROUTER_URL.COMMON.REGISTER}>Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
