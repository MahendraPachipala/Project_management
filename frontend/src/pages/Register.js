import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import {BASE_URL}  from "../config/baseURL";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userdata, setUserdata] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: ""
  });
  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    passwordMatch: "",
    server: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {
      full_name: userdata.full_name ? "" : "Full name is required",
      email: userdata.email
        ? emailPattern.test(userdata.email)
          ? ""
          : "Invalid email format"
        : "Email is required",
      password: userdata.password ? "" : "Password is required",
      confirm_password: userdata.confirm_password
        ? ""
        : "Confirm password is required",
      passwordMatch:
        userdata.password === userdata.confirm_password
          ? ""
          : "Passwords do not match",
      server: ""
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err && err !== newErrors.server)) return;

    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, {
        full_name: userdata.full_name,
        email: userdata.email,
        password: userdata.password
      });
      console.log("Registered:", res.data);
      alert("Registration successful!");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setErrors((prev) => ({ ...prev, server: "User with this email already exists" }));
      } else {
        setErrors((prev) => ({ ...prev, server: "Something went wrong. Please try again." }));
      }
    }
  };

  return (
    <div className="bg-[url('/public/Loginbg.jpg')] bg-cover bg-center bg-fixed min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-xl shadow-xl w-[90%] max-w-md fixed left-[20%]">
        <p className="text-white text-2xl text-center font-semibold">Register</p>

        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            name="full_name"
            placeholder="Enter your full name"
            onChange={handleChange}
            className="w-full pl-10 bg-transparent border-b border-gray-300 text-white placeholder-gray-300 p-2 focus:outline-none"
          />
        </div>
        {submitted && errors.full_name && (
          <p className="text-red-400 text-sm -mt-3">{errors.full_name}</p>
        )}

        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            className="w-full pl-10 bg-transparent border-b border-gray-300 text-white placeholder-gray-300 p-2 focus:outline-none"
          />
        </div>
        {submitted && errors.email && (
          <p className="text-red-400 text-sm -mt-3">{errors.email}</p>
        )}

        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            className="w-full pl-10 pr-10 bg-transparent border-b border-gray-300 text-white placeholder-gray-300 p-2 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {submitted && errors.password && (
          <p className="text-red-400 text-sm -mt-3">{errors.password}</p>
        )}

        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type={showPassword ? "text" : "password"}
            name="confirm_password"
            placeholder="Re-enter your password"
            onChange={handleChange}
            className="w-full pl-10 pr-10 bg-transparent border-b border-gray-300 text-white placeholder-gray-300 p-2 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {submitted && errors.confirm_password && (
          <p className="text-red-400 text-sm -mt-3">{errors.confirm_password}</p>
        )}
        {submitted && errors.passwordMatch && (
          <p className="text-red-400 text-sm -mt-3">{errors.passwordMatch}</p>
        )}

        {errors.server && (
          <p className="text-red-400 text-sm text-center">{errors.server}</p>
        )}

        <button
          onClick={handleSubmit}
          className="bg-gray-200 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded transition"
        >
          Register
        </button>

        <p className="text-white text-sm text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition duration-200"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
