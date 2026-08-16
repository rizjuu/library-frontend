import {
  Home,
  BookOpen,
  Repeat,
  BarChart3,
  ShieldCheck,
  User,
  QrCode,
  Library,
  X,
} from "lucide-react";

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose }) {
  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "books", label: "Catalog", icon: BookOpen },
    { id: "circulation", label: "Circulation", icon: Repeat },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "admin", label: "Admin", icon: ShieldCheck },
    { id: "my-info", label: "My Info", icon: User },
    { id: "add-book", label: "Generate Barcode", icon: QrCode },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "mobile-open" : ""}`}>
      {/* Brand Header */}
      <div className="sidebar-header-brand">
        <div className="sidebar-logo-icon" title="MOPL Library System">
          <Library size={22} className="w-5 h-5" />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-title">MOPL</span>
          <span className="sidebar-brand-name">Library System</span>
        </div>
        {isOpen && (
          <button
            type="button"
            className="btn-icon-only"
            onClick={onClose}
            style={{ marginLeft: "auto", width: "32px", height: "32px" }}
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation items */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (activeTab === "add-book" && item.id === "add-book");

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-btn ${isActive ? "active" : ""}`}
              onClick={() => onTabChange(item.id)}
              title={item.label}
              aria-label={item.label}
            >
              <span className="sidebar-btn-icon">
                <Icon size={20} className="w-5 h-5" />
              </span>
              <span className="sidebar-btn-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-divider" />

      {/* User profile footer info */}
      <div className="sidebar-footer-info">
        <div className="sidebar-user-avatar">DR</div>
        <div className="sidebar-user-details">
          <span className="sidebar-user-name">Dr. Rosa Aquino</span>
          <span className="sidebar-user-role">Administrator</span>
        </div>
      </div>
    </aside>
  );
}
