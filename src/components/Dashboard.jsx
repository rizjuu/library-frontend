import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  BookmarkCheck,
  CheckSquare,
  AlertTriangle,
  Users,
  Plus,
  RotateCcw,
  FileText,
  ArrowRight,
  Megaphone,
  Trash2,
  Send,
  Loader2,
  Calendar,
  UserCheck
} from "lucide-react";
import api from "../api";

function Dashboard({
  totalBooks = 0,
  availableBooks = 0,
  borrowedBooks = 0,
  overdueBooks = 0,
  totalUsers = 0,
  totalPatrons = 0,
  recentTransactions = [],
  announcements = [],
  canManageAnnouncements = false,
  loadingAnnouncements = false,
  loading = false,
  onNavigate = () => {},
  onRefreshData = () => {},
  showToast = () => {}
}) {
  const formatNum = (n) => (n !== undefined && n !== null ? Number(n).toLocaleString() : "0");

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newPriority, setNewPriority] = useState("normal");
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      showToast("Please fill in both title and content.", "error");
      return;
    }

    setPostingAnnouncement(true);
    try {
      await api.post("/announcements", {
        title: newTitle.trim(),
        content: newContent.trim(),
        priority: newPriority,
        author: "Library Admin"
      });

      showToast("Announcement posted successfully to MongoDB!", "success");
      setNewTitle("");
      setNewContent("");
      setNewPriority("normal");
      setShowAddModal(false);
      onRefreshData();
    } catch (error) {
      console.error("Failed to post announcement:", error);
      showToast(error.response?.data?.message || "Failed to post announcement", "error");
    } finally {
      setPostingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      showToast("Announcement removed from MongoDB.", "success");
      onRefreshData();
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      showToast("Failed to delete announcement", "error");
    }
  };

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <motion.div
      className="dashboard-shell"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
    >
      {/* Top Banner Row */}
      <div className="page-title-row">
        <div className="page-title-group">
          <span className="page-date-kicker">📅 {currentDateFormatted}</span>
          <h1 className="page-title">
            Library Overview <span role="img" aria-label="waving hand">📊</span>
          </h1>
          <p className="page-subtitle">Real-time statistics connected directly to live MongoDB collections.</p>
        </div>

        {/* Action Toolbar */}
        <div className="page-title-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate("circulation")}
          >
            <Plus size={18} className="w-5 h-5" />
            Borrow
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigate("circulation")}
          >
            <RotateCcw size={18} className="w-5 h-5" />
            Return
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigate("add-book")}
          >
            <BookOpen size={18} className="w-5 h-5" />
            Add Book
          </button>
          {canManageAnnouncements && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowAddModal(true)}
            >
              <Megaphone size={18} className="w-5 h-5" />
              Post Announcement
            </button>
          )}
        </div>
      </div>

      {/* 5 Live Metric Cards Grid */}
      <div className="stats-grid">
        {/* 1. Total Books */}
        <div className="stat-card primary">
          <div className="stat-card-top">
            <span className="stat-label">TOTAL BOOKS</span>
            <div className="stat-icon-box primary">
              <BookOpen size={24} className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-card-body">
            <div className="stat-number">
              {loading ? <Loader2 size={24} className="animate-spin" /> : formatNum(totalBooks)}
            </div>
            <div className="stat-change up">
              <span>Live MongoDB Query</span>
            </div>
          </div>
        </div>

        {/* 2. Borrowed Books */}
        <div className="stat-card info">
          <div className="stat-card-top">
            <span className="stat-label">BORROWED BOOKS</span>
            <div className="stat-icon-box info">
              <BookmarkCheck size={24} className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-card-body">
            <div className="stat-number">
              {loading ? <Loader2 size={24} className="animate-spin" /> : formatNum(borrowedBooks)}
            </div>
            <div className="stat-change up">
              <span>Currently in Circulation</span>
            </div>
          </div>
        </div>

        {/* 3. Available Books */}
        <div className="stat-card success">
          <div className="stat-card-top">
            <span className="stat-label">AVAILABLE BOOKS</span>
            <div className="stat-icon-box success">
              <CheckSquare size={24} className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-card-body">
            <div className="stat-number">
              {loading ? <Loader2 size={24} className="animate-spin" /> : formatNum(availableBooks)}
            </div>
            <div className="stat-change neutral">
              <span>Ready on Shelves</span>
            </div>
          </div>
        </div>

        {/* 4. Overdue Books */}
        <div className="stat-card destructive">
          <div className="stat-card-top">
            <span className="stat-label">OVERDUE BOOKS</span>
            <div className="stat-icon-box destructive">
              <AlertTriangle size={24} className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-card-body">
            <div className="stat-number">
              {loading ? <Loader2 size={24} className="animate-spin" /> : formatNum(overdueBooks)}
            </div>
            <div className="stat-change down">
              <span>{overdueBooks > 0 ? "Action Needed" : "All loans on schedule"}</span>
            </div>
          </div>
        </div>

        {/* 5. Registered Users / Patrons */}
        <div className="stat-card primary">
          <div className="stat-card-top">
            <span className="stat-label">REGISTERED USERS</span>
            <div className="stat-icon-box primary">
              <Users size={24} className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-card-body">
            <div className="stat-number">
              {loading ? <Loader2 size={24} className="animate-spin" /> : formatNum(totalUsers)}
            </div>
            <div className="stat-change up">
              <span>{totalPatrons} Registered Patrons</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Two-Column Grid */}
      <div className="dashboard-grid-layout">
        {/* Left Column: 6. Live Recent Transactions */}
        <div className="recent-transactions-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-header-title">Recent Transactions</h3>
              <p className="card-header-sub">Live MongoDB circulation activity logs</p>
            </div>
            <button
              type="button"
              className="btn-link-action"
              onClick={() => onNavigate("circulation")}
            >
              View all <ArrowRight size={16} />
            </button>
          </div>

          <div className="table-container">
            <table className="ui-table">
              <thead>
                <tr>
                  <th>ID / DATE</th>
                  <th>PATRON</th>
                  <th>BOOK</th>
                  <th>TYPE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                      {loading ? "Loading transactions from MongoDB..." : "No recent transactions found in MongoDB."}
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((tx) => {
                    const txId = tx._id ? `T-${tx._id.substring(tx._id.length - 4)}` : "T-LOG";
                    const bookTitle = tx.bookId?.title || tx.bookTitle || "Library Book";
                    const isOverdue = !tx.returned && tx.dueDate && new Date(tx.dueDate) < new Date();
                    const statusText = tx.returned ? "Returned" : isOverdue ? "Overdue" : "Active";
                    const statusClass = tx.returned ? "returned" : isOverdue ? "overdue" : "active";

                    return (
                      <tr key={tx._id || Math.random()}>
                        <td>
                          <span className="id-chip">{txId}</span>
                        </td>
                        <td className="patron-cell">{tx.borrowerName || "Patron"}</td>
                        <td className="book-title-cell">{bookTitle}</td>
                        <td>{tx.type || "Borrow"}</td>
                        <td>
                          <span className={`status-pill ${statusClass}`}>
                            <span className="status-pill-dot" />
                            {statusText}
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

        {/* Right Column: 7. Live MongoDB Announcements */}
        <div className="announcements-card">
          <div className="card-header-row" style={{ marginBottom: "12px" }}>
            <h3 className="card-header-title">
              <Megaphone size={20} className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
              Live Announcements
            </h3>
            {canManageAnnouncements && (
              <button
                type="button"
                className="btn-link-action"
                onClick={() => setShowAddModal(!showAddModal)}
              >
                + Post New
              </button>
            )}
          </div>

          {/* Announcement Posting Modal / Form */}
          {showAddModal && (
            <form onSubmit={handlePostAnnouncement} style={{
              background: "var(--bg-base)",
              padding: "14px",
              borderRadius: "10px",
              marginBottom: "16px",
              border: "1px solid var(--border)"
            }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "var(--text-primary)" }}>New Announcement</h4>
              <input
                type="text"
                placeholder="Title (e.g., Library Operating Hours)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  marginBottom: "8px",
                  fontSize: "13px"
                }}
                required
              />
              <textarea
                placeholder="Announcement details..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows="2"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  marginBottom: "8px",
                  fontSize: "13px",
                  resize: "none"
                }}
                required
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    fontSize: "12px"
                  }}
                >
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={postingAnnouncement}
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                  >
                    {postingAnnouncement ? "Posting..." : "Post to MongoDB"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {announcements.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", padding: "16px" }}>
              {loadingAnnouncements ? "Loading announcements from MongoDB..." : "No active announcements in MongoDB."}
            </p>
          ) : (
            announcements.map((item) => (
              <div key={item._id || item.id} className="announcement-item" style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div className="announcement-title" style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                    {item.title}
                  </div>
                  {canManageAnnouncements && item._id && (
                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(item._id)}
                      title="Delete from MongoDB"
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-destructive)",
                        cursor: "pointer",
                        padding: "2px"
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="announcement-desc" style={{ margin: "4px 0", fontSize: "13px" }}>
                  {item.content}
                </p>
                <span className="announcement-date" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  📅 {item.date || (item.createdAt ? new Date(item.createdAt).toISOString().split("T")[0] : "Recent")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
