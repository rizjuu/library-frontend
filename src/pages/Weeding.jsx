import { useEffect, useState } from "react";
import { Archive, BookOpen, Calendar, Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api";

function Weeding() {
  const [archivedBooks, setArchivedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchArchivedBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/books/archived");
      setArchivedBooks(response.data || []);
    } catch (requestError) {
      console.error("Failed to load archived books:", requestError);
      setError(requestError.response?.data?.message || "Failed to load archived books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedBooks();
  }, []);

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    return new Date(dateValue).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <motion.div
      className="dashboard-shell"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
    >
      <div className="page-title-row">
        <div>
          <h1 className="page-title">
            <Archive size={28} style={{ color: "var(--color-primary)" }} />
            Weeding
          </h1>
          <p className="page-subtitle">Archived materials retained for library records.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={fetchArchivedBooks} disabled={loading}>
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          <Loader2 size={36} className="animate-spin empty-state-icon" />
          <h3 className="empty-state-title">Loading Archived Books</h3>
        </div>
      ) : error ? (
        <div className="empty-state">
          <Archive size={42} className="empty-state-icon" />
          <h3 className="empty-state-title">Unable to Load Weeding Records</h3>
          <p className="empty-state-desc">{error}</p>
          <button type="button" className="btn btn-secondary" onClick={fetchArchivedBooks}>
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      ) : archivedBooks.length === 0 ? (
        <div className="empty-state">
          <Archive size={48} className="empty-state-icon" />
          <h3 className="empty-state-title">No Archived Books</h3>
          <p className="empty-state-desc">Books archived during weeding will appear here.</p>
        </div>
      ) : (
        <div className="book-grid">
          {archivedBooks.map((book) => (
            <article className="book-card" key={book._id || book.barcode}>
              <div>
                <div className="book-card-head" style={{ gap: "12px" }}>
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      style={{ width: "48px", height: "64px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)", flexShrink: 0 }}
                    />
                  ) : (
                    <div className="book-icon-box">
                      <BookOpen size={24} />
                    </div>
                  )}
                  <span className="status-pill overdue">
                    <span className="status-pill-dot" />
                    ARCHIVED
                  </span>
                </div>
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author || "Unknown Author"}</p>
              </div>

              <div className="book-meta-rows">
                <div className="book-meta-row">
                  <span className="book-meta-label">Category</span>
                  <span className="book-meta-value">{book.category || "General"}</span>
                </div>
                <div className="book-meta-row">
                  <span className="book-meta-label">Barcode</span>
                  <span className="book-meta-value">{book.barcode || "N/A"}</span>
                </div>
                <div className="book-meta-row">
                  <span className="book-meta-label"><Calendar size={14} /> Archived</span>
                  <span className="book-meta-value">{formatDate(book.archivedAt)}</span>
                </div>
                <div className="book-meta-row">
                  <span className="book-meta-label">Archived By</span>
                  <span className="book-meta-value">{book.archivedBy?.name || "Administrator"}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Weeding;
