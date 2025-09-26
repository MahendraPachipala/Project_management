import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/baseURL";
import { 
  FaTasks, 
  FaUserTie, 
  FaFolderOpen, 
  FaPlus, 
  FaUserPlus, 
  FaTrash, 
  FaChevronRight,
  FaUsers,
  FaChartLine,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateProject from "../components/CreateProject";
import AddMember from "../components/AddMember";

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState({});
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Filter projects based on search
  const filteredProjects = projects.filter(project =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.admin_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteProject = async (project_id) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await axios.delete(`${BASE_URL}/projects/delete`, {
          params: { project_id },
          withCredentials: true,
        });
        setProjects((prev) =>
          prev.filter((project) => project.project_id !== project_id)
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/projects/getprojects`, {
        withCredentials: true,
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/getuser`, { 
        withCredentials: true 
      });
      setUser(res.data);
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchProjects();
  }, []);

  // Calculate statistics
  const totalTasks = projects.reduce((sum, p) => sum + Number(p.tasks_count || 0), 0);
  const totalAdmins = [...new Set(projects.map((p) => p.admin_name))].length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                  <FaChartLine className="text-white text-xl" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  TeamFlow
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-3 bg-gray-700/30 rounded-lg px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-sm">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="font-medium">{user.name || 'User'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500/10 to-indigo-600/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Projects</p>
                <p className="text-3xl font-bold text-white mt-2">{projects.length}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <FaFolderOpen className="text-purple-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-white mt-2">{totalTasks}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <FaTasks className="text-blue-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-2xl p-6 backdrop-blur-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Project Admins</p>
                <p className="text-3xl font-bold text-white mt-2">{totalAdmins}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <FaUserTie className="text-green-400 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Projects</h2>
              <p className="text-gray-400 mt-1">Manage and collaborate on your projects</p>
            </div>
            <button
              onClick={() => setShowCreateProject(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <FaPlus className="text-sm" />
              <span>New Project</span>
            </button>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <FaFolderOpen className="text-gray-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                {searchTerm ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first project to get started'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateProject(true)}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition"
                >
                  Create Project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.project_id}
                  className="group bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer backdrop-blur-lg"
                  onClick={() => navigate(`/${project.project_id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white truncate flex-1 mr-2">
                      {project.project_name}
                    </h3>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {user.user_id === project.admin_id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(project.project_id);
                          }}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition text-red-400 hover:text-red-300"
                          title="Delete Project"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-300">
                      <FaUserTie className="text-purple-400 mr-2" />
                      <span className="text-sm">Admin: {project.admin_name}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaTasks className="text-blue-400 mr-2" />
                      <span className="text-sm">Tasks: {project.tasks_count || 0}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaUsers className="text-green-400 mr-2" />
                      <span className="text-sm">Members: {project.members_count || 1}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-gray-600/50">
                    <button
                      className="flex-1 bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-500/30 transition flex items-center justify-center space-x-1 text-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                        setShowMemberModal(true);
                      }}
                    >
                      <FaUserPlus className="text-xs" />
                      <span>Member</span>
                    </button>
                    <button
                      className="flex-1 bg-gray-600/30 text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-600/50 transition flex items-center justify-center space-x-1 text-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/${project.project_id}`);
                      }}
                    >
                      <span>Open</span>
                      <FaChevronRight className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateProject && (
        <CreateProject
          onClose={() => setShowCreateProject(false)}
          onSuccess={fetchProjects}
        />
      )}
      
      {showMemberModal && selectedProject && (
        <AddMember
          projectId={selectedProject.project_id}
          onClose={() => setShowMemberModal(false)}
          onSuccess={fetchProjects}
        />
      )}
    </div>
  );
};

export default Dashboard;
