import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Zap, RefreshCw, Box } from 'lucide-react';
import { triggerScraper } from '../services/articleService';

const Sidebar = () => {
  const [isProcessing, setIsProcessing] = useState(false);

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
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <Zap className="logo-icon" />
          <h2>BeyondAI</h2>
        </div>
        <p className="subtitle">Content Intelligence</p>
      </div>

      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="control-panel">
          <h3>Controls</h3>
          <button 
            className="control-btn primary" 
            onClick={handleRunScraper}
            disabled={isProcessing}
          >
            <RefreshCw size={18} className={isProcessing ? 'spin' : ''} />
            <span>{isProcessing ? 'Processing...' : 'Run AI Worker'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
