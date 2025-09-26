import { FaUserTie, FaTasks, FaUsers, FaUserPlus, FaChevronRight, FaTrash } from "react-icons/fa";

const ProjectCard = ({ project, user, onDelete, onOpenMembers, onOpenProject }) => (
  <div
    className="group bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all hover:scale-105 cursor-pointer"
    onClick={onOpenProject}
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-semibold text-white truncate">{project.project_name}</h3>
      {user.user_id === project.admin_id && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300"
        >
          <FaTrash className="text-sm" />
        </button>
      )}
    </div>

    <div className="space-y-2 mb-4 text-gray-300">
      <p><FaUserTie className="inline text-purple-400 mr-2" /> Admin: {project.admin_name}</p>
      <p><FaTasks className="inline text-blue-400 mr-2" /> Tasks: {project.tasks_count || 0}</p>
      <p><FaUsers className="inline text-green-400 mr-2" /> Members: {project.members_count || 1}</p>
    </div>

    <div className="flex space-x-2 pt-4 border-t border-gray-600/50">
      <button
        className="flex-1 bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-500/30"
        onClick={(e) => { e.stopPropagation(); onOpenMembers(); }}
      >
        <FaUserPlus className="inline text-xs mr-1" /> Member
      </button>
      <button
        className="flex-1 bg-gray-600/30 text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-600/50"
        onClick={(e) => { e.stopPropagation(); onOpenProject(); }}
      >
        Open <FaChevronRight className="inline text-xs ml-1" />
      </button>
    </div>
  </div>
);

export default ProjectCard;
