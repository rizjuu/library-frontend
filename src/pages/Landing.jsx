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
          <img
            src="/logo.png"
            alt="Misamis Oriental Provincial Capitol Public Library logo"
            className="brand-logo-icon"
          />
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
          <div style={{ marginTop: "1.5rem", borderTop: "1px solid #334155", paddingTop: "1rem" }}>
            <p><strong>📞 Contact:</strong> (088) 856-1234</p>
            <p><strong>✉️ Email:</strong> library@misamisoriental.gov.ph</p>
          </div>
        </div>

        <div className="info-card map-card">
          <div className="map-header">
            <h3>📍 Location & Map Preview</h3>
            <a
              href="https://www.google.com/maps/place/PROVINCIAL+LIBRARY/@8.484496,124.6441278,17z/data=!4m10!1m2!2m1!1smisamis+oriental+provincial+library!3m6!1s0x32fff2dc40f3d94b:0xe5ddb14891de208b!8m2!3d8.4845139!4d124.6486059!15sCiNtaXNhbWlzIG9yaWVudGFsIHByb3ZpbmNpYWwgbGlicmFyeZIBEWdvdmVybm1lbnRfb2ZmaWNl4AEA!16s%2Fg%2F1pzph3c94?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="open-map-link"
            >
              Open in Google Maps ↗
            </a>
          </div>
          <p className="map-address">
            Provincial Capitol Compound, Velez St., Cagayan de Oro City, Misamis Oriental
          </p>
          <div className="map-iframe-wrapper">
            <iframe
              title="Misamis Oriental Provincial Library Google Map Location"
              src="https://maps.google.com/maps?q=8.4845139,124.6486059+(Provincial+Library+Misamis+Oriental)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
              width="100%"
              height="260"
              style={{ border: 0, borderRadius: "10px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
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
