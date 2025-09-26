import { FaFolderOpen } from "react-icons/fa";
import ProjectCard from "./ProjectCard";

const ProjectList = ({ projects, user, searchTerm, onDelete, onOpenMembers, onOpenProject }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <FaFolderOpen className="text-gray-500 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          {searchTerm ? "No projects found" : "No projects yet"}
        </h3>
        <p className="text-gray-500">{searchTerm ? "Try different search terms" : "Create your first project"}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((p) => (
        <ProjectCard
          key={p.project_id}
          project={p}
          user={user}
          onDelete={() => onDelete(p.project_id)}
          onOpenMembers={() => onOpenMembers(p)}
          onOpenProject={() => onOpenProject(p.project_id)}
        />
      ))}
    </div>
  );
};

export default ProjectList;
