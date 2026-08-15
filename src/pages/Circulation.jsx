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

      <div className="form-section">
        <h3 style={{ marginTop: 0, color: "var(--primary)" }}>Book Transaction</h3>

        {message && (
          <div
            style={{
              padding: "1rem",
              marginBottom: "1.5rem",
              borderRadius: "0.5rem",
              backgroundColor: messageType === "success"
                ? "rgba(16, 185, 129, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
              color: messageType === "success" ? "var(--success)" : "var(--danger)",
              border: `1px solid ${messageType === "success" ? "var(--success)" : "var(--danger)"}`,
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

        <div className="form-actions">
          <button
            className="btn btn-success"
            onClick={borrow}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? "Processing..." : "✓ Borrow Book"}
          </button>
          <button
            className="btn btn-danger"
            onClick={returnBook}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? "Processing..." : "↩ Return Book"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "var(--bg-secondary)", borderRadius: "1rem", border: "1px solid var(--border)" }}>
        <h4 style={{ marginTop: 0, color: "var(--primary)" }}>ℹ️ Tips</h4>
        <ul style={{ marginLeft: "1.5rem", color: "var(--text-light)" }}>
          <li>Scan the book barcode to quickly identify the book</li>
          <li>Enter the borrower's name for record keeping</li>
          <li>Books are due back in 7 days</li>
          <li>Use the Return button to check books back in</li>
        </ul>
      </div>
    </div>
  );
}

export default Circulation;