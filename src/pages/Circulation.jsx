import { useState } from "react";
import { Repeat, ArrowUpRight, ArrowDownLeft, Barcode, User, Calendar, Info, CheckCircle2, RefreshCw } from "lucide-react";
import api from "../api";

function Circulation({ onTransactionComplete, showToast }) {
  const [borrowBarcode, setBorrowBarcode] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [returnBarcode, setReturnBarcode] = useState("");
  const [loadingAction, setLoadingAction] = useState(null); // 'borrow' | 'return' | null

  // 7-day default loan period calculation
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
    <section id="circulation-section" className="section-wrapper">
      <div className="section-header">
        <h2 className="section-title">
          <Repeat size={32} className="text-gradient-purple" />
          Book Circulation
        </h2>
        <p className="section-subtitle">Borrow and return books using their barcode.</p>
      </div>

      <div className="circulation-grid">
        {/* Borrow Panel */}
        <div className="circulation-panel">
          <div>
            <div className="panel-header">
              <div className="panel-icon-box borrow">
                <ArrowUpRight size={26} />
              </div>
              <div>
                <h3 className="panel-title">Borrow a Book</h3>
                <p className="panel-desc">Record a checkout transaction for a patron</p>
              </div>
            </div>

            <form onSubmit={handleBorrow}>
              <div className="form-group">
                <label className="form-label" htmlFor="borrow-barcode">
                  <Barcode size={14} style={{ display: "inline", marginRight: "6px" }} />
                  Book Barcode *
                </label>
                <input
                  id="borrow-barcode"
                  type="text"
                  className="form-input"
                  placeholder="Scan or enter barcode (e.g. LIB-0001)..."
                  value={borrowBarcode}
                  onChange={e => setBorrowBarcode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="borrower-name">
                  <User size={14} style={{ display: "inline", marginRight: "6px" }} />
                  Borrower Name *
                </label>
                <input
                  id="borrower-name"
                  type="text"
                  className="form-input"
                  placeholder="Enter full borrower name..."
                  value={borrowerName}
                  onChange={e => setBorrowerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={14} style={{ display: "inline", marginRight: "6px" }} />
                  Calculated Due Date (7 Days)
                </label>
                <div className="due-date-box">
                  <Calendar size={16} />
                  <span>{defaultDueDate}</span>
                </div>
              </div>
            </form>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={handleBorrow}
            disabled={loadingAction === "borrow"}
            style={{ width: "100%", marginTop: "16px" }}
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
        <div className="circulation-panel">
          <div>
            <div className="panel-header">
              <div className="panel-icon-box return">
                <ArrowDownLeft size={26} />
              </div>
              <div>
                <h3 className="panel-title">Return a Book</h3>
                <p className="panel-desc">Record a book return and update availability</p>
              </div>
            </div>

            <form onSubmit={handleReturn}>
              <div className="form-group">
                <label className="form-label" htmlFor="return-barcode">
                  <Barcode size={14} style={{ display: "inline", marginRight: "6px" }} />
                  Book Barcode *
                </label>
                <input
                  id="return-barcode"
                  type="text"
                  className="form-input"
                  placeholder="Scan or enter barcode (e.g. LIB-0001)..."
                  value={returnBarcode}
                  onChange={e => setReturnBarcode(e.target.value)}
                  required
                />
              </div>

              <div style={{
                padding: "16px",
                background: "rgba(16, 0, 47, 0.5)",
                borderRadius: "12px",
                border: "1px solid rgba(139, 92, 246, 0.25)",
                margin: "24px 0",
                display: "flex",
                gap: "12px"
              }}>
                <Info size={20} color="var(--cyan)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                  Enter the barcode of the borrowed book. The system will check in the item and automatically restore status to <strong style={{ color: "#6EE7B7" }}>AVAILABLE</strong>.
                </p>
              </div>
            </form>
          </div>

          <button
            type="button"
            className="btn-danger-action"
            onClick={handleReturn}
            disabled={loadingAction === "return"}
            style={{ width: "100%", marginTop: "16px" }}
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
    </section>
  );
}

export default Circulation;