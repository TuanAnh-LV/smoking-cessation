import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCalendarAlt, FaChevronDown } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { message } from "antd";
import isEmail from "validator/lib/isEmail";
import { AuthService } from "../../services/auth.service";
import { ROUTER_URL } from "../../const/router.const";
import quit from "../../assets/quit.png";
import "./Register.scss";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [birthDate, setBirthDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const genderSelectRef = useRef(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        genderSelectRef.current &&
        !genderSelectRef.current.contains(event.target)
      ) {
        setIsGenderOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "", email: "" }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.username) newErrors.username = "Username is required.";
    if (!form.full_name) newErrors.full_name = "Full name is required.";
    if (!form.email) newErrors.email = "Email is required.";
    else if (!isEmail(form.email)) newErrors.email = "Invalid email format.";
    if (!form.password) newErrors.password = "Password is required.";
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!birthDate) newErrors.birth_date = "Date of birth is required.";
    if (!form.gender) newErrors.gender = "Gender is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        birth_date: birthDate.toISOString().split("T")[0],
        gender: form.gender,
      };

      await AuthService.register(payload);
      message.success("Registration successful! Please check your email.");
      setTimeout(() => navigate(ROUTER_URL.COMMON.LOGIN), 2000);
    } catch (err) {
      const errorMessage =
        err?.error?.response?.data?.error ||
        err?.error?.response?.data?.message ||
        err?.message ||
        "Registration failed!";
      setErrors({ email: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-shell">
        <section className="register-hero">
          <h1 className="register-hero__title">
            Build a calmer quit plan from day one.
          </h1>
          <p className="register-hero__description">
            Create your account to track progress, connect with support, and
            keep every milestone in one place with the same visual language as
            the rest of the platform.
          </p>

          <div className="register-hero__media">
            <img src={quit} alt="Smoking cessation support" />
          </div>
        </section>

        <div className="register-card">
          <div className="register-card__header">
            <span className="register-card__tag">Create account</span>
            <h2>Create your account</h2>
            <p>Set up your profile and start your quit journey with Moca.</p>
          </div>

          <form className="register-form" onSubmit={handleRegister}>
            <div className="register-grid">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={(e) =>
                    handleFieldChange("username", e.target.value)
                  }
                />
                {errors.username && (
                  <p className="error-text">{errors.username}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="fullName">Full name</label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Enter your full name"
                  value={form.full_name}
                  onChange={(e) =>
                    handleFieldChange("full_name", e.target.value)
                  }
                />
                {errors.full_name && (
                  <p className="error-text">{errors.full_name}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dob">Date of birth</label>
                <div className="input-with-icon">
                  <DatePicker
                    selected={birthDate}
                    onChange={(date) => {
                      setBirthDate(date);
                      setErrors((prev) => ({ ...prev, birth_date: "" }));
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    customInput={<input type="text" id="dob" />}
                    toggleCalendarOnIconClick
                    showIcon
                    icon={<FaCalendarAlt className="icon" />}
                  />
                </div>
                {errors.birth_date && (
                  <p className="error-text">{errors.birth_date}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <div
                  className={`register-select ${isGenderOpen ? "is-open" : ""} ${
                    errors.gender ? "has-error" : ""
                  }`}
                  ref={genderSelectRef}
                >
                  <button
                    type="button"
                    id="gender"
                    className="register-select__trigger"
                    onClick={() => setIsGenderOpen((prev) => !prev)}
                    aria-haspopup="listbox"
                    aria-expanded={isGenderOpen}
                  >
                    <span
                      className={`register-select__value ${
                        form.gender ? "has-value" : ""
                      }`}
                    >
                      {form.gender
                        ? form.gender.charAt(0).toUpperCase() +
                          form.gender.slice(1)
                        : "Select gender"}
                    </span>
                    <FaChevronDown className="register-select__icon" />
                  </button>

                  {isGenderOpen && (
                    <div className="register-select__menu" role="listbox">
                      {[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                        { value: "other", label: "Other" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`register-select__option ${
                            form.gender === option.value ? "is-selected" : ""
                          }`}
                          onClick={() => {
                            handleFieldChange("gender", option.value);
                            setIsGenderOpen(false);
                          }}
                          role="option"
                          aria-selected={form.gender === option.value}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.gender && <p className="error-text">{errors.gender}</p>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="register-grid">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Create password"
                    value={form.password}
                    onChange={(e) =>
                      handleFieldChange("password", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="icon-button"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash className="icon" />
                    ) : (
                      <FaEye className="icon" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="error-text">{errors.password}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <div className="input-with-icon">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      handleFieldChange("confirmPassword", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="icon-button"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="icon" />
                    ) : (
                      <FaEye className="icon" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="error-text">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Create account"}
            </button>

            <p className="register-footer">
              Already have an account?{" "}
              <Link to={ROUTER_URL.COMMON.LOGIN}>Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
