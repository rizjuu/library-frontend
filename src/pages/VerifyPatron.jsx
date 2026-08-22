import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function VerifyPatron() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("No authentication token was found in the link.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function verifyToken() {
      try {
        const response = await api.get(`/auth/verify-patron-token?token=${token}`);
        const { token: sessionToken, user } = response.data;

        if (isMounted) {
          login(user, sessionToken, true);
          // Redirect immediately to Patron/Home
          navigate("/patron", { replace: true });
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
            "Authentication link is invalid or expired. Please request a new link."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token, login, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        color: "#f8fafc",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: "450px",
          width: "100%",
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "16px",
          padding: "36px 28px",
          textAlign: "center",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)"
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>📚</div>
        <h2 style={{ fontSize: "22px", marginBottom: "8px", color: "#ffffff" }}>
          Misamis Oriental Public Library
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px" }}>
          Patron Authentication Portal
        </p>

        {loading && (
          <div style={{ padding: "20px 0" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid rgba(56, 189, 248, 0.2)",
                borderTop: "4px solid #38bdf8",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px auto"
              }}
            ></div>
            <p style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: "500" }}>
              Verifying your magic login link...
            </p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {!loading && error && (
          <div>
            <div
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(248, 113, 113, 0.4)",
                color: "#fca5a5",
                padding: "16px",
                borderRadius: "10px",
                fontSize: "14px",
                marginBottom: "24px",
                textAlign: "left"
              }}
            >
              ⚠️ {error}
            </div>

            <Link
              to="/login?tab=patron"
              style={{
                display: "inline-block",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
                transition: "background-color 0.2s"
              }}
            >
              Request New Email Login Link
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyPatron;
