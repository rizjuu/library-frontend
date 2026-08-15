import { Library, Sparkles } from "lucide-react";

function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Library size={18} color="var(--bright-violet)" />
          <span style={{ color: "#FFFFFF", fontWeight: 700 }}>Library Management System</span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} color="var(--cyan)" />
          <span>Powered by React + Vite + MongoDB</span>
        </div>

        <div>
          <span>Crafted for Modern Library Circulation</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
