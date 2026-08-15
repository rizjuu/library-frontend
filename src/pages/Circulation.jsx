import { useState } from "react";
import api from "../api";

function Circulation() {
  const [barcode, setBarcode] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const borrow = async () => {
    if (!barcode || !borrowerName) {
      showMessage("Please enter both barcode and borrower name", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/transactions/borrow", {
        barcode,
        borrowerName,
        dueDate: new Date(Date.now() + 7 * 86400000)
      });

      showMessage(`✓ Book borrowed successfully for ${borrowerName}!`, "success");
      setBarcode("");
      setBorrowerName("");
    } catch (error) {
      showMessage(error.response?.data?.message || "Failed to borrow book", "error");
    } finally {
      setLoading(false);
    }
  };

  const returnBook = async () => {
    if (!barcode) {
      showMessage("Please enter barcode to return", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/transactions/return", {
        barcode
      });

      showMessage("✓ Book returned successfully!", "success");
      setBarcode("");
      setBorrowerName("");
    } catch (error) {
      showMessage(error.response?.data?.message || "Failed to return book", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>🔄 Circulation Management</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", "@media (max-width: 1024px)": { gridTemplateColumns: "1fr" } }}>
        {/* Borrow Section */}
        <div className="form-section">
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📤</div>
            <h3 style={{ marginTop: 0, color: "var(--text-h)", fontSize: "1.5rem" }}>Borrow Book</h3>
            <p style={{ color: "var(--text-light)", margin: 0 }}>Record a book checkout transaction</p>
          </div>

          {message && messageType === "error" && (
            <div
              style={{
                padding: "1rem",
                marginBottom: "1.5rem",
                borderRadius: "0.75rem",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "var(--danger)",
                border: "1px solid var(--danger)",
                fontSize: "0.95rem"
              }}
            >
              {message}
            </div>
          )}

          {message && messageType === "success" && (
            <div
              style={{
                padding: "1rem",
                marginBottom: "1.5rem",
                borderRadius: "0.75rem",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "var(--success)",
                border: "1px solid var(--success)",
                fontSize: "0.95rem"
              }}
            >
              {message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="barcode">📌 Book Barcode</label>
            <input
              id="barcode"
              type="text"
              placeholder="Scan or enter barcode..."
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              onKeyPress={e => e.key === "Enter" && borrow()}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="borrower">👤 Borrower Name</label>
            <input
              id="borrower"
              type="text"
              placeholder="Enter borrower name..."
              value={borrowerName}
              onChange={e => setBorrowerName(e.target.value)}
              onKeyPress={e => e.key === "Enter" && borrow()}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>📅 Due Date</label>
            <div style={{ padding: "1rem", background: "var(--bg)", borderRadius: "0.75rem", border: "2px solid var(--border)", color: "var(--text-light)" }}>
              {new Date(Date.now() + 7 * 86400000).toLocaleDateString()}
            </div>
          </div>

          <button
            className="btn btn-success"
            onClick={borrow}
            disabled={loading}
            style={{ width: "100%", marginTop: "2rem" }}
          >
            {loading ? "⏳ Processing..." : "✓ Borrow Book"}
          </button>
        </div>

        {/* Return Section */}
        <div className="form-section">
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📥</div>
            <h3 style={{ marginTop: 0, color: "var(--text-h)", fontSize: "1.5rem" }}>Return Book</h3>
            <p style={{ color: "var(--text-light)", margin: 0 }}>Record a book checkin transaction</p>
          </div>

          <div className="form-group">
            <label htmlFor="returnBarcode">📌 Book Barcode</label>
            <input
              id="returnBarcode"
              type="text"
              placeholder="Scan or enter barcode..."
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              onKeyPress={e => e.key === "Enter" && returnBook()}
            />
          </div>

          <div style={{ padding: "1.5rem", background: "var(--bg-secondary)", borderRadius: "0.75rem", border: "1px solid var(--border)", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-light)", fontSize: "0.95rem" }}>
              <span style={{ fontSize: "1.5rem" }}>ℹ️</span>
              <p style={{ margin: 0 }}>Enter the barcode of the book being returned. The system will automatically process the return.</p>
            </div>
          </div>

          <button
            className="btn btn-danger"
            onClick={returnBook}
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "⏳ Processing..." : "↩ Return Book"}
          </button>
        </div>
      </div>

      {/* Tips Section */}
      <div style={{ marginTop: "3rem", padding: "2rem", backgroundColor: "var(--bg-secondary)", borderRadius: "1.25rem", border: "2px solid var(--primary-light)" }}>
        <h4 style={{ marginTop: 0, color: "var(--primary)", fontSize: "1.25rem", fontWeight: 700 }}>💡 Helpful Tips</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          <div>
            <p style={{ fontWeight: 700, color: "var(--text-h)", marginBottom: "0.5rem" }}>🔍 Scan Barcodes</p>
            <p style={{ color: "var(--text-light)", margin: 0, fontSize: "0.95rem" }}>Use a barcode scanner for quick and accurate book identification</p>
          </div>
          <div>
            <p style={{ fontWeight: 700, color: "var(--text-h)", marginBottom: "0.5rem" }}>📝 Record Names</p>
            <p style={{ color: "var(--text-light)", margin: 0, fontSize: "0.95rem" }}>Always enter the borrower's name for proper record keeping</p>
          </div>
          <div>
            <p style={{ fontWeight: 700, color: "var(--text-h)", marginBottom: "0.5rem" }}>📅 7-Day Loan</p>
            <p style={{ color: "var(--text-light)", margin: 0, fontSize: "0.95rem" }}>Standard loan period is 7 days from the borrow date</p>
          </div>
          <div>
            <p style={{ fontWeight: 700, color: "var(--text-h)", marginBottom: "0.5rem" }}>✅ Verify Returns</p>
            <p style={{ color: "var(--text-light)", margin: 0, fontSize: "0.95rem" }}>Always confirm successful return with the system</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Circulation;