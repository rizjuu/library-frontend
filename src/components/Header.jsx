import { Search, Bell, Sun, Moon, Menu, ChevronDown } from "lucide-react";

export default function Header({
  theme = "light",
  onToggleTheme = () => {},
  onToggleMobileMenu = () => {},
}) {
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
          <span className="header-clock-date">Sun, Aug 16</span>
          <span className="header-clock-time">10:50 AM</span>
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
        <div className="header-user-profile" title="Dr. Rosa Aquino (Admin)">
          <div className="header-avatar">DR</div>
          <div className="header-user-info">
            <span className="header-user-name">Dr. Rosa Aquino</span>
            <span className="header-user-role">Admin</span>
          </div>
          <ChevronDown size={16} style={{ color: "var(--text-muted)", marginLeft: "4px" }} />
        </div>
      </div>
    </header>
  );
}
