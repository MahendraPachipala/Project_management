import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import { FaTimes, FaUser, FaCalendarAlt, FaPlus } from "react-icons/fa";

const CreateTask = ({ projectId, onClose, onSuccess, projectUsers = [] }) => {
  const [form, setForm] = useState({
    title: "",
    project_id: projectId,
    description: "",
    due_date: "",
    assignedUsers: []
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleUserSelect = (user_id) => {
    setForm((prev) => {
      const exists = prev.assignedUsers.includes(user_id);
      return {
        ...prev,
        assignedUsers: exists
          ? prev.assignedUsers.filter((id) => id !== user_id)
          : [...prev.assignedUsers, user_id],
      };
    });
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!form.description.trim()) {
      setError("Description is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${BASE_URL}/tasks/createTask`, form, {
        withCredentials: true,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Create task error:", err);
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with glass morphism effect */}
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md transition-opacity duration-300"></div>
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 backdrop-blur-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-indigo-600/20 border-b border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                  <FaPlus className="text-white text-sm" />
                </div>
                Create New Task
              </h2>
              <p className="text-gray-400 text-sm mt-1">Add task details and assign team members</p>
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Task Title *
            </label>
            <input
              name="title"
              placeholder="Enter task title..."
              value={form.title}
              className="w-full bg-gray-700/50 border border-gray-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              onChange={handleChange}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Describe the task details..."
              value={form.description}
              rows="3"
              className="w-full bg-gray-700/50 border border-gray-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              onChange={handleChange}
            />
          </div>

          {/* Due Date */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              <FaCalendarAlt className="inline mr-2 text-blue-400" />
              Due Date
            </label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              min={getMinDate()}
              className="w-full bg-gray-700/50 border border-gray-600/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              onChange={handleChange}
            />
          </div>

          {/* Assigned Users */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              <FaUser className="inline mr-2 text-green-400" />
              Assign to Team Members
            </label>
            
            {projectUsers.length === 0 ? (
              <div className="text-center py-6 text-gray-500 bg-gray-700/30 rounded-xl border border-gray-600/30">
                <div className="text-3xl mb-2">👥</div>
                <p className="text-sm">No team members available</p>
                <p className="text-xs text-gray-400 mt-1">Add members to the project first</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-3 max-h-32 overflow-y-auto p-3 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                  {projectUsers.map((user) => (
                    <button
                      key={user.user_id}
                      type="button"
                      onClick={() => handleUserSelect(user.user_id)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        form.assignedUsers.includes(user.user_id)
                          ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/50 shadow-lg shadow-purple-500/20"
                          : "bg-gray-600/30 text-gray-300 border-gray-500/50 hover:bg-gray-600/50 hover:border-gray-400/50"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        form.assignedUsers.includes(user.user_id) ? "bg-purple-400" : "bg-gray-400"
                      }`}></span>
                      {user.full_name}
                      {form.assignedUsers.includes(user.user_id) && (
                        <span className="ml-1 text-purple-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  {form.assignedUsers.length} of {projectUsers.length} users selected
                </p>
              </>
            )}
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
            disabled={loading || !form.title.trim() || !form.description.trim()}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <FaPlus className="text-sm" />
                Create Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;