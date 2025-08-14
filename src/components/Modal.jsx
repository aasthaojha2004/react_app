// components/Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2">✖</button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') // Add this div in index.html
  );
};

export default Modal;
