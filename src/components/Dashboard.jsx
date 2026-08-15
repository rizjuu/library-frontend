import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  BookmarkX,
  Repeat,
  PlusCircle,
} from "lucide-react";

function Dashboard({
  totalBooks = 0,
  availableBooks = 0,
  borrowedBooks = 0,
  totalTransactions = 0,
  books = [],
  onNavigate = () => {},
}) {
  const recentBooks = Array.isArray(books) ? books.slice(0, 4) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Banner */}
      <div className="dashboard-hero glass-card">
        <div className="dashboard-hero-content">
          <div className="dashboard-hero-left">
            <h1>Library Management System</h1>
            <p>
              Organize books, track circulation, and manage library records from
              one modern platform.
            </p>
          </div>
          <div className="dashboard-hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate("books")}
            >
              <BookOpen size={16} />
              Browse Books
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onNavigate("circulation")}
            >
              <Repeat size={16} />
              Manage Circulation
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-card-top">
            <span className="stat-label">TOTAL BOOKS</span>
            <div className="stat-icon-box purple">
              <BookOpen size={18} />
            </div>
          </div>
          <div className="stat-number">{totalBooks}</div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-top">
            <span className="stat-label">AVAILABLE</span>
            <div className="stat-icon-box green">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="stat-number">{availableBooks}</div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-top">
            <span className="stat-label">BORROWED</span>
            <div className="stat-icon-box red">
              <BookmarkX size={18} />
            </div>
          </div>
          <div className="stat-number">{borrowedBooks}</div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-top">
            <span className="stat-label">TRANSACTIONS</span>
            <div className="stat-icon-box blue">
              <Repeat size={18} />
            </div>
          </div>
          <div className="stat-number">{totalTransactions}</div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="dashboard-bottom-row">
        {/* Recent Books */}
        <div className="recent-activity-card glass-card">
          <div className="card-header-row">
            <h3 className="card-title">
              <span className="card-title-dot purple"></span>
              Recent Books
            </h3>
          </div>
          <div className="quick-list">
            {recentBooks.length > 0 ? (
              recentBooks.map((book, index) => {
                const isAvailable = book.available !== false;
                return (
                  <div
                    key={book._id || book.id || index}
                    className="quick-list-item"
                  >
                    <div className="quick-list-avatar purple">
                      <BookOpen size={16} />
                    </div>
                    <div className="quick-list-text">
                      <div className="quick-list-title">
                        {book.title || "Untitled Book"}
                      </div>
                      <div className="quick-list-sub">
                        {book.author || "Unknown Author"}
                      </div>
                    </div>
                    <span
                      className={`quick-list-badge ${
                        isAvailable ? "available" : "borrowed"
                      }`}
                    >
                      {isAvailable ? "Available" : "Borrowed"}
                    </span>
                  </div>
                );
              })
            ) : (
              <div
                className="quick-list-item"
                style={{
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontSize: "13px",
                }}
              >
                No books in catalog yet.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="recent-activity-card glass-card">
          <div className="card-header-row">
            <h3 className="card-title">
              <span className="card-title-dot blue"></span>
              Quick Actions
            </h3>
          </div>
          <div className="quick-list">
            <div
              className="quick-list-item"
              role="button"
              tabIndex={0}
              onClick={() => onNavigate("books")}
              style={{ cursor: "pointer" }}
            >
              <div className="quick-list-avatar purple">
                <BookOpen size={16} />
              </div>
              <div className="quick-list-text">
                <div className="quick-list-title">Browse Catalog</div>
                <div className="quick-list-sub">
                  Explore and search all books in the library
                </div>
              </div>
            </div>

            <div
              className="quick-list-item"
              role="button"
              tabIndex={0}
              onClick={() => onNavigate("circulation")}
              style={{ cursor: "pointer" }}
            >
              <div className="quick-list-avatar green">
                <Repeat size={16} />
              </div>
              <div className="quick-list-text">
                <div className="quick-list-title">Borrow a Book</div>
                <div className="quick-list-sub">
                  Issue a book to a registered patron
                </div>
              </div>
            </div>

            <div
              className="quick-list-item"
              role="button"
              tabIndex={0}
              onClick={() => onNavigate("circulation")}
              style={{ cursor: "pointer" }}
            >
              <div className="quick-list-avatar green">
                <CheckCircle2 size={16} />
              </div>
              <div className="quick-list-text">
                <div className="quick-list-title">Return a Book</div>
                <div className="quick-list-sub">
                  Process returned books and update stock
                </div>
              </div>
            </div>

            <div
              className="quick-list-item"
              role="button"
              tabIndex={0}
              onClick={() => onNavigate("add-book")}
              style={{ cursor: "pointer" }}
            >
              <div className="quick-list-avatar purple">
                <PlusCircle size={16} />
              </div>
              <div className="quick-list-text">
                <div className="quick-list-title">Add New Book</div>
                <div className="quick-list-sub">
                  Register a new title into the library
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
