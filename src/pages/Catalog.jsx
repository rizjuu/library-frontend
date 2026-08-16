import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, PlusCircle, Barcode, Filter } from "lucide-react";

function Catalog({ books = [], loading = false, onNavigateToAddBook }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const categories = Array.from(
    new Set(books.map((b) => b.category).filter(Boolean))
  );

  const filteredBooks = books.filter((book) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (book.title && book.title.toLowerCase().includes(q)) ||
      (book.author && book.author.toLowerCase().includes(q)) ||
      (book.barcode && book.barcode.toLowerCase().includes(q));

    const matchesCategory =
      categoryFilter === "all" ||
      (book.category && book.category.toLowerCase() === categoryFilter.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && book.available) ||
      (statusFilter === "borrowed" && !book.available);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
    >
      {/* Page Title Row */}
      <div className="page-title-row">
        <div>
          <h1 className="page-title">Book Catalog</h1>
          <p className="page-subtitle">Browse, filter, and manage your library collection.</p>
        </div>
        <button className="btn btn-primary" onClick={onNavigateToAddBook}>
          <PlusCircle size={20} className="w-5 h-5" />
          Add Book
        </button>
      </div>

      {/* Catalog Toolbar */}
      <div className="catalog-toolbar">
        <div className="toolbar-search">
          <Search size={20} className="toolbar-search-icon w-5 h-5" />
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search by title, author, or barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="toolbar-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="toolbar-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
        </select>
      </div>

      {/* Loading, Empty, and Grid States */}
      {loading ? (
        <div className="empty-state">
          <BookOpen size={48} className="empty-state-icon w-12 h-12" />
          <h3 className="empty-state-title">Loading Catalog...</h3>
          <p className="empty-state-desc">Fetching book collection from the database.</p>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} className="empty-state-icon w-12 h-12" />
          <h3 className="empty-state-title">No Books Found</h3>
          <p className="empty-state-desc">Your library catalog is currently empty. Get started by adding a new title.</p>
          <button className="btn btn-primary" onClick={onNavigateToAddBook}>
            <PlusCircle size={20} className="w-5 h-5" />
            Add Book
          </button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="empty-state">
          <Filter size={48} className="empty-state-icon w-12 h-12" />
          <h3 className="empty-state-title">No Matching Books</h3>
          <p className="empty-state-desc">No books match your current search and filter criteria.</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearch("");
              setCategoryFilter("all");
              setStatusFilter("all");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="book-grid">
          {filteredBooks.map((book) => (
            <div key={book._id || book.barcode} className="book-card">
              <div>
                <div className="book-card-head">
                  <div className="book-icon-box">
                    <BookOpen size={24} className="w-6 h-6" />
                  </div>
                  <span className={`status-pill ${book.available ? "active" : "overdue"}`}>
                    <span className="status-pill-dot" />
                    {book.available ? "Available" : "Borrowed"}
                  </span>
                </div>

                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
              </div>

              <div>
                <div className="book-meta-rows">
                  <div className="book-meta-row">
                    <span className="book-meta-label">Category</span>
                    <span className="book-meta-value">{book.category || "General"}</span>
                  </div>
                  <div className="book-meta-row">
                    <span className="book-meta-label">Shelf Location</span>
                    <span className="book-meta-value">{book.shelf || "N/A"}</span>
                  </div>
                  {book.isbn && (
                    <div className="book-meta-row">
                      <span className="book-meta-label">ISBN</span>
                      <span className="book-meta-value">{book.isbn}</span>
                    </div>
                  )}
                  <div className="book-meta-row">
                    <span className="book-meta-label">Barcode</span>
                    <span className="barcode-chip">
                      <Barcode size={16} className="w-4 h-4" />
                      {book.barcode || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Catalog;