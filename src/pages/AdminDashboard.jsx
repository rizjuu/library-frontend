import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import Catalog from "./Catalog";
import Circulation from "./Circulation";
import AddBook from "./AddBook";
import ImportBooks from "./ImportBooks";
import ToastContainer from "../components/ToastContainer";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { Users, Shield, BookOpen, BarChart3, Loader2 } from "lucide-react";

function AdminDashboard() {
  const { theme, toggleTheme } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Live Dashboard Stats State
  const [dashboardStats, setDashboardStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    overdueBooks: 0,
    totalUsers: 0,
    totalPatrons: 0,
    totalStaff: 0,
    recentTransactions: [],
    announcements: []
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Live System Users State
  const [liveUsers, setLiveUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Toast Helper
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get("/dashboard/stats");
      setDashboardStats({
        totalBooks: res.data.totalBooks || 0,
        availableBooks: res.data.availableBooks || 0,
        borrowedBooks: res.data.borrowedBooks || 0,
        overdueBooks: res.data.overdueBooks || 0,
        totalUsers: res.data.totalUsers || 0,
        totalPatrons: res.data.totalPatrons || 0,
        totalStaff: res.data.totalStaff || 0,
        recentTransactions: res.data.recentTransactions || [],
        announcements: res.data.announcements || []
      });
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoadingStats(false);
    }
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

  const fetchLiveUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get("/auth/users");
      setLiveUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load live users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchBooks();
    fetchLiveUsers();
  }, []);

  const handleRefreshAll = () => {
    fetchDashboardStats();
    fetchBooks();
    fetchLiveUsers();
  };

  return (
    <div className="app-shell">
      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setMobileSidebarOpen(false);
        }}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Top Header Bar */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleMobileMenu={() => setMobileSidebarOpen(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === "dashboard" && (
          <Dashboard
            totalBooks={dashboardStats.totalBooks}
            availableBooks={dashboardStats.availableBooks}
            borrowedBooks={dashboardStats.borrowedBooks}
            overdueBooks={dashboardStats.overdueBooks}
            totalUsers={dashboardStats.totalUsers}
            totalPatrons={dashboardStats.totalPatrons}
            recentTransactions={dashboardStats.recentTransactions}
            announcements={dashboardStats.announcements}
            loading={loadingStats}
            onNavigate={(tab) => setActiveTab(tab)}
            onRefreshData={handleRefreshAll}
            showToast={showToast}
          />
        )}

        {activeTab === "books" && (
          <Catalog
            books={books}
            loading={loadingBooks}
            onNavigateToAddBook={() => setActiveTab("add-book")}
          />
        )}

        {activeTab === "circulation" && (
          <Circulation
            onTransactionComplete={() => {
              handleRefreshAll();
            }}
            showToast={showToast}
          />
        )}

        {activeTab === "add-book" && (
          <AddBook
            onBookAdded={() => {
              handleRefreshAll();
            }}
            showToast={showToast}
          />
        )}

        {activeTab === "import-books" && (
          <ImportBooks
            showToast={showToast}
            onBookImported={() => {
              handleRefreshAll();
            }}
          />
        )}

        {activeTab === "users" && (
          <div className="dashboard-shell">
            <div className="page-title-row">
              <div>
                <h1 className="page-title">
                  <Users size={28} style={{ color: "var(--color-primary)" }} />
                  User &amp; Role Management
                </h1>
                <p className="page-subtitle">
                  Live registered administrators, staff members, and patrons.
                </p>
              </div>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <div className="stat-card primary">
                <div className="stat-card-top">
                  <span className="stat-label">TOTAL REGISTERED USERS</span>
                  <div className="stat-icon-box primary">
                    <Users size={24} />
                  </div>
                </div>
                <div className="stat-card-body">
                  <div className="stat-number">
                    {loadingUsers ? <Loader2 size={24} className="animate-spin" /> : liveUsers.length}
                  </div>
                  <div className="stat-change up"><span>Active user accounts</span></div>
                </div>
              </div>

              <div className="stat-card info">
                <div className="stat-card-top">
                  <span className="stat-label">STAFF &amp; ADMINS</span>
                  <div className="stat-icon-box info">
                    <Shield size={24} />
                  </div>
                </div>
                <div className="stat-card-body">
                  <div className="stat-number">
                    {liveUsers.filter((u) => u.role === "admin" || u.role === "staff").length}
                  </div>
                  <div className="stat-change neutral"><span>System Operators</span></div>
                </div>
              </div>

              <div className="stat-card success">
                <div className="stat-card-top">
                  <span className="stat-label">REGISTERED PATRONS</span>
                  <div className="stat-icon-box success">
                    <Users size={24} />
                  </div>
                </div>
                <div className="stat-card-body">
                  <div className="stat-number">
                    {liveUsers.filter((u) => u.role === "patron").length}
                  </div>
                  <div className="stat-change up"><span>Cardholders</span></div>
                </div>
              </div>
            </div>

            <div className="recent-transactions-card">
              <div className="card-header-row">
                <h3 className="card-header-title">Live User Directory</h3>
              </div>

              <div className="table-container">
                <table className="ui-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>NAME</th>
                      <th>USERNAME / EMAIL</th>
                      <th>ROLE</th>
                      <th>CREATED DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>
                          {loadingUsers ? "Loading users..." : "No users found."}
                        </td>
                      </tr>
                    ) : (
                      liveUsers.map((u) => {
                        const uId = u._id ? `U-${u._id.substring(u._id.length - 4)}` : "U-USER";
                        const userIdentifier = u.username ? `@${u.username}` : u.email || "—";
                        const formattedDate = u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                          : "Existing";

                        return (
                          <tr key={u._id || Math.random()}>
                            <td><span className="id-chip">{uId}</span></td>
                            <td className="patron-cell">{u.name || "Library User"}</td>
                            <td className="book-title-cell">{userIdentifier}</td>
                            <td>
                              <span
                                className={`status-pill ${
                                  u.role === "admin" ? "active" : u.role === "staff" ? "returned" : "active"
                                }`}
                              >
                                <span className="status-pill-dot" />
                                {(u.role || "patron").toUpperCase()}
                              </span>
                            </td>
                            <td>{formattedDate}</td>
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
      </main>
    </div>
  );
}

export default AdminDashboard;