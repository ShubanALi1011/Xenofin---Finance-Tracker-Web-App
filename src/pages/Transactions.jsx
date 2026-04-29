import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

function Transactions() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
    date: ""
  });

  // LOAD
  const loadTransactions = () => {
    fetch(
      `http://localhost/finance-tracker-web-app/backend/transactions/get.php?user_id=${user.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // ADD
  const handleAdd = async () => {
    await fetch(
      "http://localhost/finance-tracker-web-app/backend/transactions/add.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          user_id: user.id
        })
      }
    );

    resetForm();
    loadTransactions();
  };

  // EDIT
  const handleEdit = (t) => {
    setEditing(t.id);

    setForm({
      amount: t.amount,
      type: t.type,
      category: t.category,
      description: t.description,
      date: t.date
    });
  };

  // UPDATE
  const handleUpdate = async () => {
    await fetch(
      "http://localhost/finance-tracker-web-app/backend/transactions/update.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: editing,
          ...form
        })
      }
    );

    setEditing(null);
    resetForm();
    loadTransactions();
  };

  // DELETE
  const handleDelete = async (id) => {
    await fetch(
      "http://localhost/finance-tracker-web-app/backend/transactions/delete.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      }
    );

    loadTransactions();
  };

  const resetForm = () => {
    setForm({
      amount: "",
      type: "expense",
      category: "",
      description: "",
      date: ""
    });
  };

  return (
    <div className="bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1f2937] min-h-screen">

      <Sidebar />

      <div className="p-4 md:p-8 text-white md:ml-56">

        {/* HEADER */}
        <div className="mb-8 pt-14 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold">
            Transactions
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your finances
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white/15 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow mb-8">

          <h2 className="mb-4 font-semibold">
            {editing ? "Edit Transaction" : "Add Transaction"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">

            <input
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              className="p-3 bg-slate-800 rounded-xl"
            />

            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              className="p-3 bg-slate-800 rounded-xl text-white"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="p-3 bg-slate-800 rounded-xl"
            />

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value
                })
              }
              className="p-3 bg-slate-800 rounded-xl"
            />

            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              className="p-3 bg-slate-800 rounded-xl"
            />

            <button
              onClick={editing ? handleUpdate : handleAdd}
              className={`rounded-xl px-4 py-3 font-medium ${
                editing
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {editing ? "Update" : "Add"}
            </button>

          </div>

        </div>

        {/* LIST */}
        <div className="bg-white/15 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow">

          <h2 className="mb-4 font-semibold text-xl">
            All Transactions
          </h2>

          {loading ? (
            "Loading..."
          ) : (
            <div className="space-y-4">

              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="bg-white/5 rounded-2xl p-4"
                >

                  {/* MOBILE + DESKTOP */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* LEFT */}
                    <div className="flex-1">
                      <p className="font-bold text-lg">
                        {t.category}
                      </p>

                      <p className="text-sm text-gray-400 break-words">
                        {t.description}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {t.date}
                      </p>
                    </div>

                    {/* CENTER */}
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          t.type === "income"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {t.type}
                      </span>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">

                      <p
                        className={`font-bold text-xl ${
                          t.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        Rs {t.amount}
                      </p>

                      <div className="flex gap-2">

                        <button
                          onClick={() => handleEdit(t)}
                          className="bg-blue-500 px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(t.id)
                          }
                          className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Transactions;