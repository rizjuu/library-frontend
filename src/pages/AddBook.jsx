import { useState } from "react";
import { PlusCircle, RotateCcw, Barcode, Book, User, Tag, Layers } from "lucide-react";
import api from "../api";

function AddBook({ onBookAdded, showToast }) {
  const [formData, setFormData] = useState({
    barcode: "",
    title: "",
    author: "",
    category: "",
    shelf: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClear = () => {
    setFormData({
      barcode: "",
      title: "",
      author: "",
      category: "",
      shelf: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.barcode) {
      showToast("Please fill in Barcode, Title, and Author", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/books", {
        barcode: formData.barcode,
        title: formData.title,
        author: formData.author,
        category: formData.category || "General",
        shelf: formData.shelf || "Shelf A-01",
        available: true
      });

      showToast(`Book "${formData.title}" added successfully!`, "success");
      handleClear();
      if (onBookAdded) onBookAdded(response.data);
    } catch (error) {
      console.error("Failed to add book:", error);
      showToast(error.response?.data?.message || "Failed to add book to database.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="section-header-centered">
        <h2 className="section-title">
          <PlusCircle size={32} />
          Add New Book
        </h2>
        <p className="section-subtitle">Add a new book to the library catalog.</p>
      </div>

      <div className="form-glass-card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Barcode */}
            <div className="form-group-glass">
              <label className="form-label-glass" htmlFor="add-barcode">
                <Barcode size={14} style={{ display: "inline", marginRight: "6px" }} />
                Barcode *
              </label>
              <input
                id="add-barcode"
                name="barcode"
                type="text"
                className="form-input-glass"
                placeholder="e.g. LIB-0006"
                value={formData.barcode}
                onChange={handleChange}
                required
              />
            </div>

            {/* Title */}
            <div className="form-group-glass">
              <label className="form-label-glass" htmlFor="add-title">
                <Book size={14} style={{ display: "inline", marginRight: "6px" }} />
                Title *
              </label>
              <input
                id="add-title"
                name="title"
                type="text"
                className="form-input-glass"
                placeholder="Enter book title..."
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Author */}
            <div className="form-group-glass">
              <label className="form-label-glass" htmlFor="add-author">
                <User size={14} style={{ display: "inline", marginRight: "6px" }} />
                Author *
              </label>
              <input
                id="add-author"
                name="author"
                type="text"
                className="form-input-glass"
                placeholder="Enter author name..."
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group-glass">
              <label className="form-label-glass" htmlFor="add-category">
                <Tag size={14} style={{ display: "inline", marginRight: "6px" }} />
                Category
              </label>
              <input
                id="add-category"
                name="category"
                type="text"
                className="form-input-glass"
                placeholder="e.g. Classic, Sci-Fi, Fiction"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            {/* Shelf */}
            <div className="form-group-glass" style={{ gridColumn: "span 2" }}>
              <label className="form-label-glass" htmlFor="add-shelf">
                <Layers size={14} style={{ display: "inline", marginRight: "6px" }} />
                Shelf Location
              </label>
              <input
                id="add-shelf"
                name="shelf"
                type="text"
                className="form-input-glass"
                placeholder="e.g. Shelf A-01, B-03"
                value={formData.shelf}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "28px" }}>
            <button type="submit" className="btn-glass-primary" disabled={loading}>
              <PlusCircle size={18} />
              {loading ? "Adding Book..." : "Add Book"}
            </button>

            <button type="button" className="btn-glass-secondary" onClick={handleClear} disabled={loading}>
              <RotateCcw size={18} />
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBook;
