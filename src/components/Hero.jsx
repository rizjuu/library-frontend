import { BookOpen, Sparkles, ArrowRight, RefreshCw, BookmarkCheck } from "lucide-react";

function Hero({ onNavigate }) {
  return (
    <header className="hero-section">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="hero-content-wrapper">
        {/* Left Column */}
        <div className="hero-left">
          <div className="hero-eyebrow">
            <Sparkles size={14} />
            LIBRARY MANAGEMENT SYSTEM
          </div>

          <h1 className="hero-title">
            Manage Your Library <br />
            <span className="text-gradient-purple">Smarter &amp; Faster</span>
          </h1>

          <p className="hero-description">
            Organize books, track circulation, and manage library records from one modern platform.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={() => onNavigate("books")}>
              <BookOpen size={18} />
              Browse Books
              <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" onClick={() => onNavigate("circulation")}>
              <RefreshCw size={18} />
              Manage Circulation
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="hero-right">
          <div className="hero-illustration-wrapper">
            <div className="hero-icon-container">
              <BookOpen size={40} />
            </div>

            <div className="hero-floating-card hero-floating-card-1">
              <BookmarkCheck size={20} color="#34D399" />
              <div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>Status</div>
                <div style={{ fontSize: "14px", color: "#FFFFFF", fontWeight: 800 }}>Database Online</div>
              </div>
            </div>

            <div className="hero-floating-card hero-floating-card-2">
              <Sparkles size={20} color="#22D3EE" />
              <div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>System</div>
                <div style={{ fontSize: "14px", color: "#FFFFFF", fontWeight: 800 }}>Real-time Catalog</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;
