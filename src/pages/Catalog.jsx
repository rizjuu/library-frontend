import { useState } from "react";
import { BookOpen, Search, CheckCircle2, XCircle, PlusCircle, Filter, Bookmark, Barcode, Layers } from "lucide-react";

function Catalog({ books = [], loading = false, onNavigateToAddBook }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const categories = Array.from(
    new Set(books.map((b) => b.category || "Classic").filter(Boolean))
  );

  const filteredBooks = books.filter((book) => {
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
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="section-header-centered">
        <h2 className="section-title">
          <BookOpen size={32} />
          Book Catalog
        </h2>
        <p className="section-subtitle">Browse and manage books currently available in the library.</p>
      </div>

      {/* Centered Toolbar */}
      <div className="catalog-toolbar-centered">
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.7)" }} />
          <input
            type="text"
            className="search-input-glass"
            placeholder="Search by title, author, or barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Filter size={16} color="rgba(255,255,255,0.8)" />
          <select
            className="filter-select-glass"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by Category"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="filter-select-glass"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
        <div className="empty-state-glass">
          <BookOpen size={48} style={{ animation: "spin 2s linear infinite", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: 800 }}>Loading Catalog...</h3>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", marginTop: "6px" }}>Fetching book records from MongoDB database.</p>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state-glass">
          <Bookmark size={48} style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: 800 }}>No Books Found</h3>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", marginTop: "6px", marginBottom: "20px" }}>Your catalog is empty. Add a new book to get started.</p>
          <button className="btn-glass-primary" onClick={onNavigateToAddBook}>
            <PlusCircle size={18} />
            Add a Book
          </button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="empty-state-glass">
          <Search size={48} style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: 800 }}>No Matching Books</h3>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", marginTop: "6px", marginBottom: "20px" }}>Try changing your search query or reset filters.</p>
          <button className="btn-glass-secondary" onClick={() => { setSearch(""); setCategoryFilter("all"); setStatusFilter("all"); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        /* Book Grid */
        <div className="book-grid">
          {filteredBooks.map((book) => (
            <div key={book._id || book.barcode} className="book-glass-card">
              <div>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.25)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <BookOpen size={22} color="#FFFFFF" />
                  </div>

                  {book.available ? (
                    <span className="badge-glass-status available">
                      <CheckCircle2 size={12} />
                      AVAILABLE
                    </span>
                  ) : (
                    <span className="badge-glass-status borrowed">
                      <XCircle size={12} />
                      BORROWED
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", marginBottom: "4px" }}>{book.title}</h3>
                <div style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.8)", marginBottom: "16px" }}>by {book.author}</div>
              </div>

              <div>
                <div style={{
                  padding: "12px 0",
                  borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                  marginBottom: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "13px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>Category</span>
                    <span style={{ fontWeight: 700 }}>{book.category || "Classic"}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>Shelf Location</span>
                    <span style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                      <Layers size={12} />
                      {book.shelf || "Shelf A-01"}
                    </span>
                  </div>

                  {book.isbn && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "rgba(255,255,255,0.7)" }}>ISBN</span>
                      <span style={{ fontWeight: 700 }}>{book.isbn}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>Barcode</span>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    background: "rgba(255,255,255,0.22)",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.4)",
                    fontWeight: 700
                  }}>
                    <Barcode size={12} style={{ display: "inline", marginRight: "4px" }} />
                    {book.barcode || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;