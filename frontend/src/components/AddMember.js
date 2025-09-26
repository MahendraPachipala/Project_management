import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import { FaUserPlus, FaTimes, FaEnvelope, FaUserTag } from "react-icons/fa";

const AddMember = ({ projectId, onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [role, setRole] = useState("Member");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await axios.post(
        `${BASE_URL}/projects/${projectId}/add-member`,
        { email, role },
        { withCredentials: true }
      );
      setMsg(res.data.message);
      setEmail("");
      setRole("Member");
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with glass morphism */}
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md transition-opacity duration-300"></div>
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 backdrop-blur-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-indigo-600/20 border-b border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                <FaUserPlus className="text-white text-sm" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Add Team Member</h2>
                <p className="text-gray-400 text-sm mt-1">Invite members to collaborate</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-all duration-200 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              <FaEnvelope className="inline mr-2 text-blue-400" />
              Email Address *
            </label>
            <input
              type="email"
              placeholder="Enter user's email address..."
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setMsg("");
              }}
              className="w-full bg-gray-700/50 border border-gray-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              autoFocus
            />
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              <FaUserTag className="inline mr-2 text-green-400" />
              Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Member", "Admin"].map((roleOption) => (
                <button
                  key={roleOption}
                  type="button"
                  onClick={() => setRole(roleOption)}
                  className={`p-3 rounded-xl border transition-all duration-200 font-medium ${
                    role === roleOption
                      ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/50 shadow-lg shadow-purple-500/20"
                      : "bg-gray-700/30 text-gray-300 border-gray-600/50 hover:bg-gray-700/50"
                  }`}
                >
                  {roleOption}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {role === "Admin" ? "Admins can manage project settings and members" : "Members can view and collaborate on tasks"}
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                {error}
              </p>
            </div>
          )}

          {msg && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <p className="text-green-400 text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                {msg}
              </p>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 p-6 bg-gray-800/50 border-t border-gray-700/50">
          <button
            className="flex-1 px-4 py-3 bg-gray-700/50 text-gray-300 rounded-xl border border-gray-600/50 font-medium hover:bg-gray-700/70 hover:border-gray-500/50 transition-all duration-200 disabled:opacity-50"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            onClick={handleSubmit}
            disabled={loading || !email.trim()}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </>
            ) : (
              <>
                <FaUserPlus className="text-sm" />
                Add Member
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMember;