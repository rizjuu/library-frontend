import { useState, useEffect } from "react";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import Catalog from "./Catalog";
import Profile from "./Profile";
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
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [myLoans, setMyLoans] = useState([]);
  const [myHistory, setMyHistory] = useState([]);
  const [myStats, setMyStats] = useState({
    activeLoans: 0,
    returnedCount: 0,
    nextDueDate: null
  });
  const [loadingLoans, setLoadingLoans] = useState(true);

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

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error("Failed to load announcements", err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const fetchMyLoans = async () => {
    setLoadingLoans(true);
    try {
      const res = await api.get("/transactions/my-loans");
      setMyLoans(res.data || []);
    } catch (err) {
      console.error("Failed to load my loans", err);
    } finally {
      setLoadingLoans(false);
    }
  };

  const fetchMyHistory = async () => {
    try {
      const res = await api.get("/transactions/my-history");
      setMyHistory(res.data || []);
    } catch (err) {
      console.error("Failed to load my history", err);
    }
  };

  const fetchMyStats = async () => {
    try {
      const res = await api.get("/transactions/my-stats");
      setMyStats({
        activeLoans: res.data.activeLoans || 0,
        returnedCount: res.data.returnedCount || 0,
        nextDueDate: res.data.nextDueDate || null
      });
    } catch (err) {
      console.error("Failed to load my stats", err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchAnnouncements();
    fetchMyLoans();
    fetchMyHistory();
    fetchMyStats();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getDueStatus = (dueDate) => {
    if (!dueDate) return { label: "Active Loan", cls: "active" };
    const days = Math.ceil((new Date(dueDate) - new Date()) / 86400000);
    if (days < 0) return { label: `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`, cls: "overdue" };
    if (days === 0) return { label: "Due Today", cls: "active" };
    return { label: `Due in ${days} day${days === 1 ? "" : "s"}`, cls: "active" };
  };

  const nextDueLabel = myStats.nextDueDate
    ? formatDate(myStats.nextDueDate)
    : "No active loans";
  const nextDueDays = myStats.nextDueDate
    ? Math.ceil((new Date(myStats.nextDueDate) - new Date()) / 86400000)
    : null;
  const nextDueSub = nextDueDays === null
    ? "Borrow a book to get started"
    : nextDueDays < 0
      ? "Overdue — please return"
      : nextDueDays === 0
        ? "Due today"
        : `In ${nextDueDays} day${nextDueDays === 1 ? "" : "s"}`;

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
                  <div className="stat-number">{myStats.activeLoans}</div>
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
                  <div className="stat-number">{myStats.returnedCount}</div>
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
                  <div className="stat-number" style={{ fontSize: "1.5rem" }}>{nextDueLabel}</div>
                  <div className="stat-change neutral"><span>{nextDueSub}</span></div>
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
                  <div className="stat-number">{books.length}</div>
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
                      {loadingLoans ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)" }}>
                            Loading your loans...
                          </td>
                        </tr>
                      ) : myLoans.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)" }}>
                            You have no borrowed books right now.
                          </td>
                        </tr>
                      ) : (
                        myLoans.map((loan) => {
                          const due = getDueStatus(loan.dueDate);
                          return (
                            <tr key={loan._id}>
                              <td><span className="id-chip">{loan.bookId?.barcode || "—"}</span></td>
                              <td className="book-title-cell">{loan.bookId?.title || "Unknown Title"}</td>
                              <td>{loan.bookId?.author || "Unknown Author"}</td>
                              <td>
                                <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                                  {formatDate(loan.dueDate)}
                                </span>
                              </td>
                              <td>
                                <span className={`status-pill ${due.cls}`}>
                                  <span className="status-pill-dot" />
                                  {due.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
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

                {announcements.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", padding: "16px" }}>
                    {loadingAnnouncements ? "Loading announcements..." : "No active announcements."}
                  </p>
                ) : (
                  announcements.map((item) => (
                    <div key={item._id || item.id} className="announcement-item">
                      <div className="announcement-title">{item.title}</div>
                      <p className="announcement-desc">{item.content}</p>
                      <span className="announcement-date">
                        {item.date || (item.createdAt ? new Date(item.createdAt).toISOString().split("T")[0] : "Recent")}
                      </span>
                    </div>
                  ))
                )}
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
                    {loadingLoans ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)" }}>
                          Loading your loans...
                        </td>
                      </tr>
                    ) : myLoans.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)" }}>
                          You have no borrowed books right now. Browse the catalog to check one out.
                        </td>
                      </tr>
                    ) : (
                      myLoans.map((loan) => {
                        const due = getDueStatus(loan.dueDate);
                        return (
                          <tr key={loan._id}>
                            <td><span className="id-chip">{loan._id.slice(-6).toUpperCase()}</span></td>
                            <td><span className="id-chip">{loan.bookId?.barcode || "—"}</span></td>
                            <td className="book-title-cell">{loan.bookId?.title || "Unknown Title"}</td>
                            <td>{loan.bookId?.author || "Unknown Author"}</td>
                            <td>{formatDate(loan.createdAt)}</td>
                            <td className="patron-cell" style={{ color: "var(--color-primary)" }}>{formatDate(loan.dueDate)}</td>
                            <td>
                              <span className={`status-pill ${due.cls}`}>
                                <span className="status-pill-dot" />
                                {due.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
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
                    {myHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)" }}>
                          No borrowing history yet.
                        </td>
                      </tr>
                    ) : (
                      myHistory.map((tx) => {
                        const wasOverdue = tx.returned && tx.returnDate && new Date(tx.returnDate) > new Date(tx.dueDate);
                        return (
                          <tr key={tx._id}>
                            <td><span className="id-chip">{tx.bookId?.barcode || "—"}</span></td>
                            <td className="book-title-cell">{tx.bookId?.title || "Unknown Title"}</td>
                            <td>{tx.bookId?.author || "Unknown Author"}</td>
                            <td>{tx.returned ? formatDate(tx.returnDate) : "Not returned"}</td>
                            <td>
                              {tx.returned ? (
                                <span className="status-pill returned">
                                  <span className="status-pill-dot" />
                                  {wasOverdue ? "Returned Late" : "Returned On Time"}
                                </span>
                              ) : (
                                <span className="status-pill active">
                                  <span className="status-pill-dot" />
                                  Currently Borrowed
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "my-info" && <Profile showToast={showToast} />}

        <footer className="app-footer">
          <span>Misamis Oriental Provincial Capitol Public Library System</span>
          <span>Role: Patron | Member Services Active</span>
        </footer>
      </main>
    </div>
  );
}

export default PatronDashboard;