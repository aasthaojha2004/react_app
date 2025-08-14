// components/SettingsModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useSettings } from '../context/SettingsContext';

const SettingsModal = ({ isOpen, onClose, widgetId }) => {
  const { settings, updateWidgetStyle, updateWidgetTitle } = useSettings();

  const currentStyle = settings.widgetStyles[widgetId] || {};
  const currentTitle = settings.widgetTitles?.[widgetId] || '';

  const [color, setColor] = useState(currentStyle.backgroundColor || '#fef3c7');
  const [title, setTitle] = useState(currentTitle);

  useEffect(() => {
    setColor(currentStyle.backgroundColor || '#fef3c7');
    setTitle(currentTitle);
  }, [currentStyle, currentTitle]);

  const handleSave = () => {
    updateWidgetStyle(widgetId, { backgroundColor: color });
    updateWidgetTitle(widgetId, title);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Customize Widget</h2>

      {/* Title */}
      <label className="block mb-2">Widget Title:</label>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border rounded px-2 py-1 mb-4 w-full"
        placeholder="Enter widget title"
      />

      {/* Background Color */}
      <label className="block mb-2">Background Color:</label>
      <input
        type="color"
        value={color}
        onChange={e => setColor(e.target.value)}
        className="mb-4"
      />

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save
      </button>
    </Modal>
  );
};

export default SettingsModal;
