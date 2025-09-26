import { FaTasks, FaUserTie, FaFolderOpen } from "react-icons/fa";

const StatsGrid = ({ projects, totalTasks, totalAdmins }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <div className="bg-gradient-to-br from-purple-500/10 to-indigo-600/10 border border-purple-500/20 rounded-2xl p-6">
      <p className="text-purple-300 text-sm font-medium">Total Projects</p>
      <p className="text-3xl font-bold text-white mt-2">{projects.length}</p>
      <FaFolderOpen className="text-purple-400 text-xl mt-4" />
    </div>
    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-6">
      <p className="text-blue-300 text-sm font-medium">Total Tasks</p>
      <p className="text-3xl font-bold text-white mt-2">{totalTasks}</p>
      <FaTasks className="text-blue-400 text-xl mt-4" />
    </div>
    <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-2xl p-6">
      <p className="text-green-300 text-sm font-medium">Project Admins</p>
      <p className="text-3xl font-bold text-white mt-2">{totalAdmins}</p>
      <FaUserTie className="text-green-400 text-xl mt-4" />
    </div>
  </div>
);

export default StatsGrid;
