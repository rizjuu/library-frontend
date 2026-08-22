import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login } = useAuth();

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
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [devMagicLink, setDevMagicLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordLogin = async (e, expectedRole) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
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

  const handlePatronEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setDevMagicLink("");
    setLoading(true);

    try {
      const response = await api.post("/auth/patron-request-link", {
        email
      });

      setSuccessMsg(
        response.data?.message ||
        `Magic login link sent to ${email}! Please check your email inbox.`
      );

      if (response.data?.magicLink) {
        setDevMagicLink(response.data.magicLink);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to send email login link. Please check your email address."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Banner */}
      <div className="login-left">
        <Link to="/" className="library-brand-link">
          <div className="library-brand">
            <div className="brand-icon">📚</div>
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
            <strong>Email Login</strong>
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
                setSuccessMsg("");
              }}
            >
              Patron (Email)
            </button>
            <button
              className={mode === "staff" ? "active" : ""}
              onClick={() => {
                setMode("staff");
                setError("");
                setSuccessMsg("");
              }}
            >
              Staff
            </button>
            <button
              className={mode === "admin" ? "active" : ""}
              onClick={() => {
                setMode("admin");
                setError("");
                setSuccessMsg("");
              }}
            >
              Admin
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}
          {successMsg && (
            <div className="login-success">
              <p>✉️ {successMsg}</p>
              {devMagicLink && (
                <div style={{ marginTop: "10px" }}>
                  <small style={{ display: "block", marginBottom: "5px", color: "#64748b" }}>
                    [Development Preview Link]:
                  </small>
                  <a
                    href={devMagicLink}
                    className="direct-link-btn"
                    style={{
                      display: "inline-block",
                      padding: "8px 14px",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontWeight: "bold",
                      fontSize: "0.85rem"
                    }}
                  >
                    🚀 Open Magic Link & Redirect to Patron/Home
                  </a>
                </div>
              )}
            </div>
          )}

          {/* PATRON TAB */}
          {mode === "patron" && (
            <form onSubmit={handlePatronEmailLogin}>
              <label>Patron Email Address</label>
              <input
                type="email"
                placeholder="patron@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="field-hint">
                Enter your email address. We will send a secure login link directly to your email inbox. New emails will be saved automatically.
              </p>

              <button
                type="submit"
                className="signin-button patron-button"
                disabled={loading}
              >
                {loading ? "Sending Email Link..." : "Send Email Login Link ✉️"}
              </button>
            </form>
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
  );
}

export default Login;