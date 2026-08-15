import { useState } from "react";
import { BookOpen, Search, CheckCircle2, XCircle, PlusCircle, Filter, Bookmark, Barcode, Layers } from "lucide-react";

function Catalog({ books = [], loading = false, onNavigateToAddBook }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Extract unique categories dynamically from books
  const categories = Array.from(
    new Set(books.map(b => b.category || "Classic").filter(Boolean))
  );

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title?.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.toLowerCase().includes(search.toLowerCase()) ||
      book.barcode?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      (book.category || "Classic").toLowerCase() === categoryFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && book.available) ||
      (statusFilter === "borrowed" && !book.available);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <section id="catalog-section" className="section-wrapper">
      <div className="section-header">
        <h2 className="section-title">
          <BookOpen size={32} className="text-gradient-purple" />
          Book Catalog
        </h2>
        <p className="section-subtitle">Browse and manage books currently available in the library.</p>
      </div>

      {/* Catalog Toolbar */}
      <div className="catalog-toolbar">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search books by title, author, or barcode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "14px", fontWeight: 600 }}>
            <Filter size={16} />
            Filters:
          </div>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            aria-label="Filter by Category"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            aria-label="Filter by Status"
          >
            <option value="all">All Status</option>
            <option value="available">Available Only</option>
            <option value="borrowed">Borrowed Only</option>
          </select>
        </div>
      </div>

      {/* Loading & Empty States */}
      {loading ? (
        <div className="empty-state-card">
          <BookOpen className="empty-state-icon" style={{ animation: "spin 2s linear infinite" }} />
          <div className="empty-state-title">Loading Catalog...</div>
          <p className="empty-state-text">Fetching book records from MongoDB database.</p>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state-card">
          <Bookmark className="empty-state-icon" />
          <div className="empty-state-title">No Books Found</div>
          <p className="empty-state-text">Your library catalog is currently empty. Add books to get started.</p>
          <button className="btn-primary" onClick={onNavigateToAddBook}>
            <PlusCircle size={18} />
            Add a Book
          </button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="empty-state-card">
          <Search className="empty-state-icon" />
          <div className="empty-state-title">No Matching Books</div>
          <p className="empty-state-text">Try changing your search query or reset filters.</p>
          <button className="btn-secondary" onClick={() => { setSearch(""); setCategoryFilter("all"); setStatusFilter("all"); }}>
            Reset Search Filters
          </button>
        </div>
      ) : (
        /* Book Grid */
        <div className="book-grid">
          {filteredBooks.map(book => (
            <div key={book._id || book.barcode} className="book-card">
              <div>
                <div className="book-card-header">
                  <div className="book-icon-wrapper">
                    <BookOpen size={24} />
                  </div>
                  {book.available ? (
                    <span className="badge-status available">
                      <CheckCircle2 size={12} />
                      AVAILABLE
                    </span>
                  ) : (
                    <span className="badge-status borrowed">
                      <XCircle size={12} />
                      BORROWED
                    </span>
                  )}
                </div>

                <h3 className="book-title">{book.title}</h3>
                <div className="book-author">by {book.author}</div>
              </div>

              <div>
                <div className="book-details-list">
                  <div className="book-detail-item">
                    <span className="book-detail-label">Category</span>
                    <span className="book-detail-value">{book.category || "Classic"}</span>
                  </div>

                  <div className="book-detail-item">
                    <span className="book-detail-label">Shelf Location</span>
                    <span className="book-detail-value" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Layers size={12} color="var(--text-muted)" />
                      {book.shelf || "Shelf A-01"}
                    </span>
                  </div>

                  {book.isbn && (
                    <div className="book-detail-item">
                      <span className="book-detail-label">ISBN</span>
                      <span className="book-detail-value">{book.isbn}</span>
                    </div>
                  )}
                </div>

                <div className="book-card-footer">
                  <span className="book-detail-label">Barcode</span>
                  <span className="barcode-badge">
                    <Barcode size={12} style={{ display: "inline", marginRight: "4px" }} />
                    {book.barcode || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Catalog;