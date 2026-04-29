import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    transactions: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost/finance-tracker-web-app/backend/reports/dashboard.php?user_id=${user.id}`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1f2937]">

      <Sidebar />

      {/* CONTENT */}
      <div className="h-screen overflow-y-auto p-5 md:p-8 text-white md:ml-56">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome back, {user?.username} 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Your financial overview
          </p>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow hover:scale-105 transition">
                <h2 className="text-gray-300">Balance</h2>
                <p className="text-2xl md:text-3xl font-bold text-blue-400 mt-2">
                  Rs {data.balance}
                </p>
              </div>

              <div className="bg-green-500/10 backdrop-blur-lg p-6 rounded-2xl shadow hover:scale-105 transition">
                <h2 className="text-green-300">Income</h2>
                <p className="text-2xl md:text-3xl font-bold text-green-400 mt-2">
                  Rs {data.income}
                </p>
              </div>

              <div className="bg-red-500/10 backdrop-blur-lg p-6 rounded-2xl shadow hover:scale-105 transition">
                <h2 className="text-red-300">Expense</h2>
                <p className="text-2xl md:text-3xl font-bold text-red-400 mt-2">
                  Rs {data.expense}
                </p>
              </div>

            </div>

            {/* Transactions */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow">

              <h2 className="text-lg md:text-xl font-semibold mb-4">
                Recent Activity
              </h2>

              {data.transactions.length === 0 ? (
                <p className="text-gray-400">No transactions yet</p>
              ) : (
                data.transactions.map((t, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b border-white/10 py-3 hover:bg-white/5 px-2 rounded"
                  >
                    <div>
                      <p className="font-medium">{t.category}</p>
                      <p className="text-sm text-gray-400 capitalize">
                        {t.type}
                      </p>
                    </div>

                    <span
                      className={`font-bold ${
                        t.type === "income"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"} Rs {t.amount}
                    </span>
                  </div>
                ))
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Dashboard;