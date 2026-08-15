import { LayoutDashboard, BookOpen, Repeat, PlusCircle, Settings, Library } from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'circulation', label: 'Circulation', icon: Repeat },
    { id: 'add-book', label: 'Add Book', icon: PlusCircle },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" title="Library Management">
        <Library size={22} />
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-btn ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
              title={item.label}
              aria-label={item.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </nav>

      <div className="sidebar-divider" />

      <button
        type="button"
        className={`sidebar-btn ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => onTabChange && onTabChange('settings')}
        title="Settings"
        aria-label="Settings"
      >
        <Settings size={20} />
      </button>
    </aside>
  );
}
