import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import api from "./api";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme Management (Light by default matching UI screenshot, Dark mode support)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app-theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/books");
      setBooks(res.data || []);
    } catch (err) {
      console.error("Failed to load books:", err);
      showToast("Unable to connect to library database.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
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

  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.available).length;
  const borrowedBooks = books.filter((b) => !b.available).length;

  return (
    <div className="app-shell">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />

      {/* Backdrop overlay for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Top Header Bar */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        onNavigate={handleTabChange}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <Dashboard
              key="dashboard"
              totalBooks={totalBooks}
              availableBooks={availableBooks}
              borrowedBooks={borrowedBooks}
              totalTransactions={transactionCount}
              books={books}
              onNavigate={handleTabChange}
            />
          )}

          {activeTab === "books" && (
            <Catalog
              key="books"
              books={books}
              loading={loading}
              onNavigateToAddBook={() => handleTabChange("add-book")}
            />
          )}

          {activeTab === "circulation" && (
            <Circulation
              key="circulation"
              onTransactionComplete={handleTransactionComplete}
              showToast={showToast}
            />
          )}

          {activeTab === "add-book" && (
            <AddBook
              key="add-book"
              onBookAdded={handleBookAdded}
              showToast={showToast}
            />
          )}
        </AnimatePresence>

        <Footer />
      </main>
    </div>
  );
}

export default App;