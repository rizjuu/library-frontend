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
} from "lucide-react";

function Dashboard({
  totalBooks = 12847,
  availableBooks = 11217,
  borrowedBooks = 1420,
  totalTransactions = 0,
  books = [],
  onNavigate = () => {},
}) {
  const formatNum = (n) => (n ? n.toLocaleString() : "0");

  const sampleTransactions = [
    { id: "T-2401", patron: "Maria Santos", book: "Introduction to Algorithms", type: "Borrow", status: "active" },
    { id: "T-2402", patron: "Juan Dela Cruz", book: "1984", type: "Borrow", status: "overdue" },
    { id: "T-2403", patron: "Ana Reyes", book: "Cosmos", type: "Borrow", status: "active" },
    { id: "T-2404", patron: "Gabriel Cruz", book: "Clean Code", type: "Return", status: "returned" },
  ];

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
          <span className="page-date-kicker">Sunday, August 16, 2026</span>
          <h1 className="page-title">
            Welcome back, Dr. <span role="img" aria-label="waving hand">👋</span>
          </h1>
          <p className="page-subtitle">Here's what's happening at the library today.</p>
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
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigate("books")}
          >
            <FileText size={18} className="w-5 h-5" />
            Report
          </button>
        </div>
      </div>

      {/* 5-Card Stats Grid (Bold Metrics Displays + Uppercase Labels + Icons 6w/6h) */}
      <div className="stats-grid">
        {/* Total Books */}
        <div className="stat-card primary">
          <div className="stat-card-top">
            <span className="stat-label">TOTAL BOOKS</span>
            <div className="stat-icon-box primary">
              <BookOpen size={24} className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-card-body">
            <div className="stat-number">{books.length > 0 ? formatNum(totalBooks) : "12,847"}</div>
            <div className="stat-change up">
              <span>+128 this month</span>
            </div>
          </div>
        </div>

        {/* Borrowed */}
        <div className="stat-card info">
          <div className="stat-card-top">
            <span className="stat-label">BORROWED</span>
            <div className="stat-icon-box info">
              <BookmarkCheck size={24} className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-card-body">
            <div className="stat-number">{books.length > 0 ? formatNum(borrowedBooks) : "1,420"}</div>
            <div className="stat-change up">
              <span>+12% vs last month</span>
            </div>
          </div>
        </div>

        {/* Available */}
        <div className="stat-card success">
          <div className="stat-card-top">
            <span className="stat-label">AVAILABLE</span>
            <div className="stat-icon-box success">
              <CheckSquare size={24} className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-card-body">
            <div className="stat-number">{books.length > 0 ? formatNum(availableBooks) : "11,217"}</div>
            <div className="stat-change neutral">
              <span>In circulation shelf</span>
            </div>
          </div>
        </div>

        {/* Overdue */}
        <div className="stat-card destructive">
          <div className="stat-card-top">
            <span className="stat-label">OVERDUE</span>
            <div className="stat-icon-box destructive">
              <AlertTriangle size={24} className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-card-body">
            <div className="stat-number">34</div>
            <div className="stat-change up">
              <span>-6 since yesterday</span>
            </div>
          </div>
        </div>

        {/* Registered Users */}
        <div className="stat-card primary">
          <div className="stat-card-top">
            <span className="stat-label">REGISTERED USERS</span>
            <div className="stat-icon-box primary">
              <Users size={24} className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-card-body">
            <div className="stat-number">3,206</div>
            <div className="stat-change up">
              <span>+45 this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Two-Column Grid */}
      <div className="dashboard-grid-layout">
        {/* Left Column: Recent Transactions */}
        <div className="recent-transactions-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-header-title">Recent Transactions</h3>
              <p className="card-header-sub">Latest circulation activity</p>
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
                  <th>ID</th>
                  <th>PATRON</th>
                  <th>BOOK</th>
                  <th>TYPE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {sampleTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <span className="id-chip">{tx.id}</span>
                    </td>
                    <td className="patron-cell">{tx.patron}</td>
                    <td className="book-title-cell">{tx.book}</td>
                    <td>{tx.type}</td>
                    <td>
                      <span className={`status-pill ${tx.status}`}>
                        <span className="status-pill-dot" />
                        {tx.status === "active"
                          ? "Active"
                          : tx.status === "overdue"
                          ? "Overdue"
                          : "Returned"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Announcements */}
        <div className="announcements-card">
          <div className="card-header-row" style={{ marginBottom: "12px" }}>
            <h3 className="card-header-title">
              <Megaphone size={20} className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
              Announcements
            </h3>
          </div>

          <div className="announcement-item">
            <div className="announcement-title">Library Hours Extended</div>
            <p className="announcement-desc">
              Starting June 1, the library will be open until 8:00 PM on weekdays.
            </p>
            <span className="announcement-date">2026-05-20</span>
          </div>

          <div className="announcement-item">
            <div className="announcement-title">New Filipiniana Collection</div>
            <p className="announcement-desc">
              120 new titles added to the Filipiniana shelves this month.
            </p>
            <span className="announcement-date">2026-05-18</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
