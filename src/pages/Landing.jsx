import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  Search,
  MapPin,
  Clock,
  Phone,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Maximize2,
  Play,
  ArrowRight,
  ShieldCheck,
  FileText,
  UserCheck,
} from "lucide-react";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeCategory, setActiveCategory] = useState("everything");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewIndex, setPreviewIndex] = useState(null);

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

  // Gallery Photos Array - ALL picture frames use /library.jpg as requested
  const galleryPhotos = [
    {
      id: 1,
      title: "Main Reading Hall",
      sub: "Spacious study tables & quiet reading environment",
      src: "/library.jpg",
    },
    {
      id: 2,
      title: "Filipiniana Archives",
      sub: "Historical documents & Misamis Oriental regional literature",
      src: "/library.jpg",
    },
    {
      id: 3,
      title: "Children's Learning Corner",
      sub: "Interactive storybooks & early literacy section",
      src: "/library.jpg",
    },
    {
      id: 4,
      title: "Digital Research Hub",
      sub: "High-speed internet workstations & e-catalog terminals",
      src: "/library.jpg",
    },
    {
      id: 5,
      title: "Quiet Study Alcoves",
      sub: "Individual focus desks for academic research",
      src: "/library.jpg",
    },
    {
      id: 6,
      title: "Periodicals & Journals Section",
      sub: "Daily local newspapers & academic publications",
      src: "/library.jpg",
    },
  ];

  const handlePrevImage = useCallback(() => {
    setPreviewIndex((prev) =>
      prev === null ? 0 : (prev - 1 + galleryPhotos.length) % galleryPhotos.length
    );
  }, [galleryPhotos.length]);

  const handleNextImage = useCallback(() => {
    setPreviewIndex((prev) =>
      prev === null ? 0 : (prev + 1) % galleryPhotos.length
    );
  }, [galleryPhotos.length]);

  // Keyboard navigation for image lightbox preview
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (previewIndex === null) return;
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "Escape") setPreviewIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewIndex, handlePrevImage, handleNextImage]);

  const categories = [
    { id: "everything", label: "Everything" },
    { id: "fiction", label: "Fiction & Literature" },
    { id: "history", label: "History & Culture" },
    { id: "science", label: "Science & Tech" },
    { id: "filipiniana", label: "Filipiniana" },
    { id: "children", label: "Children's Corner" },
  ];

  return (
    <div className="landing-container">
      {/* GLASS HEADER NAVIGATION */}
      <header className="landing-header">
        <a href="#top" className="landing-brand">
          <div className="brand-logo-box">
            <img
              src="/logo.png"
              alt="Misamis Oriental Provincial Capitol Public Library Logo"
              className="brand-logo-icon"
            />
          </div>
          <div className="brand-text">
            <span className="brand-sub">MISAMIS ORIENTAL</span>
            <span className="brand-title">Provincial Capitol Public Library</span>
          </div>
        </a>

        <div className="landing-nav-links">
          <a href="#hero" className="nav-link-item">Home</a>
          <a href="#directory" className="nav-link-item">Catalog Directory</a>
          <a href="#gallery" className="nav-link-item">Photo Gallery</a>
          <a href="#facilities" className="nav-link-item">Facilities</a>
          <a href="#location" className="nav-link-item">Location &amp; Hours</a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="header-status-badge">
            <span className="ping-dot"></span>
            Library is Open: 8:00 AM - 5:00 PM
          </div>

          {user ? (
            <button className="nav-btn-signin" onClick={handleGetStarted}>
              <UserCheck size={16} />
              Go to Dashboard ({user.role})
            </button>
          ) : (
            <Link to="/login" className="nav-btn-signin">
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="hero-section">
        <div className="hero-wrapper">
          <div className="hero-text-side">
            <div className="hero-eyebrow-pill">
              <Sparkles size={14} />
              Official Public Library Portal
            </div>

            <h1 className="hero-title-main">
              Elevate Your Knowledge. <span>Discover, Learn, &amp; Grow.</span>
            </h1>

            <p className="hero-desc-main">
              Welcome to the Misamis Oriental Provincial Capitol Public Library. Explore over 12,000+ titles, Filipiniana archives, digital e-resources, and modern circulation services.
            </p>

            <div className="hero-cta-group">
              {user ? (
                <button onClick={handleGetStarted} className="btn-cta-primary">
                  Open Dashboard
                  <ArrowRight size={18} />
                </button>
              ) : (
                <>
                  <Link to="/login?tab=patron" className="btn-cta-primary">
                    Patron Access
                    <ArrowRight size={18} />
                  </Link>
                  <Link to="/login?tab=staff" className="btn-cta-secondary">
                    Staff / Admin Sign-In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Featured Visual Frame with library.jpg */}
          <div className="hero-visual-frame">
            <img
              src="/library.jpg"
              alt="Misamis Oriental Provincial Capitol Public Library"
              className="hero-visual-img"
            />
            <div className="hero-visual-overlay">
              <div className="hero-visual-badge">
                <div className="play-button-icon" onClick={() => setPreviewIndex(0)} title="Click to view gallery">
                  <Play size={20} style={{ marginLeft: "2px" }} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800 }}>MOPL Library Showcase</div>
                  <div style={{ fontSize: "11px", color: "#cbd5e1" }}>Public Knowledge Center</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION - Magic Link box removed per request */}
      <section className="stats-section">
        <div className="stats-grid-container">
          <div className="stat-item-box">
            <span className="stat-number-text">12,000+</span>
            <span className="stat-label-text">Books &amp; Publications</span>
          </div>
          <div className="stat-item-box">
            <span className="stat-number-text">24/7</span>
            <span className="stat-label-text">Digital Catalog Access</span>
          </div>
          <div className="stat-item-box">
            <span className="stat-number-text">SMS</span>
            <span className="stat-label-text">Automated Due Alerts</span>
          </div>
        </div>
      </section>

      {/* COLLECTION DIRECTORY SECTION */}
      <section id="directory" className="directory-section">
        <div className="section-header-block">
          <div>
            <span className="section-eyebrow">Public Collection</span>
            <h2 className="section-main-title">
              Library <span>Directory.</span>
            </h2>
          </div>

          <div className="toolbar-search" style={{ width: "340px", position: "relative" }}>
            <Search size={18} className="toolbar-search-icon" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              className="toolbar-search-input"
              style={{ width: "100%", height: "46px", paddingLeft: "42px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px" }}
              placeholder="Search books, authors, or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-pill-btn ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* PHOTO GALLERY PICTURE FRAMES SECTION */}
      <section id="gallery" className="gallery-section">
        <div className="section-header-block">
          <div>
            <span className="section-eyebrow">Visual Tour</span>
            <h2 className="section-main-title">
              Photo <span>Gallery.</span>
            </h2>
          </div>
          <p style={{ color: "#64748b", fontSize: "14px", maxWidth: "420px" }}>
            Click on any picture frame below to preview full-screen and navigate through library photos.
          </p>
        </div>

        <div className="picture-frames-grid">
          {galleryPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              className="picture-frame-card"
              onClick={() => setPreviewIndex(idx)}
              title="Click to view picture preview"
            >
              <div className="picture-frame-img-box">
                <img src={photo.src} alt={photo.title} className="picture-frame-img" />
              </div>
              <div className="picture-frame-caption-bar">
                <div>
                  <div className="picture-frame-title">{photo.title}</div>
                  <div className="picture-frame-sub">{photo.sub}</div>
                </div>
                <div className="zoom-icon-badge">
                  <Maximize2 size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX PREVIEW MODAL WITH PREV / NEXT */}
      {previewIndex !== null && (
        <div className="lightbox-modal-backdrop" onClick={() => setPreviewIndex(null)}>
          <div className="lightbox-modal-container" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="lightbox-modal-header">
              <div className="lightbox-modal-title-wrap">
                <span className="lightbox-modal-counter">
                  Picture {previewIndex + 1} of {galleryPhotos.length}
                </span>
                <span className="lightbox-modal-title">
                  {galleryPhotos[previewIndex].title}
                </span>
              </div>
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setPreviewIndex(null)}
                title="Close preview (Esc)"
              >
                <X size={20} />
              </button>
            </div>

            {/* Stage */}
            <div className="lightbox-image-stage">
              <button
                type="button"
                className="lightbox-nav-btn prev"
                onClick={handlePrevImage}
                title="Previous picture (Left Arrow)"
              >
                <ChevronLeft size={28} />
              </button>

              <img
                src={galleryPhotos[previewIndex].src}
                alt={galleryPhotos[previewIndex].title}
                className="lightbox-img-element"
              />

              <button
                type="button"
                className="lightbox-nav-btn next"
                onClick={handleNextImage}
                title="Next picture (Right Arrow)"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Footer */}
            <div className="lightbox-modal-footer">
              <span className="lightbox-footer-text">
                {galleryPhotos[previewIndex].sub}
              </span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                Use Left / Right arrow keys to navigate
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FACILITIES SECTION */}
      <section id="facilities" className="facilities-section">
        <div className="section-header-block">
          <div>
            <span className="section-eyebrow">Public Amenities</span>
            <h2 className="section-main-title">
              Library <span>Facilities.</span>
            </h2>
          </div>
        </div>

        <div className="facilities-grid">
          <div className="facility-card">
            <div className="facility-icon-box">
              <BookOpen size={24} />
            </div>
            <div className="facility-title">Main Reading Space</div>
            <div className="facility-desc">
              Comfortable, well-lit seating areas designed for individual reading, student study groups, and research.
            </div>
          </div>

          <div className="facility-card">
            <div className="facility-icon-box">
              <FileText size={24} />
            </div>
            <div className="facility-title">Filipiniana &amp; Heritage Desk</div>
            <div className="facility-desc">
              Specialized collection of provincial records, regional history books, and local government documents.
            </div>
          </div>

          <div className="facility-card">
            <div className="facility-icon-box">
              <ShieldCheck size={24} />
            </div>
            <div className="facility-title">Digital Concierge &amp; E-Access</div>
            <div className="facility-desc">
              Free Wi-Fi terminals, digital catalog search stations, and automated circulation support.
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION & HOURS SECTION */}
      <section id="location" className="location-section">
        <div className="location-wrapper">
          <div className="location-info-block">
            <div>
              <span className="section-eyebrow">Visit Us</span>
              <h2 className="section-main-title">
                Prime Location. <span>Endless Access.</span>
              </h2>
            </div>

            <div className="info-row-item">
              <div className="info-icon-box">
                <MapPin size={22} />
              </div>
              <div className="info-row-text">
                <h4>Physical Address</h4>
                <p>Provincial Capitol Compound, Velez St., Cagayan de Oro City, Misamis Oriental, 9000, Philippines</p>
              </div>
            </div>

            <div className="info-row-item">
              <div className="info-icon-box">
                <Clock size={22} />
              </div>
              <div className="info-row-text">
                <h4>Operating Schedule</h4>
                <p>Monday – Friday: 8:00 AM – 5:00 PM (Closed on Saturdays, Sundays, and Public Holidays)</p>
              </div>
            </div>

            <div className="info-row-item">
              <div className="info-icon-box">
                <Phone size={22} />
              </div>
              <div className="info-row-text">
                <h4>Contact Details</h4>
                <p>Phone: (088) 856-1234 | Email: library@misamisoriental.gov.ph</p>
              </div>
            </div>
          </div>

          {/* Embedded Google Map Frame */}
          <div className="map-container-frame">
            <iframe
              title="Misamis Oriental Provincial Library Google Map Location"
              src="https://maps.google.com/maps?q=8.4845139,124.6486059+(Provincial+Library+Misamis+Oriental)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-col-brand">
            <h3>Misamis Oriental Public Library</h3>
            <p>
              The official Provincial Capitol Public Library of Misamis Oriental. Dedicated to serving citizens, students, and researchers with comprehensive physical and digital learning resources.
            </p>
          </div>

          <div className="footer-col">
            <h4>Operating Hours</h4>
            <p>Monday – Friday: 8:00 AM - 5:00 PM</p>
            <p>Weekends: Closed</p>
            <p>Digital Catalog: 24/7 Access</p>
          </div>

          <div className="footer-col">
            <h4>Contact Library</h4>
            <p>Capitol Compound, Cagayan de Oro City</p>
            <p>(088) 856-1234</p>
            <p>library@misamisoriental.gov.ph</p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>© 2026 Misamis Oriental Provincial Capitol Public Library. All rights reserved.</span>
          <span>Web-Based Library Management System · Capstone Project</span>
        </div>
      </footer>
    </div>
  );
}
