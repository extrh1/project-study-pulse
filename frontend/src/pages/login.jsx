import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faGoogle,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setIsSignIn(!isSignIn);
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/register", {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        password_confirmation: registerData.confirmPassword,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      navigate("/home");
    } catch (err) {
      const errorData = err.response?.data;
      const validation = errorData?.errors
        ? Object.values(errorData.errors).flat().join(" ")
        : null;

      setError(
        validation || errorData?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/login", {
        email: loginData.email,
        password: loginData.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const user = res.data.user;

      //Role Ckeck
      if(user.role === "admin"){
        navigate("/admin/dashboard");
      }
      else{
        navigate("/home");
      }
      
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 403) {
        setError("Account disabled. Contact admin.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const validation = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" ")
        : null;

      setError(validation || message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:8000/api/auth/${provider}/redirect`;
  };

  return (
    <div className="auth-container">

      <div className={`auth-wrapper ${isSignIn ? "" : "right-panel-active"}`}>
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegister}>
            <h1 className="title">Create Account</h1>

            <div className="social-container">
              <button
                type="button"
                className="social"
                onClick={() => handleSocialLogin("facebook")}
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </button>
              <button
                type="button"
                className="social"
                onClick={() => handleSocialLogin("google")}
              >
                <FontAwesomeIcon icon={faGoogle} />
              </button>
              <button
                type="button"
                className="social"
                onClick={() => handleSocialLogin("linkedin")}
              >
                <FontAwesomeIcon icon={faLinkedinIn} />
              </button>
              <button
                type="button"
                className="social"
                onClick={() => handleSocialLogin("twitter")}
              >
                <FontAwesomeIcon icon={faTwitter} />
              </button>
            </div>

            <span>or use your email for registration</span>

            <input
              type="text"
              className="form-control my-2"
              placeholder="Name"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
              required
            />
            <input
              type="email"
              className="form-control my-2"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              required
            />
            <input
              type="password"
              className="form-control my-2"
              placeholder="Confirm Password"
              value={registerData.confirmPassword}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  confirmPassword: e.target.value,
                })
              }
              required
            />

            <button
              className="btn btn-outline-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1 className="title">Sign In</h1>

            <div className="social-container">
              <button
                type="button"
                className="social"
                onClick={() => handleSocialLogin("facebook")}
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </button>
              <button
                type="button"
                className="social"
                onClick={() => handleSocialLogin("google")}
              >
                <FontAwesomeIcon icon={faGoogle} />
              </button>
              <button
                type="button"
                className="social"
                onClick={() => handleSocialLogin("linkedin")}
              >
                <FontAwesomeIcon icon={faLinkedinIn} />
              </button>
              <button
                type="button"
                className="social"
                onClick={() => handleSocialLogin("twitter")}
              >
                <FontAwesomeIcon icon={faTwitter} />
              </button>
            </div>

            <span>or use your account</span>

            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              className="form-control my-2"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
            />

            <Link to="/forgot" className="forgot-password">
              Forgot your password?
            </Link>

            <button
              className="btn btn-outline-danger"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="overlay-title">Welcome Back!</h1>
              <p className="overlay-description">
                To keep connected with us please login with your personal info
              </p>
              <button className="btn btn-outline-ghost" onClick={handleToggle}>
                Sign In
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <h1 className="overlay-title">Hello, Friend!</h1>
              <p className="overlay-description">
                Enter your personal details and start journey with us
              </p>
              <button className="btn btn-outline-ghost" onClick={handleToggle}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default Login;
