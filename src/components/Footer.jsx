import { Library, Sparkles } from "lucide-react";

function Footer() {
  return (
    <footer className="footer-centered">
      <div className="footer-glass-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Library size={18} />
          <span style={{ fontWeight: 800 }}>Library Hub</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} />
          <span>Vibrant Glassmorphism Design</span>
        </div>

        <div>
          <span>React + Vite + MongoDB</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
