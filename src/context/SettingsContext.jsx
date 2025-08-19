// context/SettingsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    widgetStyles: {},
    widgetTitles: {}
  });

  

  // Load from localStorage on start
  useEffect(() => {
    const saved = localStorage.getItem('dashboardSettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (err) {
        console.error('Error parsing saved settings:', err);
      }
    }
  }, []);

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('dashboardSettings', JSON.stringify(settings));
  }, [settings]);

 

  const updateWidgetStyle = (id, style) => {
    setSettings(prev => ({
      ...prev,
      widgetStyles: {
        ...prev.widgetStyles,
        [id]: {
          ...prev.widgetStyles[id],
          ...style
        }
      }
    }));
  };

  const updateWidgetTitle = (id, title) => {
    setSettings(prev => ({
      ...prev,
      widgetTitles: {
        ...prev.widgetTitles,
        [id]: title
      }
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateWidgetStyle, updateWidgetTitle }}>
      {children}
    </SettingsContext.Provider>
  );
};
export default SettingsProvider;