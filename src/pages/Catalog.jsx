import { useEffect, useState } from "react";
import api from "../api";

function Catalog() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/books")
      .then(res => setBooks(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const availableCount = books.filter(b => b.available).length;
  const borrowedCount = books.filter(b => !b.available).length;

  return (
    <div>
      <h2>📚 Book Catalog</h2>

      {books.length > 0 && (
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
      ) : (
        <div className="card-grid">
          {books.map(book => (
            <div key={book._id} className="card">
              <div className="card-header">
                <div className="card-icon">📖</div>
                <div className="badge" style={{alignSelf: 'flex-start'}}>
                  {book.available ? (
                    <span className="badge available">✓ Available</span>
                  ) : (
                    <span className="badge borrowed">✗ Borrowed</span>
                  )}
                </div>
              </div>

              <h3>{book.title}</h3>
              <p style={{color: 'var(--text-light)', marginTop: '0.5rem'}}>
                by <strong>{book.author}</strong>
              </p>

              {book.isbn && (
                <p style={{fontSize: '0.875rem', color: 'var(--text-light)'}}>
                  ISBN: {book.isbn}
                </p>
              )}

              {book.barcode && (
                <div className="card-meta">
                  <span style={{fontSize: '0.875rem', color: 'var(--text-light)'}}>
                    📌 Barcode: {book.barcode}
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