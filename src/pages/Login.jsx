import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (!user) return;

    const dashboardRoute =
      user.role === "admin"
        ? "/admin"
        : user.role === "staff"
          ? "/staff"
          : "/patron";

    navigate(dashboardRoute, { replace: true });
  }, [user, navigate]);

  const [mode, setMode] = useState("staff");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);


  const handleStaffLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          username,
          password
        }
      );

      const { token, user } = response.data;

      login(user, token, rememberMe);

      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/staff", { replace: true });
      }

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };


  const handlePatronLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/patron-login",
        {
          email
        }
      );

      const { token, user } = response.data;

      login(user, token, true);

      navigate("/patron", { replace: true });

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">

      <div className="login-left">

        <div className="library-brand">
          <div className="brand-icon">
            📚
          </div>

          <div>
            <small>
              MISAMIS ORIENTAL
            </small>

            <strong>
              Provincial Capitol Public Library
            </strong>
          </div>
        </div>


        <div className="hero-content">

          <h1>
            Knowledge,
            <br />
            <span>organized.</span>
          </h1>

          <p>
            Modern library management with
            barcode scanning and SMS
            notifications — designed for
            the way your library actually works.
          </p>

        </div>


        <div className="features">

          <div className="feature-card">
            <span>📖</span>
            <strong>12K+ Titles</strong>
          </div>

          <div className="feature-card">
            <span>▣</span>
            <strong>Barcode Ready</strong>
          </div>

          <div className="feature-card">
            <span>▢</span>
            <strong>SMS Alerts</strong>
          </div>

        </div>


        <div className="copyright">
          © 2026 MOPL · Capstone Prototype
        </div>

      </div>


      <div className="login-right">

        <div className="login-container">

          <h2>Sign in</h2>

          <p className="login-description">
            Web-Based Library Management System
            with Barcode Scanning and SMS
            Notification.
          </p>


          <div className="login-tabs">

            <button
              className={
                mode === "staff"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setMode("staff");
                setError("");
              }}
            >
              Admin / Staff
            </button>

            <button
              className={
                mode === "patron"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setMode("patron");
                setError("");
              }}
            >
              Patron
            </button>

          </div>


          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          {mode === "staff" ? (

            <form
              onSubmit={handleStaffLogin}
            >

              <label>
                Username
              </label>

              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                required
              />


              <label>
                Password
              </label>

              <div className="password-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "◉"
                    : "◌"}
                </button>

              </div>


              <div className="login-options">

                <label className="remember">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                  />

                  Remember me

                </label>


                <button
                  type="button"
                  className="forgot"
                >
                  Forgot password?
                </button>

              </div>


              <button
                type="submit"
                className="signin-button"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </button>

            </form>

          ) : (

            <form
              onSubmit={handlePatronLogin}
            >

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="patron@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
              />


              <button
                type="submit"
                className="signin-button patron-button"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </button>

            </form>

          )}

        </div>

      </div>

    </div>
  );
}

export default Login;