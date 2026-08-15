import { BookOpen, CheckCircle2, BookmarkX, Repeat } from "lucide-react";

function Dashboard({ totalBooks, availableBooks, borrowedBooks, totalTransactions = 0 }) {
  const stats = [
    {
      id: "total",
      label: "Total Books",
      value: totalBooks,
      desc: "Books registered in MongoDB catalog",
      icon: BookOpen,
      accentClass: "stat-accent-total"
    },
    {
      id: "available",
      label: "Available Books",
      value: availableBooks,
      desc: "Ready for circulation checkout",
      icon: CheckCircle2,
      accentClass: "stat-accent-available"
    },
    {
      id: "borrowed",
      label: "Borrowed Books",
      value: borrowedBooks,
      desc: "Currently issued to patrons",
      icon: BookmarkX,
      accentClass: "stat-accent-borrowed"
    },
    {
      id: "transactions",
      label: "Total Transactions",
      value: totalTransactions,
      desc: "Borrow and return record count",
      icon: Repeat,
      accentClass: "stat-accent-transactions"
    }
  ];

  return (
    <section id="dashboard-section" className="section-wrapper">
      <div className="section-header">
        <h2 className="section-title">
          <BookOpen size={32} className="text-gradient-purple" />
          Library Overview
        </h2>
        <p className="section-subtitle">Quick overview of your library activity.</p>
      </div>

      <div className="dashboard-grid">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className={`stat-card ${stat.accentClass}`}>
              <div className="stat-top">
                <span className="stat-label">{stat.label}</span>
                <div className="stat-icon-wrapper">
                  <Icon size={24} />
                </div>
              </div>

              <div>
                <div className="stat-number">{stat.value}</div>
                <div className="stat-desc">{stat.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Dashboard;
