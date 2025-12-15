import Topbar from "./Topbar";
import { useState, useEffect } from "react";

const DashboardLayout = ({ sidebar, children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-close sidebar on larger screens
      if (window.innerWidth >= 768 && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileSidebarOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (windowWidth < 768 && isMobileSidebarOpen) {
        // Check if click is outside sidebar
        const sidebar = document.querySelector('.sidebar-container');
        if (sidebar && !sidebar.contains(event.target)) {
          setIsMobileSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileSidebarOpen, windowWidth]);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden 
                    bg-[rgb(var(--bg))]">
      
      {/* TOPBAR */}
      <div className="w-full shrink-0">
        <Topbar 
          onMenuToggle={toggleMobileSidebar}
          isSidebarOpen={isMobileSidebarOpen}
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR */}
        <div className="sidebar-container h-full">
          {sidebar({
            isMobileOpen: isMobileSidebarOpen,
            onCloseMobile: closeMobileSidebar
          })}
        </div>

        {/* Overlay for mobile sidebar */}
        {isMobileSidebarOpen && windowWidth < 768 && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={closeMobileSidebar}
          />
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;