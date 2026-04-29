import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    const res = await loginUser({ email, password });

    if (res.status === "success") {
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-gradient-to-r from-[#667eea] to-[#764ba2]">

      {/* Responsive Card */}
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            className="w-12 sm:w-14 mb-2"
            alt="Logo"
          />

          <h1 className="text-blue-500 text-2xl sm:text-3xl font-bold">
            Xenofin
          </h1>

          <p className="text-gray-400 text-sm sm:text-lg mt-2 text-center">
            Login to your account
          </p>
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded-xl text-gray-600 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-3 rounded-xl text-gray-600 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Error */}
        {error && (
          <p className="text-red-600 text-xs sm:text-sm mb-3 ml-1 font-semibold">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 p-3 rounded-xl text-white font-medium hover:bg-blue-600 active:scale-95 transition-all"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-gray-500 text-sm mt-5 text-center leading-6">
          Don’t have an account?{" "}
          <span
            className="text-blue-500 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Create account
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;