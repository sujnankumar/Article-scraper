import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="not-found-content"
      >
        <div className="error-icon-wrapper">
          <AlertTriangle size={64} className="error-icon" />
        </div>
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link to="/" className="home-link">
          <Home size={20} />
          <span>Return to Dashboard</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
