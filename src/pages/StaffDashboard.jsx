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
import { Users } from "lucide-react";

function StaffDashboard() {
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
    recentTransactions: [],
    announcements: []
  });
  const [loadingStats, setLoadingStats] = useState(true);

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
        recentTransactions: res.data.recentTransactions || [],
        announcements: res.data.announcements || []
      });
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
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

  useEffect(() => {
    fetchDashboardStats();
    fetchBooks();
  }, []);

  const handleRefreshAll = () => {
    fetchDashboardStats();
    fetchBooks();
  };

  const samplePatrons = [
    { id: "P-8801", name: "Maria Santos", email: "maria.santos@email.com", activeLoans: 2, status: "Good Standing" },
    { id: "P-8802", name: "Juan Dela Cruz", email: "juan.delacruz@email.com", activeLoans: 1, status: "Good Standing" },
    { id: "P-8803", name: "Ana Reyes", email: "ana.reyes@email.com", activeLoans: 0, status: "Good Standing" },
  ];

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

        {activeTab === "circulation" && (
          <Circulation
            onTransactionComplete={handleRefreshAll}
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

        {activeTab === "add-book" && (
          <AddBook
            onBookAdded={handleRefreshAll}
            showToast={showToast}
          />
        )}

        {activeTab === "import-books" && (
          <ImportBooks
            showToast={showToast}
            onBookImported={handleRefreshAll}
          />
        )}

        {activeTab === "patrons" && (
          <div className="dashboard-shell">
            <div className="page-title-row">
              <div>
                <h1 className="page-title">
                  <Users size={28} style={{ color: "var(--color-primary)" }} />
                  Patron Directory
                </h1>
                <p className="page-subtitle">Lookup registered library members and active borrowing records.</p>
              </div>
            </div>

            <div className="recent-transactions-card">
              <div className="card-header-row">
                <h3 className="card-header-title">Registered Library Patrons</h3>
              </div>

              <div className="table-container">
                <table className="ui-table">
                  <thead>
                    <tr>
                      <th>CARD ID</th>
                      <th>PATRON NAME</th>
                      <th>EMAIL ADDRESS</th>
                      <th>ACTIVE LOANS</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {samplePatrons.map((p) => (
                      <tr key={p.id}>
                        <td><span className="id-chip">{p.id}</span></td>
                        <td className="patron-cell">{p.name}</td>
                        <td className="book-title-cell">{p.email}</td>
                        <td>{p.activeLoans} items</td>
                        <td>
                          <span className="status-pill active">
                            <span className="status-pill-dot" />
                            {p.status}
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

        {activeTab === "my-info" && (
          <div className="dashboard-shell">
            <div className="page-title-row">
              <div>
                <h1 className="page-title">Staff Profile</h1>
                <p className="page-subtitle">Your staff credentials and workstation details.</p>
              </div>
            </div>

            <div className="addbook-wrapper">
              <div className="addbook-card">
                <div className="form-group">
                  <label className="form-label">Role Privilege</label>
                  <div className="form-readonly">Library Staff</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Workstation Duties</label>
                  <div className="form-readonly">Circulation Desk, Barcode Scanning, Cataloging &amp; Patron Service</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="app-footer">
          <span>Misamis Oriental Provincial Capitol Public Library System</span>
          <span>Role: Staff | Workstation Active</span>
        </footer>
      </main>
    </div>
  );
}

export default StaffDashboard;