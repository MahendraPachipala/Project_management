import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import CreateTask from "../components/CreateTask";
import {
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaSearch,
  FaCalendarAlt,
  FaCheckCircle,
  FaPlayCircle,
  FaBan,
  FaUserCircle,
  FaUsers
} from "react-icons/fa";

const ProjectDetails = () => {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("")
  const [currentUser, setCurrentUser] = useState({});
  // Fetch project details
  const fetchProjectDetails = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/projects/getpojectDetails`, {
        params: { project_id },
        withCredentials: true
      });
      setProject(result.data);
    } catch (err) {
      console.error("Failed to fetch project details:", err);
    }
  };
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/getuser`, { 
        withCredentials: true 
      });
      setCurrentUser(res.data);
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  };
  // Fetch all users in this project
  const fetchUsers = async () => {
    try {
      const result = await axios.post(
        `${BASE_URL}/projects/getusersbyproject`,
        { project_id },
        { withCredentials: true }
      );
      setUsers(result.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  // Fetch tasks with assigned users
  const fetchTasks = async () => {
    try {
      const result = await axios.post(
        `${BASE_URL}/tasks/getTasks`,
        { project_id },
        { withCredentials: true }
      );

      const allTasks = result.data;
      

      const loggedInUserId = currentUser.user_id;
      
      if (project?.admin_id === loggedInUserId) {
        setTasks(allTasks); 
        console.log(allTasks);// Admin sees all tasks
      } else {
        // Members see only tasks assigned to them
        const filteredTasks = allTasks.filter((task) =>
          task.assigned_users?.includes(loggedInUserId)
        );
        setTasks(filteredTasks);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProjectDetails(), fetchUsers(),fetchCurrentUser()]);
      await fetchTasks();
      setLoading(false);
    };
    loadData();
  }, [project_id, project?.admin_id]);

  // Delete a task
  const deleteTask = async (task_id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`${BASE_URL}/tasks/deleteTask`, {
          params: { task_id },
          withCredentials: true,
        });
        setTasks((prev) => prev.filter((task) => task.task_id !== task_id));
      } catch (err) {
        console.error("Delete task failed:", err.response?.data || err.message);
      }
    }
  };

  // Update task status
  const updateTask = async (task_id, status) => {
    try {
      await axios.post(
        `${BASE_URL}/tasks/updateTask`,
        { task_id, status },
        { withCredentials: true }
      );
      setTasks((prev) =>
        prev.map((task) =>
          task.task_id === task_id ? { ...task, status } : task
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Status configuration
  const statusConfig = {
    "Not Started": { color: "text-gray-600", icon: FaCalendarAlt },
    "In Progress": { color: "text-blue-600", icon: FaPlayCircle },
    "Completed": { color: "text-green-600", icon: FaCheckCircle },
    "Blocked": { color: "text-red-600", icon: FaBan }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === "All" || task.status === filterStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-700/50 rounded-lg">
              <FaArrowLeft className="text-gray-300" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{project?.project_name}</h1>
              <p className="text-gray-400 text-sm">Manage tasks and team members</p>
            </div>
          </div>
          <button
            onClick={() => setShowTaskModal(true)}
            className="bg-blue-600 px-6 py-3 rounded-xl text-white flex items-center gap-2"
          >
            <FaPlus /> New Task
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Tasks</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 rounded bg-gray-700/50"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1 rounded bg-gray-700/50"
                >
                  <option value="All">All</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>

            {tasks.length === 0 ? (
              <p className="text-gray-400 text-center py-6">No tasks found</p>
            ) : (
              <div className="space-y-4">
              {console.log(tasks)}
                {tasks.map((task) => {
                  const StatusIcon = statusConfig[task.status]?.icon || FaCalendarAlt;
                  return (
                    <div key={task.task_id} className="bg-gray-700/50 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{task.title}</h3>
                        <p className="text-gray-300">{task.description}</p>
                        <div className="flex gap-2 mt-1 text-sm">
                          <StatusIcon /> <span>{task.status}</span>
                          <FaCalendarAlt /> <span>{task.due_date}</span>
                        </div>
                        {project?.admin_id && (
                          <div className="text-gray-400 text-xs mt-1">
                            Assigned: {task.assigned_users?.map(u => {
                              const userObj = users.find(user => user.user_id === u);
                              return userObj ? userObj.full_name : "Unknown";
                            }).join(", ")}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => deleteTask(task.task_id)} className="text-red-400"><FaTrash /></button>
                        <select
                          value={task.status}
                          onChange={(e) => updateTask(task.task_id, e.target.value)}
                          className="px-2 py-1 rounded bg-gray-700/50 text-sm"
                        >
                          {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div>
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <FaUsers />
              <h2 className="font-bold">Team Members</h2>
            </div>
            <div className="space-y-2">
              {users.map(user => (
                <div key={user.user_id} className="flex items-center gap-2 p-2 rounded bg-gray-700/50">
                  <FaUserCircle />
                  <div>
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  <span className={`ml-auto px-2 py-1 rounded text-xs ${user.role === 'Admin' ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <CreateTask
          projectId={project_id}
          onClose={() => setShowTaskModal(false)}
          onSuccess={fetchTasks}
          projectUsers={users} // Pass project users
        />
      )}
    </div>
  );
};

export default ProjectDetails;
