import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  PlusCircle,
  Barcode,
  Filter,
  Calendar,
  Building,
  Hash,
  Layers,
  Tag,
  User,
  X,
  RotateCcw,
  CheckCircle,
  BookmarkCheck,
  Archive
} from "lucide-react";
import api from "../api";

function Catalog({
  books = [],
  loading = false,
  onNavigateToAddBook,
  isPatronView = false,
  canArchive = false,
  onBookArchived,
  showToast = () => {}
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [shelfFilter, setShelfFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [decadeFilter, setDecadeFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState(null);

  // Extract unique Categories & Shelves from live books array
  const categories = Array.from(
    new Set(books.map((b) => b.category).filter(Boolean))
  ).sort();

  const shelves = Array.from(
    new Set(books.map((b) => b.shelf).filter(Boolean))
  ).sort();

  // Helper to determine publication decade from publicationYear
  const getDecade = (yearVal) => {
    if (!yearVal) return "unknown";
    const year = Number(yearVal);
    if (isNaN(year)) return "unknown";
    if (year >= 2020) return "2020s";
    if (year >= 2010 && year <= 2019) return "2010s";
    if (year >= 2000 && year <= 2009) return "2000s";
    if (year >= 1990 && year <= 1999) return "1990s";
    if (year >= 1980 && year <= 1989) return "1980s";
    return "pre-1980s";
  };

  // Check if any filter is active
  const hasActiveFilters =
    search.trim() !== "" ||
    categoryFilter !== "all" ||
    shelfFilter !== "all" ||
    availabilityFilter !== "all" ||
    decadeFilter !== "all";

  const handleResetFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setShelfFilter("all");
    setAvailabilityFilter("all");
    setDecadeFilter("all");
  };

  // Comprehensive 4-Filter Engine
  const filteredBooks = books.filter((book) => {
    // Keyword Search
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (book.title && book.title.toLowerCase().includes(q)) ||
      (book.author && book.author.toLowerCase().includes(q)) ||
      (book.barcode && book.barcode.toLowerCase().includes(q)) ||
      (book.isbn && book.isbn.toLowerCase().includes(q)) ||
      (book.publisher && book.publisher.toLowerCase().includes(q)) ||
      (book.category && book.category.toLowerCase().includes(q)) ||
      (book.shelf && book.shelf.toLowerCase().includes(q));

    // 1. Category Filter
    const matchesCategory =
      categoryFilter === "all" ||
      (book.category && book.category.toLowerCase() === categoryFilter.toLowerCase());

    // 2. Shelf Filter
    const matchesShelf =
      shelfFilter === "all" ||
      (book.shelf && book.shelf.toLowerCase() === shelfFilter.toLowerCase());

    // 3. Availability Filter
    const isBookAvailable = book.available !== false && book.status !== "borrowed";
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && isBookAvailable) ||
      (availabilityFilter === "borrowed" && !isBookAvailable);

    // 4. Publication Decade Filter
    const bookDecade = getDecade(book.publicationYear);
    const matchesDecade =
      decadeFilter === "all" ||
      (decadeFilter === "unknown" && bookDecade === "unknown") ||
      bookDecade === decadeFilter;

    return matchesSearch && matchesCategory && matchesShelf && matchesAvailability && matchesDecade;
  });

  const formatDate = (dateVal) => {
    if (!dateVal) return "N/A";
    return new Date(dateVal).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleArchive = async () => {
    if (!selectedBook || !window.confirm(`Archive "${selectedBook.title}"? The record will be kept and removed from the active catalog.`)) {
      return;
    }

    try {
      await api.patch(`/books/${selectedBook._id}/archive`);
      showToast(`Book "${selectedBook.title}" archived successfully.`, "success");
      setSelectedBook(null);
      if (onBookArchived) onBookArchived();
    } catch (error) {
      console.error("Failed to archive book:", error);
      showToast(error.response?.data?.message || "Failed to archive book.", "error");
    }
  };

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
          <p className="page-subtitle">
            Search and filter books by Category, Shelf Location, Availability, and Publication Decade.
          </p>
        </div>
        {!isPatronView && onNavigateToAddBook && (
          <button className="btn btn-primary" onClick={onNavigateToAddBook}>
            <PlusCircle size={20} className="w-5 h-5" />
            Add Book
          </button>
        )}
      </div>

      {/* Comprehensive 4-Filter Catalog Toolbar */}
      <div className="catalog-toolbar" style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
        {/* Search Input */}
        <div className="toolbar-search" style={{ flex: "1 1 240px", minWidth: "220px" }}>
          <Search size={20} className="toolbar-search-icon w-5 h-5" />
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search by title, author, ISBN, barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter 1: Category */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <select
            className="toolbar-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by Category"
            style={{ minWidth: "140px" }}
          >
            <option value="all">📁 All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Filter 2: Shelf Location */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <select
            className="toolbar-select"
            value={shelfFilter}
            onChange={(e) => setShelfFilter(e.target.value)}
            aria-label="Filter by Shelf Location"
            style={{ minWidth: "140px" }}
          >
            <option value="all">📍 All Shelves</option>
            {shelves.map((sh) => (
              <option key={sh} value={sh}>
                {sh}
              </option>
            ))}
          </select>
        </div>

        {/* Filter 3: Availability */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <select
            className="toolbar-select"
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            aria-label="Filter by Availability"
            style={{ minWidth: "140px" }}
          >
            <option value="all">⚡ All Availability</option>
            <option value="available">✅ Available Only</option>
            <option value="borrowed">🔴 Borrowed Only</option>
          </select>
        </div>

        {/* Filter 4: Publication Decade */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <select
            className="toolbar-select"
            value={decadeFilter}
            onChange={(e) => setDecadeFilter(e.target.value)}
            aria-label="Filter by Publication Decade"
            style={{ minWidth: "150px" }}
          >
            <option value="all">📅 All Decades</option>
            <option value="2020s">2020s (2020–2029)</option>
            <option value="2010s">2010s (2010–2019)</option>
            <option value="2000s">2000s (2000–2009)</option>
            <option value="1990s">1990s (1990–1999)</option>
            <option value="1980s">1980s (1980–1989)</option>
            <option value="pre-1980s">Pre-1980s (&lt; 1980)</option>
          </select>
        </div>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleResetFilters}
            style={{ padding: "8px 14px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <RotateCcw size={14} />
            Reset Filters
          </button>
        )}
      </div>

      {/* Filter Results Summary Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 4px 18px 4px", fontSize: "13px", color: "var(--text-muted)" }}>
        <span>
          Showing <strong>{filteredBooks.length}</strong> of <strong>{books.length}</strong> books
        </span>
        {hasActiveFilters && (
          <span style={{ color: "var(--color-primary)", fontWeight: "600" }}>
            Filters Active
          </span>
        )}
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
          {!isPatronView && onNavigateToAddBook && (
            <button className="btn btn-primary" onClick={onNavigateToAddBook}>
              <PlusCircle size={20} className="w-5 h-5" />
              Add Book
            </button>
          )}
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="empty-state">
          <Filter size={48} className="empty-state-icon w-12 h-12" />
          <h3 className="empty-state-title">No Matching Books</h3>
          <p className="empty-state-desc">No books match your selected Category, Shelf, Availability, or Decade filters.</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleResetFilters}
          >
            <RotateCcw size={16} style={{ marginRight: "6px" }} />
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="book-grid">
          {filteredBooks.map((book) => {
            const displayAuthor = book.author || (Array.isArray(book.authors) ? book.authors.join(", ") : "Unknown Author");
            const isAvailable = book.available !== false && book.status !== "borrowed";
            const displayStatus = book.status ? book.status.toUpperCase() : (isAvailable ? "AVAILABLE" : "BORROWED");

            return (
              <div
                key={book._id || book.barcode}
                className="book-card"
                onClick={() => setSelectedBook(book)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <div className="book-card-head" style={{ gap: "12px" }}>
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        style={{
                          width: "48px",
                          height: "64px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid var(--border)",
                          flexShrink: 0
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="book-icon-box">
                        <BookOpen size={24} className="w-6 h-6" />
                      </div>
                    )}
                    <span className={`status-pill ${isAvailable ? "active" : "overdue"}`}>
                      <span className="status-pill-dot" />
                      {displayStatus}
                    </span>
                  </div>

                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {displayAuthor}</p>
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

                    <div className="book-meta-row">
                      <span className="book-meta-label">Publisher</span>
                      <span className="book-meta-value">{book.publisher || "N/A"}</span>
                    </div>

                    <div className="book-meta-row">
                      <span className="book-meta-label">Pub Year</span>
                      <span className="book-meta-value">
                        {book.publicationYear ? `${book.publicationYear} (${getDecade(book.publicationYear)})` : "N/A"}
                      </span>
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

                    <div className="book-meta-row">
                      <span className="book-meta-label">Date Added</span>
                      <span className="book-meta-value" style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {formatDate(book.dateAdded || book.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 10-FIELD DETAILED BOOK MODAL */}
      {selectedBook && (
        <div className="modal-backdrop" style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px"
        }}>
          <div style={{
            backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)",
            borderRadius: "16px", padding: "28px", maxWidth: "560px", width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                {selectedBook.coverUrl ? (
                  <img
                    src={selectedBook.coverUrl}
                    alt={selectedBook.title}
                    style={{ width: "54px", height: "72px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border)" }}
                  />
                ) : (
                  <div className="book-icon-box" style={{ width: "54px", height: "54px" }}>
                    <BookOpen size={28} />
                  </div>
                )}
                <div>
                  <h3 style={{ margin: 0, fontSize: "20px", color: "var(--text-primary)" }}>{selectedBook.title}</h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "var(--text-muted)" }}>
                    by {selectedBook.author || (Array.isArray(selectedBook.authors) ? selectedBook.authors.join(", ") : "Unknown Author")}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedBook(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={22} />
              </button>
            </div>

            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px",
              background: "var(--bg-base)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "20px"
            }}>
              <div>
                <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>1. ISBN</span>
                <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-primary)" }}>{selectedBook.isbn || "N/A"}</span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>2. BARCODE</span>
                <span className="barcode-chip" style={{ display: "inline-flex", marginTop: "2px" }}>{selectedBook.barcode || "N/A"}</span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>3. TITLE</span>
                <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-primary)" }}>{selectedBook.title}</span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>4. AUTHOR</span>
                <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-primary)" }}>
                  {selectedBook.author || (Array.isArray(selectedBook.authors) ? selectedBook.authors.join(", ") : "Unknown")}
                </span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>5. CATEGORY</span>
                <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-primary)" }}>{selectedBook.category || "General"}</span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>6. PUBLISHER</span>
                <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-primary)" }}>{selectedBook.publisher || "N/A"}</span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>7. PUBLICATION YEAR</span>
                <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-primary)" }}>
                  {selectedBook.publicationYear ? `${selectedBook.publicationYear} (${getDecade(selectedBook.publicationYear)})` : "N/A"}
                </span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>8. SHELF LOCATION</span>
                <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-primary)" }}>{selectedBook.shelf || "N/A"}</span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>9. CATALOG STATUS</span>
                <span className={`status-pill ${selectedBook.available !== false && selectedBook.status !== "borrowed" ? "active" : "overdue"}`} style={{ display: "inline-flex", marginTop: "4px" }}>
                  <span className="status-pill-dot" />
                  {(selectedBook.status || (selectedBook.available ? "available" : "borrowed")).toUpperCase()}
                </span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>10. DATE ADDED</span>
                <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-primary)" }}>
                  📅 {formatDate(selectedBook.dateAdded || selectedBook.createdAt)}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              {canArchive && (
                <button type="button" className="btn btn-secondary" onClick={handleArchive}>
                  <Archive size={17} />
                  Archive Book
                </button>
              )}
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedBook(null)}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Catalog;