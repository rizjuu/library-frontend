import { useEffect, useRef, useState } from "react";
import { Archive, Barcode, Download, Hash, Loader2, Printer, RefreshCw, UserPlus } from "lucide-react";
import JsBarcode from "jsbarcode";
import { motion } from "framer-motion";
import api from "../api";

function BarcodeGenerator({ showToast = () => {}, onBookAssigned = () => {} }) {
  const [count, setCount] = useState(1);
  const [prefix, setPrefix] = useState("ACC");
  const [items, setItems] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const barcodeRef = useRef(null);

  useEffect(() => {
    api.get("/books").then((response) => setBooks(response.data || [])).catch((error) => {
      console.error("Failed to load books for barcode assignment:", error);
    });
  }, []);

  const previewItem = items.find((item) => item.barcode === (selectedItem || items[0]?.barcode));

  useEffect(() => {
    if (barcodeRef.current && previewItem) {
      JsBarcode(barcodeRef.current, previewItem.barcode, {
        format: "CODE128",
        displayValue: true,
        fontSize: 16,
        height: 72,
        margin: 12,
        lineColor: "#172033",
        background: "#ffffff"
      });
    }
  }, [previewItem]);

  const generateBarcodes = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/books/barcodes/generate", {
        count: Number(count),
        prefix
      });
      setItems(response.data.items || []);
      setSelectedItem("");
      showToast(`${response.data.items.length} barcode${response.data.items.length === 1 ? "" : "s"} generated.`, "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to generate barcodes.", "error");
    } finally {
      setLoading(false);
    }
  };

  const downloadBarcode = () => {
    if (!barcodeRef.current || !previewItem) return;
    const source = new XMLSerializer().serializeToString(barcodeRef.current);
    const blob = new Blob([source], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${previewItem.barcode}.svg`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const printBarcode = () => {
    if (!barcodeRef.current || !previewItem) return;
    const printWindow = window.open("", "_blank", "width=520,height=360");
    if (!printWindow) return;
    printWindow.document.write(`<html><head><title>${previewItem.barcode}</title></head><body style="display:flex;justify-content:center;align-items:center;height:90vh">${barcodeRef.current.outerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const assignBarcode = async (event) => {
    event.preventDefault();
    const book = books.find((item) => item._id === selectedBook);
    const item = items.find((barcodeItem) => barcodeItem.barcode === selectedItem);
    if (!book || !item) {
      showToast("Select a book and a generated barcode first.", "error");
      return;
    }

    setAssigning(true);
    try {
      await api.patch(`/books/${book._id}/assign-barcode`, item);
      showToast(`Barcode assigned to "${book.title}".`, "success");
      setBooks((currentBooks) => currentBooks.map((currentBook) => currentBook._id === book._id ? { ...currentBook, ...item } : currentBook));
      setItems((currentItems) => currentItems.filter((currentItem) => currentItem.barcode !== item.barcode));
      setSelectedBook("");
      setSelectedItem("");
      onBookAssigned();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to assign barcode.", "error");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <motion.div className="dashboard-shell" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="page-title-row">
        <div>
          <h1 className="page-title"><Barcode size={28} style={{ color: "var(--color-primary)" }} /> Generate Barcode</h1>
          <p className="page-subtitle">Create, preview, and assign library accession labels.</p>
        </div>
      </div>

      <div className="circ-grid">
        <section className="circ-panel">
          <div className="circ-panel-head">
            <div className="circ-panel-icon borrow"><Hash size={24} /></div>
            <div><h3 className="circ-panel-title">Batch Barcode Generation</h3><p className="circ-panel-desc">Generate multiple sequential accession numbers and barcodes.</p></div>
          </div>
          <form onSubmit={generateBarcodes}>
            <div className="form-group"><label className="form-label" htmlFor="barcode-count">Number of barcodes</label><input id="barcode-count" className="form-input" type="number" min="1" max="100" value={count} onChange={(event) => setCount(event.target.value)} /></div>
            <div className="form-group"><label className="form-label" htmlFor="accession-prefix">Accession prefix</label><input id="accession-prefix" className="form-input" value={prefix} maxLength="12" onChange={(event) => setPrefix(event.target.value.toUpperCase())} /></div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>{loading ? <><Loader2 size={19} className="animate-spin" /> Generating...</> : <><RefreshCw size={19} /> Generate Sequential Barcodes</>}</button>
          </form>

          {items.length > 0 && <div className="book-meta-rows" style={{ marginTop: "24px", maxHeight: "260px", overflowY: "auto" }}>{items.map((item) => <button type="button" key={item.barcode} onClick={() => setSelectedItem(item.barcode)} className="book-meta-row" style={{ width: "100%", border: 0, borderBottom: "1px solid var(--border)", background: selectedItem === item.barcode ? "var(--bg-base)" : "transparent", cursor: "pointer", textAlign: "left" }}><span className="book-meta-label">{item.accessionNumber}</span><span className="book-meta-value">{item.barcode}</span></button>)}</div>}
        </section>

        <section className="circ-panel">
          <div className="circ-panel-head"><div className="circ-panel-icon return"><Barcode size={24} /></div><div><h3 className="circ-panel-title">Barcode Preview</h3><p className="circ-panel-desc">Preview, download, or print the selected label.</p></div></div>
          {previewItem ? <><div style={{ background: "#fff", padding: "18px", borderRadius: "8px", textAlign: "center", border: "1px solid var(--border)" }}><p style={{ margin: "0 0 8px", color: "#172033", fontWeight: 700 }}>{previewItem.accessionNumber}</p><svg ref={barcodeRef} aria-label={`Barcode ${previewItem.barcode}`} /></div><div className="form-actions" style={{ marginTop: "18px" }}><button type="button" className="btn btn-secondary" onClick={downloadBarcode}><Download size={18} /> Download</button><button type="button" className="btn btn-primary" onClick={printBarcode}><Printer size={18} /> Print</button></div></> : <div className="empty-state"><Barcode size={42} className="empty-state-icon" /><h3 className="empty-state-title">No Barcode Selected</h3><p className="empty-state-desc">Generate a batch to preview a barcode.</p></div>}
        </section>
      </div>

      <section className="circ-panel" style={{ marginTop: "24px" }}>
        <div className="circ-panel-head"><div className="circ-panel-icon borrow"><UserPlus size={24} /></div><div><h3 className="circ-panel-title">Assign Barcode to Book</h3><p className="circ-panel-desc">Book <strong>↓</strong> Accession Number <strong>↓</strong> Barcode <strong>↓</strong> Book Record</p></div></div>
        <form onSubmit={assignBarcode} className="form-grid-2col">
          <div className="form-group"><label className="form-label" htmlFor="assign-book">Book</label><select id="assign-book" className="form-input select-field" value={selectedBook} onChange={(event) => setSelectedBook(event.target.value)}><option value="">Select an active book</option>{books.map((book) => <option key={book._id} value={book._id}>{book.title} {book.barcode ? `(${book.barcode})` : ""}</option>)}</select></div>
          <div className="form-group"><label className="form-label" htmlFor="assign-barcode">Generated accession and barcode</label><select id="assign-barcode" className="form-input select-field" value={selectedItem} onChange={(event) => setSelectedItem(event.target.value)}><option value="">Select a generated label</option>{items.map((item) => <option key={item.barcode} value={item.barcode}>{item.accessionNumber} / {item.barcode}</option>)}</select></div>
          <button className="btn btn-primary" type="submit" disabled={assigning || !selectedBook || !selectedItem}>{assigning ? <><Loader2 size={19} className="animate-spin" /> Assigning...</> : <><Archive size={19} /> Assign to Book Record</>}</button>
        </form>
      </section>
    </motion.div>
  );
}

export default BarcodeGenerator;
