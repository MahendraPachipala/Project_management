import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";

import Header from "../components/Header";
import Loader from "../components/Loader";
import StatsGrid from "../components/StatsGrid";
import ProjectList from "../components/ProjectList";
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

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/projects/getprojects`, { withCredentials: true });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/getuser`, { withCredentials: true });
      setUser(res.data);
    } catch {
      navigate("/login");
    }
  };

  const deleteProject = async (project_id) => {
    if (window.confirm("Delete this project?")) {
      await axios.delete(`${BASE_URL}/projects/delete`, { params: { project_id }, withCredentials: true });
      setProjects((prev) => prev.filter((p) => p.project_id !== project_id));
    }
  };

  useEffect(() => { fetchUser(); fetchProjects(); }, []);

  const totalTasks = projects.reduce((sum, p) => sum + Number(p.tasks_count || 0), 0);
  const totalAdmins = [...new Set(projects.map((p) => p.admin_name))].length;

  if (loading) return <Loader />;

  const filteredProjects = projects.filter(
    (p) =>
      p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.admin_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <Header user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <StatsGrid projects={projects} totalTasks={totalTasks} totalAdmins={totalAdmins} />
        <ProjectList
          projects={filteredProjects}
          user={user}
          searchTerm={searchTerm}
          onDelete={deleteProject}
          onOpenMembers={(p) => { setSelectedProject(p); setShowMemberModal(true); }}
          onOpenProject={(id) => navigate(`/${id}`)}
        />
      </div>
      {showCreateProject && <CreateProject onClose={() => setShowCreateProject(false)} onSuccess={fetchProjects} />}
      {showMemberModal && selectedProject && (
        <AddMember projectId={selectedProject.project_id} onClose={() => setShowMemberModal(false)} onSuccess={fetchProjects} />
      )}
    </div>
  );
};

export default Dashboard;
