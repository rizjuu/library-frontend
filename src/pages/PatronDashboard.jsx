import { useState, useEffect } from "react";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import Catalog from "./Catalog";
import {
  BookOpen,
  BookmarkCheck,
  Clock,
  CheckSquare,
  Search,
  User,
  History,
  Megaphone,
  Library,
  Menu,
  X,
  LogOut,
  Sparkles,
  Barcode,
  Calendar,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

function PatronDashboard() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const res = await api.get("/books");
      setBooks(res.data || []);
    } catch (err) {
      console.error("Failed to load books", err);
    } finally {
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const getInitials = (name) => {
    if (!name) return "P";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = user?.name || "Library Patron";
  const displayEmail = user?.email || "patron@example.com";

  // Sample Patron Loan Items
  const myBorrowedItems = [
    {
      id: "LN-501",
      barcode: "LIB-0012",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      borrowDate: "2026-08-10",
      dueDate: "2026-08-17",
      status: "active",
    },
    {
      id: "LN-502",
      barcode: "LIB-0045",
      title: "Data Structures & Algorithms",
      author: "Robert Lafore",
      borrowDate: "2026-08-12",
      dueDate: "2026-08-19",
      status: "active",
    },
  ];

  const categories = Array.from(
    new Set(books.map((b) => b.category).filter(Boolean))
  );

  const filteredCatalog = books.filter((book) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQ =
      !q ||
      (book.title && book.title.toLowerCase().includes(q)) ||
      (book.author && book.author.toLowerCase().includes(q)) ||
      (book.barcode && book.barcode.toLowerCase().includes(q));

    const matchesCat =
      categoryFilter === "all" ||
      (book.category && book.category.toLowerCase() === categoryFilter.toLowerCase());

    return matchesQ && matchesCat;
  });

  const navItems = [
    { id: "dashboard", label: "My Overview", icon: BookOpen },
    { id: "books", label: "Browse Catalog", icon: Search },
    { id: "my-loans", label: "My Borrowed Books", icon: BookmarkCheck },
    { id: "history", label: "Borrowing History", icon: History },
    { id: "my-info", label: "My Profile", icon: User },
  ];

  return (
    <div className="app-shell">
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />

      {/* Patron Sidebar */}
      <aside className={`sidebar ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header-brand">
          <div className="sidebar-logo-icon" title="MOPL Library System">
            <img src="/logo.png" alt="MOPL Library System logo" />
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title">MOPL</span>
            <span className="sidebar-brand-name">Patron Portal</span>
          </div>
          {mobileSidebarOpen && (
            <button
              type="button"
              className="btn-icon-only"
              onClick={() => setMobileSidebarOpen(false)}
              style={{ marginLeft: "auto", width: "32px", height: "32px" }}
              aria-label="Close Sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-btn ${isActive ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
              >
                <span className="sidebar-btn-icon">
                  <Icon size={20} />
                </span>
                <span className="sidebar-btn-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-divider" />

        <div className="sidebar-footer-info" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
            <div className="sidebar-user-avatar">{getInitials(displayName)}</div>
            <div className="sidebar-user-details" style={{ overflow: "hidden" }}>
              <span className="sidebar-user-name" style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {displayName}
              </span>
              <span className="sidebar-user-role">Patron</span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Sign Out"
            aria-label="Sign Out"
            style={{
              background: "transparent",
              border: "none",
              color: "oklch(0.75 0.03 255)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "var(--radius-md, 6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Top Header Bar */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleMobileMenu={() => setMobileSidebarOpen(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === "dashboard" && (
          <motion.div
            className="dashboard-shell"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="page-title-row">
              <div className="page-title-group">
                <span className="page-date-kicker">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </span>
                <h1 className="page-title">
                  Welcome back, {displayName} <span role="img" aria-label="waving hand">👋</span>
                </h1>
                <p className="page-subtitle">Track your active loans, due dates, and discover new books.</p>
              </div>
              <div className="page-title-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab("books")}
                >
                  <Search size={18} />
                  Explore Books
                </button>
              </div>
            </div>

            {/* Patron Stats Grid */}
            <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              <div className="stat-card primary">
                <div className="stat-card-top">
                  <span className="stat-label">MY ACTIVE LOANS</span>
                  <div className="stat-icon-box primary">
                    <BookmarkCheck size={24} />
                  </div>
                </div>
                <div className="stat-card-body">
                  <div className="stat-number">{myBorrowedItems.length}</div>
                  <div className="stat-change up"><span>Books checked out</span></div>
                </div>
              </div>

              <div className="stat-card success">
                <div className="stat-card-top">
                  <span className="stat-label">BOOKS RETURNED</span>
                  <div className="stat-icon-box success">
                    <CheckSquare size={24} />
                  </div>
                </div>
                <div className="stat-card-body">
                  <div className="stat-number">14</div>
                  <div className="stat-change up"><span>All-time total</span></div>
                </div>
              </div>

              <div className="stat-card info">
                <div className="stat-card-top">
                  <span className="stat-label">NEXT DUE DATE</span>
                  <div className="stat-icon-box info">
                    <Clock size={24} />
                  </div>
                </div>
                <div className="stat-card-body">
                  <div className="stat-number" style={{ fontSize: "1.5rem" }}>Aug 17</div>
                  <div className="stat-change neutral"><span>In 1 day</span></div>
                </div>
              </div>

              <div className="stat-card primary">
                <div className="stat-card-top">
                  <span className="stat-label">CATALOG AVAILABLE</span>
                  <div className="stat-icon-box primary">
                    <BookOpen size={24} />
                  </div>
                </div>
                <div className="stat-card-body">
                  <div className="stat-number">{books.length || 12847}</div>
                  <div className="stat-change up"><span>Ready to borrow</span></div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid-layout">
              {/* Left Column: Active Loans */}
              <div className="recent-transactions-card">
                <div className="card-header-row">
                  <div>
                    <h3 className="card-header-title">My Currently Borrowed Books</h3>
                    <p className="card-header-sub">Items currently checked out to your account</p>
                  </div>
                  <button
                    type="button"
                    className="btn-link-action"
                    onClick={() => setActiveTab("my-loans")}
                  >
                    View details
                  </button>
                </div>

                <div className="table-container">
                  <table className="ui-table">
                    <thead>
                      <tr>
                        <th>BARCODE</th>
                        <th>BOOK TITLE</th>
                        <th>AUTHOR</th>
                        <th>DUE DATE</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myBorrowedItems.map((item) => (
                        <tr key={item.id}>
                          <td><span className="id-chip">{item.barcode}</span></td>
                          <td className="book-title-cell">{item.title}</td>
                          <td>{item.author}</td>
                          <td>
                            <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                              {item.dueDate}
                            </span>
                          </td>
                          <td>
                            <span className="status-pill active">
                              <span className="status-pill-dot" />
                              Active Loan
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Library Announcements */}
              <div className="announcements-card">
                <div className="card-header-row" style={{ marginBottom: "12px" }}>
                  <h3 className="card-header-title">
                    <Megaphone size={20} style={{ color: "var(--color-primary)" }} />
                    Library Notices
                  </h3>
                </div>

                <div className="announcement-item">
                  <div className="announcement-title">Library Hours Extended</div>
                  <p className="announcement-desc">
                    The library is now open until 8:00 PM on weekdays for study and reading.
                  </p>
                  <span className="announcement-date">2026-08-01</span>
                </div>

                <div className="announcement-item">
                  <div className="announcement-title">Digital Library Services</div>
                  <p className="announcement-desc">
                    Ask staff at the desk about free SMS alerts for your due dates.
                  </p>
                  <span className="announcement-date">2026-08-10</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "books" && (
          <Catalog books={books} loading={loadingBooks} isPatronView={true} />
        )}



        {activeTab === "my-loans" && (
          <div className="dashboard-shell">
            <div className="page-title-row">
              <div>
                <h1 className="page-title">
                  <BookmarkCheck size={28} style={{ color: "var(--color-primary)" }} />
                  My Borrowed Books
                </h1>
                <p className="page-subtitle">Detailed list of items currently checked out to your account.</p>
              </div>
            </div>

            <div className="recent-transactions-card">
              <div className="table-container">
                <table className="ui-table">
                  <thead>
                    <tr>
                      <th>TRANSACTION ID</th>
                      <th>BARCODE</th>
                      <th>BOOK TITLE</th>
                      <th>AUTHOR</th>
                      <th>CHECKOUT DATE</th>
                      <th>DUE DATE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBorrowedItems.map((item) => (
                      <tr key={item.id}>
                        <td><span className="id-chip">{item.id}</span></td>
                        <td><span className="id-chip">{item.barcode}</span></td>
                        <td className="book-title-cell">{item.title}</td>
                        <td>{item.author}</td>
                        <td>{item.borrowDate}</td>
                        <td className="patron-cell" style={{ color: "var(--color-primary)" }}>{item.dueDate}</td>
                        <td>
                          <span className="status-pill active">
                            <span className="status-pill-dot" />
                            Active Loan
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="dashboard-shell">
            <div className="page-title-row">
              <div>
                <h1 className="page-title">
                  <History size={28} style={{ color: "var(--color-primary)" }} />
                  Borrowing History
                </h1>
                <p className="page-subtitle">Your past library checkouts and returns record.</p>
              </div>
            </div>

            <div className="recent-transactions-card">
              <div className="table-container">
                <table className="ui-table">
                  <thead>
                    <tr>
                      <th>BARCODE</th>
                      <th>BOOK TITLE</th>
                      <th>AUTHOR</th>
                      <th>RETURNED DATE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="id-chip">LIB-0005</span></td>
                      <td className="book-title-cell">The Great Gatsby</td>
                      <td>F. Scott Fitzgerald</td>
                      <td>2026-07-28</td>
                      <td>
                        <span className="status-pill returned">
                          <span className="status-pill-dot" />
                          Returned On Time
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td><span className="id-chip">LIB-0009</span></td>
                      <td className="book-title-cell">1984</td>
                      <td>George Orwell</td>
                      <td>2026-06-15</td>
                      <td>
                        <span className="status-pill returned">
                          <span className="status-pill-dot" />
                          Returned On Time
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "my-info" && (
          <div className="dashboard-shell">
            <div className="page-title-row">
              <div>
                <h1 className="page-title">My Patron Profile</h1>
                <p className="page-subtitle">Personal account details and card status.</p>
              </div>
            </div>

            <div className="addbook-wrapper">
              <div className="addbook-card">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="form-readonly">{displayName}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="form-readonly">{displayEmail}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Membership Status</label>
                  <div className="form-readonly" style={{ color: "var(--color-success)" }}>
                    Active Patron — Good Standing
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <div className="form-readonly">Patron / Library Reader</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="app-footer">
          <span>Misamis Oriental Provincial Capitol Public Library System</span>
          <span>Role: Patron | Member Services Active</span>
        </footer>
      </main>
    </div>
  );
}

export default PatronDashboard;