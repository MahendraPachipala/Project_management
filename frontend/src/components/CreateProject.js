import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import { FaFolderPlus, FaTimes, FaCalendarAlt, FaAlignLeft } from "react-icons/fa";

const CreateProject = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    project_name: "",
    description: "",
    deadline: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.project_name.trim() || !form.description.trim() || !form.deadline) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${BASE_URL}/projects/createproject`, form, {
        withCredentials: true,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get minimum date for deadline (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
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
                <FaFolderPlus className="text-white text-sm" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create New Project</h2>
                <p className="text-gray-400 text-sm mt-1">Start a new collaboration space</p>
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
          {/* Project Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Project Name *
            </label>
            <input
              name="project_name"
              placeholder="Enter project name..."
              value={form.project_name}
              className="w-full bg-gray-700/50 border border-gray-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              onChange={handleChange}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              <FaAlignLeft className="inline mr-2 text-blue-400" />
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Describe your project..."
              value={form.description}
              rows="3"
              className="w-full bg-gray-700/50 border border-gray-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              onChange={handleChange}
            />
          </div>

          {/* Deadline */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              <FaCalendarAlt className="inline mr-2 text-green-400" />
              Deadline *
            </label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              min={getMinDate()}
              className="w-full bg-gray-700/50 border border-gray-600/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              onChange={handleChange}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                {error}
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
            disabled={loading || !form.project_name.trim() || !form.description.trim() || !form.deadline}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <FaFolderPlus className="text-sm" />
                Create Project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;