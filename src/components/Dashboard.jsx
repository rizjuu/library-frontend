import { BookOpen, CheckCircle2, BookmarkX, Repeat } from "lucide-react";

function Dashboard({ totalBooks, availableBooks, borrowedBooks, totalTransactions = 0 }) {
  const stats = [
    {
      id: "total",
      label: "Total Books",
      value: totalBooks,
      desc: "Registered catalog items",
      icon: BookOpen
    },
    {
      id: "available",
      label: "Available Books",
      value: availableBooks,
      desc: "Ready for circulation checkout",
      icon: CheckCircle2
    },
    {
      id: "borrowed",
      label: "Borrowed Books",
      value: borrowedBooks,
      desc: "Currently issued to patrons",
      icon: BookmarkX
    },
    {
      id: "transactions",
      label: "Total Transactions",
      value: totalTransactions,
      desc: "Borrow & return logs",
      icon: Repeat
    }
  ];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="section-header-centered">
        <h2 className="section-title">
          <BookOpen size={32} />
          Library Overview
        </h2>
        <p className="section-subtitle">Quick overview of your library activity.</p>
      </div>

      <div className="dashboard-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="stat-glass-card">
              <div className="stat-icon-circle">
                <Icon size={24} />
              </div>
              <span className="stat-label-centered">{stat.label}</span>
              <div className="stat-number-large">{stat.value}</div>
              <span className="stat-desc-centered">{stat.desc}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
