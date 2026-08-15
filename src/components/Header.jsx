import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="top-header">
      <div className="header-search">
        <Search size={16} className="header-search-icon" />
        <input
          type="text"
          className="header-search-input"
          placeholder="Find any book, author, or barcode..."
        />
      </div>

      <div className="header-right">
        <button className="btn-icon-only" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="header-avatar">JH</div>
          <div className="header-user-info">
            <span className="header-user-name">Jeoriz H.</span>
            <span className="header-user-role">Librarian</span>
          </div>
        </div>
      </div>
    </header>
  );
}
