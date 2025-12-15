import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { Moon, Sun, User, LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Topbar = ({ onMenuToggle, isSidebarOpen }) => {
  const { toggleTheme, isDark } = useContext(ThemeContext);
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
    setShowUserMenu(false);
  };

  const handleProfileClick = () => {
    toast("Profile feature coming soon!", { icon: "👤" });
    setShowUserMenu(false);
  };

  return (
    <header className="w-full h-16 flex items-center justify-between
                       px-4 md:px-6 
                       bg-[rgb(var(--panel))]
                       border-b border-[rgb(var(--border))]
                       backdrop-blur-sm sticky top-0 z-50">
      
      {/* Left side - Menu Toggle (Mobile) & App Name */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-[rgb(var(--hover))] 
                     transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-[rgb(var(--text))]" />
          ) : (
            <Menu className="w-5 h-5 text-[rgb(var(--text))]" />
          )}
        </button>

        {/* App Name */}
        <span className="font-semibold text-lg text-[rgb(var(--text))]">
          BoloForm
        </span>
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center gap-2 md:gap-4 relative">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-[rgb(var(--hover))] 
                     transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 md:w-5 md:h-5 text-[rgb(var(--text))]" />
          ) : (
            <Moon className="w-4 h-4 md:w-5 md:h-5 text-[rgb(var(--text))]" />
          )}
        </button>

        {/* Desktop - User info with logout */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg 
                          bg-[rgb(var(--bg))] border border-[rgb(var(--border))]">
            <User className="w-4 h-4 text-[rgb(var(--muted))]" />
            <span className="text-sm font-medium text-[rgb(var(--text))]">
              {auth?.user?.name || "User"}
            </span>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg 
                       bg-red-50 text-red-600 hover:bg-red-100 
                       border border-red-200 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* Mobile - User menu dropdown */}
        <div className="md:hidden relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="p-2 rounded-lg bg-[rgb(var(--bg))] 
                       border border-[rgb(var(--border))]"
            aria-label="User menu"
          >
            <User className="w-5 h-5 text-[rgb(var(--muted))]" />
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowUserMenu(false)}
              />
              
              {/* Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 
                            bg-[rgb(var(--panel))] border border-[rgb(var(--border))]
                            rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="p-4 border-b border-[rgb(var(--border))]">
                  <p className="font-medium text-[rgb(var(--text))] truncate">
                    {auth?.user?.name || "User"}
                  </p>
                  <p className="text-sm text-[rgb(var(--muted))] truncate">
                    {auth?.user?.email || "user@example.com"}
                  </p>
                </div>
                
                <button
                  onClick={handleProfileClick}
                  className="w-full px-4 py-3 text-left hover:bg-[rgb(var(--hover))]
                           text-[rgb(var(--text))] flex items-center gap-3"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left hover:bg-red-50
                           text-red-600 flex items-center gap-3 border-t
                           border-[rgb(var(--border))]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;