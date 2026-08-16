import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import Catalog from "./Catalog";
import Circulation from "./Circulation";
import AddBook from "./AddBook";
import ToastContainer from "../components/ToastContainer";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { Users, Shield, BookOpen, BarChart3, Search, Filter } from "lucide-react";

function AdminDashboard() {
  const { theme, toggleTheme } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
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

  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.available !== false).length;
  const borrowedBooks = books.filter((b) => b.available === false).length;

  // Sample Users Data for Admin User Management
  const sampleUsers = [
    { id: "U-101", name: "Administrator", username: "admin", role: "admin", email: "admin@library.gov.ph", status: "Active" },
    { id: "U-102", name: "Sarah Jenkins", username: "staff_sarah", role: "staff", email: "sarah.j@library.gov.ph", status: "Active" },
    { id: "U-103", name: "Mark Vance", username: "staff_mark", role: "staff", email: "mark.v@library.gov.ph", status: "Active" },
    { id: "U-104", name: "Maria Santos", username: "patron_maria", role: "patron", email: "maria.santos@email.com", status: "Active" },
    { id: "U-105", name: "Juan Dela Cruz", username: "patron_juan", role: "patron", email: "juan.delacruz@email.com", status: "Active" },
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
            totalBooks={totalBooks}
            availableBooks={availableBooks}
            borrowedBooks={borrowedBooks}
            books={books}
            onNavigate={(tab) => setActiveTab(tab)}
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
            onTransactionComplete={fetchBooks}
            showToast={showToast}
          />
        )}

        {activeTab === "add-book" && (
          <AddBook
            onBookAdded={(newBook) => {
              setBooks((prev) => [newBook, ...prev]);
            }}
            showToast={showToast}
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
                  Manage library system administrators, staff members, and registered patrons.
                </p>
              </div>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <div className="stat-card primary">
                <div className="stat-card-top">
                  <span className="stat-label">TOTAL USERS</span>
                  <div className="stat-icon-box primary">
                    <Users size={24} />
                  </div>
                </div>
                <div className="stat-card-body">
                  <div className="stat-number">{sampleUsers.length}</div>
                  <div className="stat-change up"><span>Active system accounts</span></div>
                </div>
              </div>

              <div className="stat-card info">
                <div className="stat-card-top">
                  <span className="stat-label">STAFF MEMBERS</span>
                  <div className="stat-icon-box info">
                    <Shield size={24} />
                  </div>
                </div>
                <div className="stat-card-body">
                  <div className="stat-number">2</div>
                  <div className="stat-change neutral"><span>Library Operators</span></div>
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
                  <div className="stat-number">2</div>
                  <div className="stat-change up"><span>Cardholders</span></div>
                </div>
              </div>
            </div>

            <div className="recent-transactions-card">
              <div className="card-header-row">
                <h3 className="card-header-title">System User Directory</h3>
              </div>

              <div className="table-container">
                <table className="ui-table">
                  <thead>
                    <tr>
                      <th>USER ID</th>
                      <th>NAME</th>
                      <th>USERNAME / EMAIL</th>
                      <th>ROLE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleUsers.map((u) => (
                      <tr key={u.id}>
                        <td><span className="id-chip">{u.id}</span></td>
                        <td className="patron-cell">{u.name}</td>
                        <td className="book-title-cell">{u.email}</td>
                        <td>
                          <span
                            className={`status-pill ${
                              u.role === "admin" ? "active" : u.role === "staff" ? "returned" : "active"
                            }`}
                          >
                            <span className="status-pill-dot" />
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className="status-pill active">
                            <span className="status-pill-dot" />
                            {u.status}
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

        {activeTab === "reports" && (
          <div className="dashboard-shell">
            <div className="page-title-row">
              <div>
                <h1 className="page-title">
                  <BarChart3 size={28} style={{ color: "var(--color-primary)" }} />
                  Library Reports &amp; Analytics
                </h1>
                <p className="page-subtitle">Comprehensive statistics on circulation, stock, and collection usage.</p>
              </div>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <div className="stat-card primary">
                <div className="stat-card-top">
                  <span className="stat-label">TOTAL CATALOG ITEMS</span>
                  <div className="stat-icon-box primary"><BookOpen size={24} /></div>
                </div>
                <div className="stat-card-body">
                  <div className="stat-number">{totalBooks}</div>
                  <div className="stat-change up"><span>100% indexed</span></div>
                </div>
              </div>

              <div className="stat-card success">
                <div className="stat-card-top">
                  <span className="stat-label">CIRCULATION RATE</span>
                  <div className="stat-icon-box success"><BarChart3 size={24} /></div>
                </div>
                <div className="stat-card-body">
                  <div className="stat-number">
                    {totalBooks > 0 ? `${Math.round((borrowedBooks / totalBooks) * 100)}%` : "11%"}
                  </div>
                  <div className="stat-change up"><span>Active loans</span></div>
                </div>
              </div>

              <div className="stat-card warning">
                <div className="stat-card-top">
                  <span className="stat-label">OVERDUE INCIDENTS</span>
                  <div className="stat-icon-box warning"><BarChart3 size={24} /></div>
                </div>
                <div className="stat-card-body">
                  <div className="stat-number">0</div>
                  <div className="stat-change neutral"><span>All clear</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "my-info" && (
          <div className="dashboard-shell">
            <div className="page-title-row">
              <div>
                <h1 className="page-title">Administrator Profile</h1>
                <p className="page-subtitle">Your account privileges and preferences.</p>
              </div>
            </div>

            <div className="addbook-wrapper">
              <div className="addbook-card">
                <div className="form-group">
                  <label className="form-label">Role Privilege</label>
                  <div className="form-readonly">Administrator (Full Access)</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Scope</label>
                  <div className="form-readonly">System Configuration, User Operations, Catalog &amp; Reports</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="app-footer">
          <span>Misamis Oriental Provincial Capitol Public Library System</span>
          <span>Role: Admin | MOPL Engine v2.0</span>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;