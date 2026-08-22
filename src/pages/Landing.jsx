import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      const dest =
        user.role === "admin"
          ? "/admin"
          : user.role === "staff"
            ? "/staff"
            : "/patron";
      navigate(dest);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="landing-container">
      {/* HEADER / NAVIGATION */}
      <header className="landing-header">
        <div className="landing-brand">
          <span className="brand-logo-icon">📚</span>
          <div className="brand-text">
            <span className="brand-sub">MISAMIS ORIENTAL</span>
            <span className="brand-title">Provincial Capitol Public Library</span>
          </div>
        </div>

        <nav className="landing-nav">
          <a href="#about" className="nav-link">About</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#hours" className="nav-link">Hours & Location</a>
          {user ? (
            <button className="nav-btn primary" onClick={handleGetStarted}>
              Go to Dashboard ({user.role})
            </button>
          ) : (
            <Link to="/login" className="nav-btn primary">
              Sign In
            </Link>
          )}
        </nav>
      </header>

      {/* HERO SECTION WITH LIBRARY.JPG */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <img
          src="/library.jpg"
          alt="Misamis Oriental Provincial Capitol Public Library"
          className="hero-bg-img"
        />
        <div className="hero-content-wrapper">
          <div className="hero-badge">
            🏛️ Official Public Library Portal
          </div>
          <h1 className="hero-title">
            Knowledge, <span className="highlight">Organized.</span>
          </h1>
          <p className="hero-subtitle">
            Welcome to the Misamis Oriental Provincial Capitol Public Library.
            Discover over 12,000+ titles, manage loans, and access our modern catalog online.
          </p>
          <div className="hero-actions">
            {user ? (
              <button onClick={handleGetStarted} className="btn-hero btn-primary">
                Open Dashboard
              </button>
            ) : (
              <>
                <Link to="/login?tab=patron" className="btn-hero btn-primary">
                  Patron Access (Email Sign-In)
                </Link>
                <Link to="/login?tab=staff" className="btn-hero btn-secondary">
                  Staff / Admin Sign-In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="stats-strip">
        <div className="stat-card">
          <span className="stat-number">12,000+</span>
          <span className="stat-label">Books & Publications</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Digital Catalog Access</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">Instant</span>
          <span className="stat-label">Magic Link Authentication</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">SMS</span>
          <span className="stat-label">Automated Notifications</span>
        </div>
      </section>

      {/* ABOUT & FEATURES */}
      <section id="features" className="features-section">
        <h2 className="section-title">Designed for Modern Library Services</h2>
        <p className="section-desc">
          Seamless authentication, cataloging, barcode scanning, and circulation management for staff and patrons.
        </p>

        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">✉️</div>
            <h3>Passwordless Patron Access</h3>
            <p>
              Patrons log in securely using passwordless email magic links sent straight to their email inbox — fast, secure, and hassle-free.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🔐</div>
            <h3>Role-Based Dashboard</h3>
            <p>
              Dedicated workspaces for Administrators, Library Staff, and Patrons with specific view and management privileges.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-icon">📖</div>
            <h3>Comprehensive Catalog</h3>
            <p>
              Browse titles, view real-time availability status, and track borrowed books effortlessly.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <h3>Barcode & SMS Integration</h3>
            <p>
              Fast barcode scanning for staff circulation and automated SMS due date reminders for patrons.
            </p>
          </div>
        </div>
      </section>

      {/* HOURS & LOCATION */}
      <section id="hours" className="info-section">
        <div className="info-card">
          <h3>🕒 Operating Hours</h3>
          <p><strong>Monday – Friday:</strong> 8:00 AM – 5:00 PM</p>
          <p><strong>Saturday – Sunday:</strong> Closed</p>
          <p><strong>Public Holidays:</strong> Closed</p>
        </div>

        <div className="info-card">
          <h3>📍 Location & Contact</h3>
          <p><strong>Address:</strong> Provincial Capitol Compound, Cagayan de Oro City, Misamis Oriental</p>
          <p><strong>Email:</strong> library@misamisoriental.gov.ph</p>
          <p><strong>Phone:</strong> (088) 856-1234</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p>© 2026 Misamis Oriental Provincial Capitol Public Library. All rights reserved.</p>
          <p className="footer-sub">Web-Based Library Management System · Capstone Project</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
