// pages/Dashboard.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { useModal } from "../hooks/useModal";
import SettingsModal from "../components/SettingModal";
import DashboardCarousel from "../components/DashboardCarousel.jsx";
//port WeatherWidget from "../components/WeatherWidget.jsx";
//port NotesWidget from "../components/NotesWidget.jsx";
//port TodoWidget from "../components/ToDoWidget.jsx";
//port CalculatorWidget from "../components/CalculatorWidget.jsx";
//port CalendarWidget from "../components/CalendarWidget.jsx";
import LayoutControls from "../components/LayoutControls.jsx";
import WidgetGrid from "../components/WidgetGrid.jsx";
import AddWidgetSection from "../components/AddWidgetSection.jsx";
//port StopwatchWidget from "../components/StopWatchWidget.jsx";
//port { widgetRegistry } from "../helper/WidgetRegistry"; // ✅ Import widget registry

const initialWidgets = [
  { id: 1, type: "weather", title: "Weather", data: null },
  { id: 2, type: "notes", title: "Notes", data: [] },
  { id: 3, type: "todo", title: "To-Do", data: [] },

];



function Dashboard() {
  const [widgets, setWidgets] = useState(initialWidgets);
  const { settings, setSettings, toggleTheme, removeWidget } = useSettings();

  const layoutMode = settings.layoutMode;
  const navigate = useNavigate();

  //const { settings, removeWidget } = useSettings();

  const settingsModal = useModal();
  const [activeWidgetId, setActiveWidgetId] = useState(null);

  // Accessibility

  const widgetRefs = useRef([]);

  const openSettings = (id) => {
    setActiveWidgetId(id);
    settingsModal.open();
  };


  useEffect(() => {
    if (widgetRefs.current[0]) {
      setFocusedIndex(0);
      widgetRefs.current[0].focus();
    }
  }, [layoutMode]);


  return (
    <div className="w-full min-h-screen p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
     <LayoutControls />

      {/* Desktop/Tablet */}
       <WidgetGrid
        initialWidgets={initialWidgets}   // ✅ pass here
        openSettings={openSettings}
        navigate={navigate}
      />

      {/* Mobile */}
      <div className="sm:hidden">
        <DashboardCarousel
          widgets={widgets}
          settings={settings}
          onWidgetClick={(id) => navigate(`/widget/${id}`)}
          openSettings={openSettings}
          slidesPerView={1}
        />
      </div>

      <AddWidgetSection />

      {/* Settings Modal */}
      {activeWidgetId && (
        <SettingsModal
          isOpen={settingsModal.isOpen}
          onClose={settingsModal.close}
          widgetId={activeWidgetId}
        />
      )}
    </div>
  );
}

export default Dashboard;
//is the Dashboard Code  

//e problem I'm facing right now that the widgets added throught the Addbutton is not being rendering the true widget. I feel there is some problem with the settings.widget.map section of the code