import { useState, useRef, useEffect } from "react";
import { Search, Bell, Sun, Moon, Menu, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header({
  theme = "light",
  onToggleTheme = () => {},
  onToggleMobileMenu = () => {},
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Helper to generate avatar initials
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = user?.name || "Library User";
  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Member";

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          type="button"
          className="header-mobile-toggle"
          onClick={onToggleMobileMenu}
          aria-label="Toggle Mobile Menu"
        >
          <Menu size={20} className="w-5 h-5" />
        </button>

        <div className="header-search">
          <Search size={20} className="header-search-icon w-5 h-5" />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search books, patrons, transactions..."
          />
        </div>
      </div>

      <div className="header-right">
        {/* Date and Time Indicator */}
        <div className="header-clock">
          <span className="header-clock-date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="header-clock-time">
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Theme Mode Switcher */}
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
          aria-label="Toggle theme mode"
        >
          {theme === "light" ? (
            <Moon size={20} className="w-5 h-5" />
          ) : (
            <Sun size={20} className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="btn-icon-only"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={20} className="w-5 h-5" />
          <span className="notification-badge" />
        </button>

        {/* User Profile Dropdown */}
        <div className="user-dropdown-container" ref={dropdownRef} style={{ position: "relative" }}>
          <div
            className="header-user-profile"
            title={`${displayName} (${displayRole})`}
            onClick={() => setDropdownOpen((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            <div className="header-avatar">{getInitials(displayName)}</div>
            <div className="header-user-info">
              <span className="header-user-name">{displayName}</span>
              <span className="header-user-role">{displayRole}</span>
            </div>
            <ChevronDown size={16} style={{ color: "var(--text-muted)", marginLeft: "4px" }} />
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "200px",
                background: "var(--bg-surface, #ffffff)",
                border: "1px solid var(--border, #e2e8f0)",
                borderRadius: "var(--radius-xl, 12px)",
                boxShadow: "var(--shadow-lg, 0 10px 25px -5px rgba(0,0,0,0.1))",
                padding: "8px",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid var(--border-subtle, #f1f5f9)",
                  marginBottom: "4px",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-primary, #0f172a)", margin: 0 }}>
                  {displayName}
                </p>
                <p style={{ fontSize: "11px", color: "var(--text-muted, #64748b)", margin: "2px 0 0" }}>
                  {user?.email || user?.username || displayRole}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  border: "none",
                  borderRadius: "var(--radius-lg, 8px)",
                  background: "transparent",
                  color: "var(--color-destructive, #ef4444)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-destructive-bg, #fef2f2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
