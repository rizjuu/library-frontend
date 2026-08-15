import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import api from "./api";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Catalog from "./pages/Catalog";
import Circulation from "./pages/Circulation";
import AddBook from "./pages/AddBook";
import ToastContainer from "./components/ToastContainer";
import Footer from "./components/Footer";
import { LayoutDashboard, BookOpen, Repeat, PlusCircle } from "lucide-react";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toasts, setToasts] = useState([]);
  const [transactionCount, setTransactionCount] = useState(0);

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

  const mobileNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "books", label: "Books", icon: BookOpen },
    { id: "circulation", label: "Circulation", icon: Repeat },
    { id: "add-book", label: "Add", icon: PlusCircle },
  ];

  return (
    <div className="app-shell">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} />

      {/* Sidebar (desktop) */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Top header bar */}
      <Header />

      {/* Main content area */}
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

      {/* Mobile bottom nav */}
      <div className="mobile-nav">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`mobile-nav-btn ${activeTab === item.id ? "active" : ""}`}
              onClick={() => handleTabChange(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App;