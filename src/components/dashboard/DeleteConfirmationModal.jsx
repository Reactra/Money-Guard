// src/components/dashboard/DeleteConfirmationModal.jsx
import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ onClose, onConfirm }) => {
  return (
    // Dışarı tıklamayı yakalayan katman
    <div className="del-modal-backdrop" onClick={onClose}>
      
      {/* Asıl modal içeriği */}
      <div 
        className="del-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <p className="del-modal-text">
          Bu işlemi silmek istediğinizden emin misiniz?
        </p>

        <div className="del-modal-actions">
          <button 
            className="del-btn del-btn-primary" 
            onClick={onConfirm}
          >
            DELETE
          </button>
          <button 
            className="del-btn del-btn-secondary" 
            onClick={onClose}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;