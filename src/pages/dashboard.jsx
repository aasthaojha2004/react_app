// pages/Dashboard.jsx
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { useModal } from "../hooks/useModal";
import SettingsModal from "../components/SettingModal";
import DashboardCarousel from "../components/DashboardCarousel.jsx";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import WeatherWidget from "../components/WeatherWidget.jsx";
import NotesWidget from "../components/NotesWidget.jsx";
import TodoWidget from "../components/ToDoWidget.jsx";
import AddWidgetButton  from "../components/AddWidgetButton.jsx";
import CalculatorWidget from "../components/CalculatorWidget.jsx";
import CalendarWidget from "../components/CalendarWidget.jsx";

const initialWidgets = [
  { id: 1, type: "weather", title: "Weather", data: null },
  { id: 2, type: "notes", title: "Notes", data: [] },
  { id: 3, type: "todo", title: "To-Do", data: [] },
 
];

const widgetRegistry = {
  weather: WeatherWidget,
  notes: NotesWidget,
  todo: TodoWidget,
  calculator: CalculatorWidget,
  calendar: CalendarWidget
  // ✅ Add more widget mappings
};

function Dashboard() {
  const [widgets, setWidgets] = useState(initialWidgets);
  const { settings, setSettings, toggleTheme, removeWidget } = useSettings();

  const layoutMode = settings.layoutMode;
  const navigate = useNavigate();

  //const { settings, removeWidget } = useSettings();

  const settingsModal = useModal();
  const [activeWidgetId, setActiveWidgetId] = useState(null);

  // Accessibility
  const [focusedIndex, setFocusedIndex] = useState(0);
  const widgetRefs = useRef([]);

  const openSettings = (id) => {
    setActiveWidgetId(id);
    settingsModal.open();
  };

  const toggleLayout = () => {
    setSettings((prev) => ({
      ...prev,
      layoutMode: prev.layoutMode === "grid" ? "list" : "grid",
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newWidgets = Array.from(widgets);
    const [moved] = newWidgets.splice(result.source.index, 1);
    newWidgets.splice(result.destination.index, 0, moved);
    setWidgets(newWidgets);
  };

  // Keep focus in sync
  useEffect(() => {
    if (widgetRefs.current[0]) {
      setFocusedIndex(0);
      widgetRefs.current[0].focus();
    }
  }, [layoutMode]);

  useEffect(() => {
    if (widgetRefs.current[focusedIndex]) {
      widgetRefs.current[focusedIndex].focus();
    }
  }, [focusedIndex]);

  const handleKeyDown = (e, index, widget) => {
    if (e.key === "Enter") {
      navigate(`/widget/${widget.id}`);
    } else if (layoutMode === "grid") {
      if (e.key === "ArrowRight") {
        setFocusedIndex((prev) => (prev + 1) % widgets.length);
      } else if (e.key === "ArrowLeft") {
        setFocusedIndex((prev) => (prev === 0 ? widgets.length - 1 : prev - 1));
      }
    } else if (layoutMode === "list") {
      if (e.key === "ArrowDown") {
        setFocusedIndex((prev) => (prev + 1) % widgets.length);
      } else if (e.key === "ArrowUp") {
        setFocusedIndex((prev) => (prev === 0 ? widgets.length - 1 : prev - 1));
      }
    }
  };

  return (
    <div className="w-full min-h-screen p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Layout + Theme toggle */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={toggleLayout}
          className="px-3 py-1 rounded-lg bg-blue-500 text-white shadow hover:bg-blue-600 transition hidden sm:block dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {layoutMode === "grid" ? "Switch to List" : "Switch to Grid"}
        </button>

        <button
          onClick={toggleTheme}
          className="px-3 py-2 rounded bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {settings.theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      {/* Desktop/Tablet */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="dashboard"
          direction={layoutMode === "grid" ? "horizontal" : "vertical"}
        >
          {(provided) => (
            <div
              className={`hidden sm:grid gap-4 ${
                layoutMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col"
              }`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <AnimatePresence>
                {widgets.map((widget, index) => {
                  const style = settings.widgetStyles?.[widget.id] || {};
                  const savedTitle =
                    settings.widgetTitles?.[widget.id] || widget.title;
                  const bg = style.backgroundColor || "";

                  return (
                    <Draggable
                      key={widget.id.toString()}
                      draggableId={widget.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <motion.div
                          ref={(el) => {
                            provided.innerRef(el);
                            widgetRefs.current[index] = el;
                          }}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => navigate(`/widget/${widget.id}`)}
                          onKeyDown={(e) => handleKeyDown(e, index, widget)}
                          role="button"
                          tabIndex={focusedIndex === index ? 0 : -1}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="relative p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                          style={{ backgroundColor: bg }}
                        >
                          {/* Settings */}
                          <button
                            type="button"
                            aria-label="Widget settings"
                            className="absolute top-3 right-3 rounded-xl p-2 bg-white/70 dark:bg-gray-700 hover:bg-white shadow transition dark:text-gray-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              openSettings(widget.id);
                            }}
                          >
                            ⚙
                          </button>

                          <h2 className="font-bold text-lg">{savedTitle}</h2>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            This is your {savedTitle.toLowerCase()} widget.
                          </p>
                        </motion.div>
                      )}
                    </Draggable>
                  );
                })}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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

       <div className="p-4">
      <AddWidgetButton />

      <div
        className={`grid gap-4 ${
          settings.layoutMode === "grid"
            ? "grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {settings.widgets.map((w) => (
          <div
            key={w.id}
            className="bg-slate-800 rounded-xl p-4 shadow cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/widget/${w.id}`)} // ✅ redirect on click
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {settings.widgetTitles[w.id] || w.type}
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent redirect
                  // open settings modal here
                  alert(`Open settings for ${w.id}`);
                }}
              >
                ⚙️
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              {w.description || "This is your widget."}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                removeWidget(w.id);
              }}
              className="text-red-400 mt-2 hover:text-red-600"
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </div>
    </div>

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