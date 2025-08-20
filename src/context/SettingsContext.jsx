// context/SettingsContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();
export const useSettings = () => useContext(SettingsContext);

const defaultSettings = {
  theme: "light",
  widgetStyles: {},
  widgetTitles: {},
  layoutMode: "grid",
  widgets: [],

  // ✅ NEW: Persistent states for widgets
  calculatorHistory: [], // stores past calculations
  calendarMarks: [],     // stores marked dates with reasons
};

export const SettingsProvider = ({ children }) => {
  // Keep all dashboard settings (including theme) in ONE object
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem("dashboardSettings");
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) }; // ✅ merge with defaults
      } catch (err) {
        console.error("Error parsing saved settings:", err);
      }
    }
    return defaultSettings;
  });

  // Apply theme class to <html> whenever settings.theme changes
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(settings.theme);
  }, [settings.theme]);

  // Save everything to localStorage whenever settings change
  useEffect(() => {
    console.log("💾 Saving settings to localStorage:", settings);
    localStorage.setItem("dashboardSettings", JSON.stringify(settings));
  }, [settings]);

  // --------------------------
  // Actions
  // --------------------------

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  const updateWidgetStyle = (id, style) => {
    setSettings((prev) => ({
      ...prev,
      widgetStyles: {
        ...prev.widgetStyles,
        [id]: {
          ...prev.widgetStyles[id],
          ...style,
        },
      },
    }));
  };

  const updateWidgetTitle = (id, title) => {
    setSettings((prev) => ({
      ...prev,
      widgetTitles: {
        ...prev.widgetTitles,
        [id]: title,
      },
    }));
  };

  const addWidget = (widget) => {
    setSettings((prev) => ({
      ...prev,
      widgets: prev.widgets.some((w) => w.id === widget.id)
        ? prev.widgets // already exists, do nothing
        : [...prev.widgets, widget],
    }));
  };

  const removeWidget = (id) => {
    setSettings((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((w) => w.id !== id),
    }));
  };

  // --------------------------
  // ✅ NEW: Calculator actions
  // --------------------------
  const addCalculation = (expression, result) => {
    setSettings((prev) => ({
      ...prev,
      calculatorHistory: [
        ...prev.calculatorHistory,
        { expression, result, timestamp: Date.now() },
      ],
    }));
  };

  const clearCalculatorHistory = () => {
    setSettings((prev) => ({
      ...prev,
      calculatorHistory: [],
    }));
  };

  // --------------------------
  // ✅ NEW: Calendar actions
  // --------------------------
  const addCalendarMark = (mark) => {
    setSettings((prev) => ({
      ...prev,
      calendarMarks: [...prev.calendarMarks, mark],
    }));
  };

  const removeCalendarMark = (id) => {
    setSettings((prev) => ({
      ...prev,
      calendarMarks: prev.calendarMarks.filter((m) => m.id !== id),
    }));
  };

  const updateCalendarMarks = (marks) => {
    // useful for drag-drop reorder
    setSettings((prev) => ({
      ...prev,
      calendarMarks: marks,
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        toggleTheme,
        updateWidgetStyle,
        updateWidgetTitle,
        addWidget,
        removeWidget,

        // ✅ expose new widget actions
        addCalculation,
        clearCalculatorHistory,
        addCalendarMark,
        removeCalendarMark,
        updateCalendarMarks,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
