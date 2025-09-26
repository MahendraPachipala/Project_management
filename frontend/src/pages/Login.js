import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/baseURL";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/login`, 
        { email, password },
        { withCredentials: true }
      );
      console.log("Login success:", res.data);
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="bg-[url('/public/Loginbg.jpg')] bg-cover bg-center bg-fixed min-h-screen flex items-center justify-center">
      <div className="flex-col flex gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-xl shadow-xl w-[90%] max-w-md fixed left-[20%]">
        <p className="text-white text-2xl text-center font-semibold">LOGIN</p>

        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            className="w-full pl-10 bg-transparent border-b border-gray-300 text-white placeholder-gray-300 p-2 focus:outline-none"
            type="email"
            placeholder="Enter your user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full pl-10 pr-10 bg-transparent border-b border-gray-300 text-white placeholder-gray-300 p-2 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          onClick={handleLogin}
          className="bg-gray-200 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded transition"
        >
          Login
        </button>

        <p className="text-white text-sm text-center">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition duration-200"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
