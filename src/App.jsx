import { useState, useEffect, useCallback } from "react";
import api from "./api";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";
import Catalog from "./pages/Catalog";
import Circulation from "./pages/Circulation";
import AddBook from "./pages/AddBook";
import ToastContainer from "./components/ToastContainer";
import Footer from "./components/Footer";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toasts, setToasts] = useState([]);
  const [transactionCount, setTransactionCount] = useState(0);

  // Toast Notifications Helper
  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Fetch Books from MongoDB Backend API
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/books");
      setBooks(res.data || []);
    } catch (err) {
      console.error("Failed to load books:", err);
      showToast("Unable to connect to MongoDB library server.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Tab Switch handler (Separate Page Routing)
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTransactionComplete = () => {
    setTransactionCount((prev) => prev + 1);
    fetchBooks();
  };

  const handleBookAdded = (newBook) => {
    if (newBook) {
      setBooks((prev) => [newBook, ...prev]);
    }
    fetchBooks();
  };

  // Stats Calculations
  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.available).length;
  const borrowedBooks = books.filter((b) => !b.available).length;

  return (
    <div className="app-container">
      {/* 3D Floating Ambient Spheres (from reference image) */}
      <div className="bg-spheres-container">
        <div className="sphere sphere-purple"></div>
        <div className="sphere sphere-cyan"></div>
        <div className="sphere sphere-amber"></div>
      </div>

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} />

      {/* Sticky Translucent Navbar Pill */}
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content Container - Separate Page Routing */}
      <main className="main-content">
        {/* Page 1: Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="page-view">
            <Hero onNavigate={handleTabChange} />
            <Dashboard
              totalBooks={totalBooks}
              availableBooks={availableBooks}
              borrowedBooks={borrowedBooks}
              totalTransactions={transactionCount}
            />
          </div>
        )}

        {/* Page 2: Book Catalog View */}
        {activeTab === "books" && (
          <div className="page-view">
            <Catalog
              books={books}
              loading={loading}
              onNavigateToAddBook={() => handleTabChange("add-book")}
            />
          </div>
        )}

        {/* Page 3: Circulation View */}
        {activeTab === "circulation" && (
          <div className="page-view">
            <Circulation
              onTransactionComplete={handleTransactionComplete}
              showToast={showToast}
            />
          </div>
        )}

        {/* Page 4: Add Book View */}
        {activeTab === "add-book" && (
          <div className="page-view">
            <AddBook
              onBookAdded={handleBookAdded}
              showToast={showToast}
            />
          </div>
        )}
      </main>

      {/* Centered Footer */}
      <Footer />
    </div>
  );
}

export default App;