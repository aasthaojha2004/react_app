import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSettings } from "../context/SettingsContext";
import { useWidgetNavigation } from "../hooks/useWidgetNavigation";
import { useWidgetDragDrop } from "../hooks/useWidgetDragDrop";

function WidgetGrid({ initialWidgets, openSettings, navigate }) {
  const { settings } = useSettings();

  // ✅ use hook with widgets passed from Dashboard
  const { widgets, handleDragEnd } = useWidgetDragDrop(initialWidgets);
  const { focusedIndex, widgetRefs, handleKeyDown } =
    useWidgetNavigation(widgets, settings.layoutMode, navigate);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable
        droppableId="dashboard"
        direction={settings.layoutMode === "grid" ? "horizontal" : "vertical"}
      >
        {(provided) => (
          <div
            className={`hidden sm:grid gap-4 ${
              settings.layoutMode === "grid"
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
                        {/* Settings Button */}
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
  );
}

export default WidgetGrid;
