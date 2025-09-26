import { FaChartLine, FaSearch } from "react-icons/fa";

const Header = ({ user, searchTerm, setSearchTerm }) => (
  <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
            <FaChartLine className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            TeamFlow
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center space-x-3 bg-gray-700/30 rounded-lg px-4 py-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="font-semibold text-sm">
                {user.full_name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <span className="font-medium">{user.full_name || "User"}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
