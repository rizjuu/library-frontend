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

  // Toast Helper
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
      showToast("Unable to connect to library database server.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Handle Tab Switch & Smooth Scroll
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    let sectionId = "";
    if (tabId === "dashboard") sectionId = "dashboard-section";
    if (tabId === "books") sectionId = "catalog-section";
    if (tabId === "circulation") sectionId = "circulation-section";
    if (tabId === "add-book") sectionId = "add-book-section";

    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
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
      {/* Background Glowing Ambient Orbs */}
      <div className="bg-glow-container">
        <div className="bg-glow-orb bg-glow-orb-1"></div>
        <div className="bg-glow-orb bg-glow-orb-2"></div>
        <div className="bg-glow-orb bg-glow-orb-3"></div>
      </div>

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} />

      {/* 1. Header / Hero Section */}
      <div id="hero">
        <Hero onNavigate={handleTabChange} />
      </div>

      {/* 2. Sticky Navigation Bar */}
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content Sections */}
      <main className="main-content">
        {/* 3. Dashboard Overview */}
        <Dashboard
          totalBooks={totalBooks}
          availableBooks={availableBooks}
          borrowedBooks={borrowedBooks}
          totalTransactions={transactionCount}
        />

        {/* 4. Book Catalog Section */}
        <Catalog
          books={books}
          loading={loading}
          onNavigateToAddBook={() => handleTabChange("add-book")}
        />

        {/* 5. Book Circulation Section */}
        <Circulation
          onTransactionComplete={handleTransactionComplete}
          showToast={showToast}
        />

        {/* 6. Add Book Section */}
        <AddBook
          onBookAdded={handleBookAdded}
          showToast={showToast}
        />
      </main>

      {/* 7. Footer Section */}
      <Footer />
    </div>
  );
}

export default App;