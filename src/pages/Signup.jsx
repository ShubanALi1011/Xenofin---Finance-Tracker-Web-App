import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const handleSignup = async () => {
    setErrors({});

    // ✅ localhost link change kar ke live domain set kar diya hai
    const res = await fetch(
      "http://xenofin.gt.tc/auth/signup.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      }
    );

    const data = await res.json();

    if (data.status === "success") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: form.username,
          email: form.email
        })
      );

      navigate("/dashboard");
    } else {
      setErrors({
        [data.field]: data.message
      });
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
            alt="Logo"
            className="w-12 sm:w-14 mb-2"
          />

          <h1 className="text-blue-500 text-2xl sm:text-3xl font-bold">
            Xenofin
          </h1>

          <p className="text-gray-400 text-sm sm:text-lg mt-2 text-center">
            Signup to your account
          </p>
        </div>

        {/* Username */}
        <input
          placeholder="Username"
          className="w-full mb-3 p-3 rounded-xl text-gray-600 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value
            })
          }
        />

        {errors.username && (
          <p className="text-red-500 text-xs sm:text-sm mb-3">
            {errors.username}
          </p>
        )}

        {/* Email */}
        <input
          placeholder="Email"
          className="w-full mb-3 p-3 rounded-xl text-gray-600 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
        />

        {errors.email && (
          <p className="text-red-500 text-xs sm:text-sm mb-3">
            {errors.email}
          </p>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-xl text-gray-600 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />

        {/* Button */}
        <button
          onClick={handleSignup}
          className="w-full bg-blue-500 p-3 rounded-xl text-white font-medium hover:bg-blue-600 active:scale-95 transition-all"
        >
          Signup
        </button>

        {/* Footer */}
        <p className="text-gray-500 text-sm mt-5 text-center leading-6">
          Already have an account?{" "}
          <span
            className="text-blue-500 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;
