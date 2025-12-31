import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  RefreshCw, 
  BarChart2, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { triggerScraper } from '../services/articleService';

const Sidebar = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleRunScraper = async () => {
    try {
      setIsProcessing(true);
      await triggerScraper();
      alert('AI Processing Started! Check the console/logs for progress.');
    } catch (error) {
      console.error(error);
      alert('Failed to start processing.');
    } finally {
      setIsProcessing(false);
    }
  };

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

      <div className="sidebar-footer">
        <div className="control-panel">
          {!isCollapsed && <h3>Controls</h3>}
          <button 
            className={`control-btn primary ${isCollapsed ? 'icon-only' : ''}`} 
            onClick={handleRunScraper}
            disabled={isProcessing}
            title={isCollapsed ? "Run AI Worker" : ""}
          >
            <RefreshCw size={18} className={isProcessing ? 'spin' : ''} />
            {!isCollapsed && <span>{isProcessing ? 'Processing...' : 'Run AI Worker'}</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
