import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";
import "./Login.css";

function Login({ overlay = false }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login } = useAuth();

  const closeLogin = () => navigate("/", { replace: true });

  const initialTab = searchParams.get("tab") || "patron";
  const [mode, setMode] = useState(initialTab);

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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordLogin = async (e, expectedRole) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username,
        password
      });

      const { token, user: loggedUser } = response.data;

      if (expectedRole && loggedUser.role !== expectedRole) {
        setError(`This account is registered as ${loggedUser.role}. Please switch to the ${loggedUser.role.toUpperCase()} tab.`);
        setLoading(false);
        return;
      }

      login(loggedUser, token, rememberMe);

      if (loggedUser.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (loggedUser.role === "staff") {
        navigate("/staff", { replace: true });
      } else {
        navigate("/patron", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Authentication failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/google-login", {
        credential: credentialResponse.credential
      });

      const { token, user: loggedUser } = response.data;
      login(loggedUser, token, true);
      navigate("/patron", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Google sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in was cancelled or failed. Please try again.");
  };

  return (
    <div
      className={`login-page${overlay ? " login-overlay" : ""}`}
      role={overlay ? "dialog" : undefined}
      aria-modal={overlay ? "true" : undefined}
      aria-label={overlay ? "Library sign in" : undefined}
      onClick={overlay ? closeLogin : undefined}
    >
      <div className="login-modal" onClick={(event) => event.stopPropagation()}>
        {/* Left Banner */}
        <div className="login-left">
        <Link to="/" className="library-brand-link">
          <div className="library-brand">
            <img
              src="/logo.png"
              alt="Misamis Oriental Provincial Capitol Public Library logo"
              className="brand-icon"
            />
            <div>
              <small>MISAMIS ORIENTAL</small>
              <strong>Provincial Capitol Public Library</strong>
            </div>
          </div>
        </Link>

        <div className="hero-content">
          <h1>
            Knowledge,
            <br />
            <span>organized.</span>
          </h1>
          <p>
            Modern library management with passwordless patron access, barcode scanning,
            and SMS notifications — designed for your library.
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
            <span>✉️</span>
            <strong>Gmail Login</strong>
          </div>
        </div>

        <div className="copyright">
          <Link to="/" style={{ color: "#94a3b8", textDecoration: "underline", marginRight: "1rem" }}>
            ← Back to Landing Page
          </Link>
          © 2026 MOPL · Capstone Project
        </div>
        </div>

        {/* Right Login Form */}
        <div className="login-right">
          {overlay && (
            <button
              type="button"
              className="login-close-button"
              onClick={closeLogin}
              aria-label="Close sign in"
              title="Close sign in"
            >
              <X size={20} />
            </button>
          )}
          <div className="login-container">
          <h2>Library Sign In</h2>
          <p className="login-description">
            Select your account type to access the Misamis Oriental Provincial Capitol Public Library System.
          </p>

          {/* Role Navigation Tabs */}
          <div className="login-tabs">
            <button
              className={mode === "patron" ? "active" : ""}
              onClick={() => {
                setMode("patron");
                setError("");
              }}
            >
              Patron (Gmail)
            </button>
            <button
              className={mode === "staff" ? "active" : ""}
              onClick={() => {
                setMode("staff");
                setError("");
              }}
            >
              Staff
            </button>
            <button
              className={mode === "admin" ? "active" : ""}
              onClick={() => {
                setMode("admin");
                setError("");
              }}
            >
              Admin
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

          {/* PATRON TAB — Google OAuth */}
          {mode === "patron" && (
            <div className="patron-google-section">
              <div className="google-intro">
                <div className="google-intro-icon">📚</div>
                <h3>Welcome, Patron!</h3>
                <p>
                  Sign in with your Gmail account to access the library catalog,
                  check book availability, and manage your borrowing history.
                </p>
              </div>

              <div className="google-button-wrapper">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  size="large"
                  width="380"
                  text="continue_with"
                  shape="rectangular"
                  logo_alignment="left"
                  theme="outline"
                />
              </div>

              {loading && (
                <p className="google-loading-text">Signing you in...</p>
              )}

              <p className="field-hint" style={{ textAlign: "center", marginTop: "16px" }}>
                Your Gmail account will be used to create your patron profile automatically.
                No password needed.
              </p>
            </div>
          )}

          {/* STAFF TAB */}
          {mode === "staff" && (
            <form onSubmit={(e) => handlePasswordLogin(e, "staff")}>
              <label>Staff Username</label>
              <input
                type="text"
                placeholder="staff"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>

              <div className="login-options">
                <label className="remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="signin-button"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in as Staff"}
              </button>
            </form>
          )}

          {/* ADMIN TAB */}
          {mode === "admin" && (
            <form onSubmit={(e) => handlePasswordLogin(e, "admin")}>
              <label>Admin Username</label>
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>

              <div className="login-options">
                <label className="remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="signin-button admin-button"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in as Admin"}
              </button>
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;