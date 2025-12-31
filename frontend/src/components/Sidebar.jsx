import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  BarChart2, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="header-content">
          <div className="logo-container">
            <Zap className="logo-icon" size={28} />
            {!isCollapsed && <h2>BeyondAI</h2>}
          </div>
          {!isCollapsed && <p className="subtitle">Content Intelligence</p>}
        </div>
        
        <button 
          className="collapse-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>
        
        <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart2 size={20} />
          {!isCollapsed && <span>Analytics</span>}
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>
      </nav>

      {/* Footer can be used for version or account info later */}
      <div className="sidebar-footer">
        {!isCollapsed && <p className="version-text">By Sujnan Kumar</p>}
      </div>
    </div>
  );
};

export default Sidebar;
