// src/pages/Reports.jsx

import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

function Reports() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#ef4444",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
  ];

  // LOAD DATA
  useEffect(() => {
    fetch(
      `http://localhost/finance-tracker-web-app/backend/transactions/get.php?user_id=${user.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      });
  }, []);

  // TOTALS
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  // CATEGORY EXPENSE DATA
  const categoryMap = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      if (!categoryMap[t.category]) categoryMap[t.category] = 0;
      categoryMap[t.category] += Number(t.amount);
    });

  const pieData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  // MONTHLY DATA
  const monthMap = {};

  transactions.forEach((t) => {
    const month = t.date?.slice(0, 7);

    if (!monthMap[month]) {
      monthMap[month] = {
        month,
        income: 0,
        expense: 0,
      };
    }

    if (t.type === "income") {
      monthMap[month].income += Number(t.amount);
    } else {
      monthMap[month].expense += Number(t.amount);
    }
  });

  const barData = Object.values(monthMap);

  return (
    <div className="bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1f2937] min-h-screen">

      <Sidebar />

      <div className="h-screen overflow-y-auto p-5 md:p-8 text-white md:ml-56">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Reports & Analytics
          </h1>
          <p className="text-gray-400 mt-1">
            Visualize your financial performance
          </p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* TOP CARDS */}
            <div className="grid md:grid-cols-3 gap-5 mb-8">

              <div className="bg-white/15 backdrop-blur-lg p-6 rounded-2xl shadow">
                <p className="text-gray-400">Total Income</p>
                <h2 className="text-3xl font-bold text-green-400 mt-2">
                  Rs {income}
                </h2>
              </div>

              <div className="bg-white/15 backdrop-blur-lg p-6 rounded-2xl shadow">
                <p className="text-gray-400">Total Expense</p>
                <h2 className="text-3xl font-bold text-red-400 mt-2">
                  Rs {expense}
                </h2>
              </div>

              <div className="bg-white/15 backdrop-blur-lg p-6 rounded-2xl shadow">
                <p className="text-gray-400">Net Balance</p>
                <h2
                  className={`text-3xl font-bold mt-2 ${
                    balance >= 0
                      ? "text-blue-400"
                      : "text-red-400"
                  }`}
                >
                  Rs {balance}
                </h2>
              </div>

            </div>

            {/* CHARTS */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* PIE CHART */}
              <div className="bg-white/15 backdrop-blur-lg p-6 rounded-2xl shadow">
                <h2 className="text-xl font-semibold mb-5">
                  Expense by Category
                </h2>

                {pieData.length === 0 ? (
                  <p className="text-gray-400">
                    No expense data available
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        dataKey="value"
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}

              </div>

              {/* BAR CHART */}
              <div className="bg-white/15 backdrop-blur-lg p-6 rounded-2xl shadow">
                <h2 className="text-xl font-semibold mb-5">
                  Monthly Income vs Expense
                </h2>

                {barData.length === 0 ? (
                  <p className="text-gray-400">
                    No monthly data available
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="income" fill="#10b981" />
                      <Bar dataKey="expense" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                )}

              </div>

            </div>

            {/* RECENT SUMMARY */}
            <div className="bg-white/15 backdrop-blur-lg p-6 rounded-2xl shadow mt-8">

              <h2 className="text-xl font-semibold mb-4">
                Quick Insights
              </h2>

              <div className="space-y-3 text-gray-300">

                <p>
                  • Highest Expense Category:{" "}
                  <span className="text-white font-semibold">
                    {pieData.length > 0
                      ? pieData.sort((a, b) => b.value - a.value)[0]
                          .name
                      : "N/A"}
                  </span>
                </p>

                <p>
                  • Savings Rate:{" "}
                  <span className="text-white font-semibold">
                    {income > 0
                      ? Math.round((balance / income) * 100)
                      : 0}
                    %
                  </span>
                </p>

                <p>
                  • Total Transactions:{" "}
                  <span className="text-white font-semibold">
                    {transactions.length}
                  </span>
                </p>

              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Reports;