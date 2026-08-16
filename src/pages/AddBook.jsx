import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, RotateCcw, Barcode, Book, User, Tag, Layers, Loader2 } from "lucide-react";
import api from "../api";

function AddBook({ onBookAdded, showToast }) {
  const [formData, setFormData] = useState({
    barcode: "",
    title: "",
    author: "",
    category: "",
    shelf: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFormData({
      barcode: "",
      title: "",
      author: "",
      category: "",
      shelf: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.barcode.trim() || !formData.title.trim() || !formData.author.trim()) {
      if (showToast) {
        showToast("Please fill in Barcode, Title, and Author fields.", "error");
      }
      return;
    }

    setLoading(true);
    try {
      const payload = {
        barcode: formData.barcode.trim(),
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category.trim() || "General",
        shelf: formData.shelf.trim() || "General",
        available: true,
      };

      const response = await api.post("/books", payload);

      if (showToast) {
        showToast(`Book "${formData.title.trim()}" added successfully to catalog!`, "success");
      }
      handleClear();
      if (onBookAdded) onBookAdded(response.data);
    } catch (error) {
      console.error("Failed to add book:", error);
      if (showToast) {
        showToast(
          error.response?.data?.message || "Failed to add book to catalog. Check if barcode is unique.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
    >
      <div className="page-title-row">
        <div>
          <h1 className="page-title">Add New Book</h1>
          <p className="page-subtitle">Register a new book into the library collection.</p>
        </div>
      </div>

      <div className="addbook-wrapper">
        <div className="addbook-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid-2col">
              {/* Barcode */}
              <div className="form-group">
                <label className="form-label" htmlFor="barcode">
                  <Barcode size={16} className="w-4 h-4" />
                  Barcode
                </label>
                <input
                  id="barcode"
                  name="barcode"
                  type="text"
                  className="form-input"
                  placeholder="e.g. LIB-0001"
                  value={formData.barcode}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="title">
                  <Book size={16} className="w-4 h-4" />
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. The Great Gatsby"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Author */}
              <div className="form-group">
                <label className="form-label" htmlFor="author">
                  <User size={16} className="w-4 h-4" />
                  Author
                </label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  className="form-input"
                  placeholder="e.g. F. Scott Fitzgerald"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  <Tag size={16} className="w-4 h-4" />
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Fiction, Classic, Science"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Shelf Location */}
            <div className="form-group">
              <label className="form-label" htmlFor="shelf">
                <Layers size={16} className="w-4 h-4" />
                Shelf Location
              </label>
              <input
                id="shelf"
                name="shelf"
                type="text"
                className="form-input"
                placeholder="e.g. Shelf A-01, Section 2"
                value={formData.shelf}
                onChange={handleChange}
              />
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="w-5 h-5 animate-spin" />
                    Adding Book...
                  </>
                ) : (
                  <>
                    <Plus size={20} className="w-5 h-5" />
                    Add Book
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClear}
                disabled={loading}
              >
                <RotateCcw size={20} className="w-5 h-5" />
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default AddBook;
