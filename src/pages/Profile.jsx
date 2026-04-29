// src/pages/Profile.jsx

import Sidebar from "../components/Sidebar";
import { useState } from "react";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async () => {
    setMsg("");
    setSuccess(false);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMsg("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost/finance-tracker-web-app/backend/profile/change-password.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            old_password: oldPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        setSuccess(true);
        setMsg("Password changed successfully.");

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMsg(data.message);
      }
    } catch (error) {
      setMsg("Server error.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1f2937] min-h-screen">

      <Sidebar />

      <div className="h-screen overflow-y-auto p-5 md:p-8 text-white md:ml-56">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">Profile</h1>
          <p className="text-gray-400 mt-1">
            Manage your account settings
          </p>
        </div>

        {/* User Info */}
        <div className="bg-white/10 p-6 rounded-2xl mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Account Info
          </h2>

          <p><span className="text-gray-400">Username:</span> {user.username}</p>
          <p><span className="text-gray-400">Email:</span> {user.email}</p>
          <p><span className="text-gray-400">User ID:</span> {user.id}</p>
        </div>

        {/* Change Password */}
        <div className="bg-white/10 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">
            Change Password
          </h2>

          <div className="grid gap-4">

            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="p-3 rounded-xl bg-slate-800"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-3 rounded-xl bg-slate-800"
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-3 rounded-xl bg-slate-800"
            />

            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 rounded-xl py-3 font-semibold"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>

            {msg && (
              <p
                className={`text-sm ${
                  success ? "text-green-400" : "text-red-400"
                }`}
              >
                {msg}
              </p>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;