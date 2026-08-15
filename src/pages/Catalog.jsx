import { useEffect, useState } from "react";
import api from "../api";

function Catalog() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/books")
      .then(res => setBooks(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const availableCount = books.filter(b => b.available).length;
  const borrowedCount = books.filter(b => !b.available).length;
  
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>📚 Book Catalog</h2>

      {books.length > 0 && (
        <>
          <div className="stats-bar">
            <div className="stat-card">
              <h4>Total Books</h4>
              <div className="value">{books.length}</div>
            </div>
            <div className="stat-card">
              <h4>Available</h4>
              <div className="value">{availableCount}</div>
            </div>
            <div className="stat-card">
              <h4>Borrowed</h4>
              <div className="value">{borrowedCount}</div>
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <input
              type="text"
              placeholder="🔍 Search books by title or author..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "500px",
                padding: "0.875rem 1.25rem",
                fontSize: "1rem",
                border: "2px solid var(--border)",
                borderRadius: "0.75rem",
                transition: "all 0.3s"
              }}
            />
          </div>
        </>
      )}

      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <p>Loading books...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <p>No books in catalog yet</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <p>No books found matching your search</p>
        </div>
      ) : (
        <div className="card-grid">
          {filteredBooks.map(book => (
            <div key={book._id} className="card">
              <div className="card-header">
                <div className="card-icon">📖</div>
                {book.available ? (
                  <span className="badge available">✓ Available</span>
                ) : (
                  <span className="badge borrowed">✗ Borrowed</span>
                )}
              </div>

              <h3>{book.title}</h3>
              <p style={{color: 'var(--text-light)', marginTop: '0.5rem'}}>
                by <strong>{book.author}</strong>
              </p>

              {book.isbn && (
                <p style={{fontSize: '0.95rem', color: 'var(--text-light)', marginTop: '0.75rem'}}>
                  📇 ISBN: {book.isbn}
                </p>
              )}

              {book.barcode && (
                <div className="card-meta">
                  <span style={{fontSize: '0.95rem', color: 'var(--text-light)'}}>
                    📌 {book.barcode}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;