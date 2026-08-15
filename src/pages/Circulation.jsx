import { useState } from "react";
import { Repeat, ArrowUpRight, ArrowDownLeft, Barcode, User, Calendar, Info, CheckCircle2, RefreshCw } from "lucide-react";
import api from "../api";

function Circulation({ onTransactionComplete, showToast }) {
  const [borrowBarcode, setBorrowBarcode] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [returnBarcode, setReturnBarcode] = useState("");
  const [loadingAction, setLoadingAction] = useState(null); // 'borrow' | 'return' | null

  const defaultDueDate = new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const handleBorrow = async (e) => {
    if (e) e.preventDefault();
    if (!borrowBarcode || !borrowerName) {
      showToast("Please enter both barcode and borrower name.", "error");
      return;
    }

    setLoadingAction("borrow");
    try {
      await api.post("/transactions/borrow", {
        barcode: borrowBarcode,
        borrowerName,
        dueDate: new Date(Date.now() + 7 * 86400000)
      });

      showToast(`Book checkout complete for "${borrowerName}"!`, "success");
      setBorrowBarcode("");
      setBorrowerName("");
      if (onTransactionComplete) onTransactionComplete();
    } catch (error) {
      console.error("Borrow transaction failed:", error);
      showToast(error.response?.data?.message || "Failed to borrow book. Check barcode or availability.", "error");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReturn = async (e) => {
    if (e) e.preventDefault();
    if (!returnBarcode) {
      showToast("Please enter barcode to return book.", "error");
      return;
    }

    setLoadingAction("return");
    try {
      await api.post("/transactions/return", {
        barcode: returnBarcode
      });

      showToast("Book returned successfully! Catalog updated.", "success");
      setReturnBarcode("");
      if (onTransactionComplete) onTransactionComplete();
    } catch (error) {
      console.error("Return transaction failed:", error);
      showToast(error.response?.data?.message || "Failed to return book. Verify barcode is borrowed.", "error");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="section-header-centered">
        <h2 className="section-title">
          <Repeat size={32} />
          Book Circulation
        </h2>
        <p className="section-subtitle">Borrow and return books using their barcode.</p>
      </div>

      <div className="circulation-centered-grid">
        {/* Borrow Panel */}
        <div className="circulation-glass-panel">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.25)",
                border: "1px solid rgba(255, 255, 255, 0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <ArrowUpRight size={24} color="#FFFFFF" />
              </div>
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF" }}>Borrow a Book</h3>
                <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.8)", margin: 0 }}>Record a checkout transaction for a patron</p>
              </div>
            </div>

            <form onSubmit={handleBorrow}>
              <div className="form-group-glass">
                <label className="form-label-glass" htmlFor="borrow-barcode">
                  <Barcode size={14} style={{ display: "inline", marginRight: "6px" }} />
                  Book Barcode *
                </label>
                <input
                  id="borrow-barcode"
                  type="text"
                  className="form-input-glass"
                  placeholder="Scan or enter barcode (e.g. LIB-0001)..."
                  value={borrowBarcode}
                  onChange={(e) => setBorrowBarcode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-glass">
                <label className="form-label-glass" htmlFor="borrower-name">
                  <User size={14} style={{ display: "inline", marginRight: "6px" }} />
                  Borrower Name *
                </label>
                <input
                  id="borrower-name"
                  type="text"
                  className="form-input-glass"
                  placeholder="Enter full borrower name..."
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-glass">
                <label className="form-label-glass">
                  <Calendar size={14} style={{ display: "inline", marginRight: "6px" }} />
                  Calculated Due Date (7 Days)
                </label>
                <div style={{
                  height: "50px",
                  padding: "0 18px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "14px"
                }}>
                  <Calendar size={16} />
                  <span>{defaultDueDate}</span>
                </div>
              </div>
            </form>
          </div>

          <button
            type="button"
            className="btn-glass-primary"
            onClick={handleBorrow}
            disabled={loadingAction === "borrow"}
            style={{ width: "100%", marginTop: "20px" }}
          >
            {loadingAction === "borrow" ? (
              <>
                <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
                Processing Borrow...
              </>
            ) : (
              <>
                <ArrowUpRight size={18} />
                Borrow Book
              </>
            )}
          </button>
        </div>

        {/* Return Panel */}
        <div className="circulation-glass-panel">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.25)",
                border: "1px solid rgba(255, 255, 255, 0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <ArrowDownLeft size={24} color="#FFFFFF" />
              </div>
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF" }}>Return a Book</h3>
                <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.8)", margin: 0 }}>Record a book return and update availability</p>
              </div>
            </div>

            <form onSubmit={handleReturn}>
              <div className="form-group-glass">
                <label className="form-label-glass" htmlFor="return-barcode">
                  <Barcode size={14} style={{ display: "inline", marginRight: "6px" }} />
                  Book Barcode *
                </label>
                <input
                  id="return-barcode"
                  type="text"
                  className="form-input-glass"
                  placeholder="Scan or enter barcode (e.g. LIB-0001)..."
                  value={returnBarcode}
                  onChange={(e) => setReturnBarcode(e.target.value)}
                  required
                />
              </div>

              <div style={{
                padding: "16px",
                background: "rgba(255, 255, 255, 0.15)",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.35)",
                margin: "24px 0",
                display: "flex",
                gap: "12px"
              }}>
                <Info size={20} color="#FFFFFF" style={{ flexShrink: 0, marginTop: "2px" }} />
                <p style={{ margin: 0, fontSize: "13px", color: "rgba(255, 255, 255, 0.9)", lineHeight: "1.5" }}>
                  Enter the barcode of the borrowed book. The system will check in the item and automatically restore status to <strong style={{ color: "#00E676" }}>AVAILABLE</strong>.
                </p>
              </div>
            </form>
          </div>

          <button
            type="button"
            className="btn-glass-primary"
            onClick={handleReturn}
            disabled={loadingAction === "return"}
            style={{ width: "100%", marginTop: "20px" }}
          >
            {loadingAction === "return" ? (
              <>
                <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
                Processing Return...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Return Book
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Circulation;