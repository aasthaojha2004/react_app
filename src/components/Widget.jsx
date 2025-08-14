// components/Widget.jsx
import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { scaleIn, exitFade } from '../utils/motionUtils';
import SettingsModal from './SettingModal';

const Widget = memo(function Widget({ id, title, description, children }) {
  const [showDescription, setShowDescription] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings } = useSettings();

  const toggleDescription = () => {
    setShowDescription(prev => !prev);
  };

  const widgetStyle = settings.widgetStyles[id] || {};
  const themeClass =
    settings.theme === 'dark'
      ? 'bg-gray-800 text-white'
      : 'bg-white text-gray-800';

  return (
    <motion.div
      variants={{ ...scaleIn, ...exitFade }}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={`shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 ${themeClass}`}
      style={widgetStyle}
      role="region"
      aria-label={`${title} widget`}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="text-gray-500 hover:text-gray-700"
          aria-label={`Open settings for ${title} widget`}
        >
          ⚙
        </button>
      </div>

      {showDescription && (
        <p id={`desc-${id}`} className="text-gray-600 mb-4">
          {description}
        </p>
      )}

      <button
        onClick={toggleDescription}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        aria-expanded={showDescription}
        aria-controls={`desc-${id}`}
      >
        {showDescription ? 'Hide' : 'Show'} Description
      </button>

      {children && <div className="mt-4">{children}</div>}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        widgetId={id}
      />
    </motion.div>
  );
});

export default Widget;
