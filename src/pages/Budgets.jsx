// src/pages/Budgets.jsx

import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

function Budgets() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    category: "",
    amount: "",
    month: "",
  });

  const loadBudgets = () => {
    fetch(
      `http://localhost/finance-tracker-web-app/backend/budgets/get.php?user_id=${user.id}&t=${Date.now()}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBudgets(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const resetForm = () => {
    setForm({
      category: "",
      amount: "",
      month: "",
    });
  };

  const handleAdd = async () => {
    await fetch(
      "http://localhost/finance-tracker-web-app/backend/budgets/add.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          user_id: user.id,
        }),
      }
    );

    resetForm();
    loadBudgets();
  };

  const handleEdit = (item) => {
    setEditing(item.id);

    setForm({
      category: item.category,
      amount: item.amount,
      month: item.month,
    });
  };

  const handleUpdate = async () => {
    await fetch(
      "http://localhost/finance-tracker-web-app/backend/budgets/update.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editing,
          ...form,
        }),
      }
    );

    setEditing(null);
    resetForm();
    loadBudgets();
  };

  const handleDelete = async (id) => {
    await fetch(
      "http://localhost/finance-tracker-web-app/backend/budgets/delete.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    loadBudgets();
  };

  return (
    <div className="bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1f2937] min-h-screen">
      <Sidebar />

      <div className="h-screen overflow-y-auto p-5 md:p-8 text-white md:ml-56">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Budgets</h1>
          <p className="text-gray-400 mt-1">
            Manage category wise monthly budgets
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white/15 backdrop-blur-lg p-6 rounded-2xl shadow mb-8">

          <h2 className="mb-4 font-semibold">
            {editing ? "Edit Budget" : "Add Budget"}
          </h2>

          <div className="grid md:grid-cols-4 gap-4">

            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="p-3 bg-slate-800 rounded-xl"
            />

            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              className="p-3 bg-slate-800 rounded-xl"
            />

            <input
              type="month"
              value={form.month}
              onChange={(e) =>
                setForm({ ...form, month: e.target.value })
              }
              className="p-3 bg-slate-800 rounded-xl"
            />

            {/* ONLY FIXED BUTTON HEIGHT */}
            <button
              onClick={editing ? handleUpdate : handleAdd}
              className={`rounded-xl px-4 font-semibold h-12 md:h-auto ${
                editing
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {editing ? "Update" : "Add Budget"}
            </button>

          </div>

        </div>

        {/* LIST */}
        <div className="bg-white/15 backdrop-blur-lg p-6 rounded-2xl shadow">

          <h2 className="mb-4 font-semibold">All Budgets</h2>

          {loading ? (
            "Loading..."
          ) : (
            <div className="space-y-4">

              {budgets.map((item) => {
                const budget = Number(item.amount);
                const spent = Number(item.spent || 0);

                const percent =
                  budget > 0
                    ? Math.min((spent / budget) * 100, 100)
                    : 0;

                return (
                  <div
                    key={item.id}
                    className="w-full bg-white/5 p-5 rounded-2xl"
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

                      <div>
                        <p className="text-xl font-bold">
                          {item.category}
                        </p>

                        <p className="text-sm text-gray-400">
                          {item.month}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="font-bold text-blue-400">
                          Rs {budget}
                        </p>

                        <p className="text-sm text-gray-400">
                          Spent: Rs {spent}
                        </p>
                      </div>

                    </div>

                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-4">
                      <div
                        className={`h-3 ${
                          spent > budget
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    <div className="flex gap-3">

                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Budgets;