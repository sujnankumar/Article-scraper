import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, message, type = 'success' }) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
          
          <div className={`modal-icon ${isSuccess ? 'success' : 'error'}`}>
            {isSuccess ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
          </div>
          
          <h3 className="modal-title">{title}</h3>
          <p className="modal-message">{message}</p>
          
          <button className="modal-btn" onClick={onClose}>
            Got it
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
