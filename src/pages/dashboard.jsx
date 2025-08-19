// pages/Dashboard.jsx
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { useModal } from "../hooks/useModal";
import SettingsModal from "../components/SettingModal";
import DashboardCarousel from "../components/DashboardCarousel.jsx";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialWidgets = [
  { id: 1, type: "weather", title: "Weather", data: null },
  { id: 2, type: "notes", title: "Notes", data: [] },
  { id: 3, type: "todo", title: "To-Do", data: [] },
];

function Dashboard() {
  const [widgets, setWidgets] = useState(initialWidgets);
  const { settings, setSettings } = useSettings();

 //console.log("🔄 Current settings in Dashboard:", settings);

  const layoutMode = settings.layoutMode;
  //const [layoutMode, setLayoutMode] = useState("grid");
  const navigate = useNavigate();

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
    setSettings(prev => ({
      ...prev,
      layoutMode: prev.layoutMode === "grid" ? "list" : "grid"
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
  // Reset focus to first widget when layout mode changes
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

  // Keyboard handler
const handleKeyDown = (e, index, widget) => {
  console.log("Key pressed:", e.key, "on index:", index);

  if (e.key === "Enter") {
    navigate(`/widget/${widget.id}`);
  } 
  else if (layoutMode === "grid") {
    if (e.key === "ArrowRight") {
      setFocusedIndex((prev) => (prev + 1) % widgets.length);
    } else if (e.key === "ArrowLeft") {
      setFocusedIndex((prev) => (prev === 0 ? widgets.length - 1 : prev - 1));
    }
  } 
  else if (layoutMode === "list") {
    if (e.key === "ArrowDown") {
      setFocusedIndex((prev) => (prev + 1) % widgets.length);
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prev) => (prev === 0 ? widgets.length - 1 : prev - 1));
    }
  }
};

useEffect(() => {
  console.log("🔄 Current settings in Dashboard:", settings);
}, [settings]);

  return (
    <div className="w-full p-4">
      {/* Layout toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleLayout}
          className="px-3 py-1 rounded-lg bg-blue-500 text-white shadow hover:bg-blue-600 transition hidden sm:block transition-all duration-500 ease-in-out"
        >
          {layoutMode === "grid" ? "Switch to List" : "Switch to Grid"}
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
                  const bg = style.backgroundColor || "#ffffffff";

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
                            widgetRefs.current[index] = el; // ✅ store ref
                          }}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => navigate(`/widget/${widget.id}`)}
                          onKeyDown={(e) => handleKeyDown(e, index, widget)} // ✅ keyboard
                          role="button"
                          tabIndex={focusedIndex === index ? 0 : -1} // ✅ roving tabindex
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="relative p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ backgroundColor: bg }}
                        >
                          {/* Settings */}
                          <button
                            type="button"
                            aria-label="Widget settings"
                            className="absolute top-3 right-3 rounded-xl p-2 bg-white/70 hover:bg-white shadow transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              openSettings(widget.id);
                            }}
                          >
                            ⚙
                          </button>

                          <h2 className="font-bold text-lg">{savedTitle}</h2>
                          <p className="text-sm text-gray-700">
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
