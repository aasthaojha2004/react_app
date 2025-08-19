// pages/Dashboard.jsx
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Widget from '../components/Widget';
import NotesWidget from '../components/NotesWidget';
import TodoWidget from '../components/ToDoWidget';
import WeatherWidget from '../components/WeatherWidget';
import SettingsModal from '../components/SettingModal';
import { useSettings } from '../context/SettingsContext';
import { useModal } from '../hooks/useModal';
//import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination, Navigation } from "swiper/modules";
import DashboardCarousel from "../components/DashboardCarousel.jsx"; 

const initialWidgets = [
  { id: 1, type: 'weather', title: 'Weather', data: null },
  { id: 2, type: 'notes', title: 'Notes', data: [] },
  { id: 3, type: 'todo', title: 'To-Do', data: [] },
];

function Dashboard() {
  const [widgets, setWidgets] = useState(initialWidgets);
  const { settings } = useSettings();
  const [layoutMode, setLayoutMode] = useState("grid");
 


  const settingsModal = useModal();
  const [activeWidgetId, setActiveWidgetId] = useState(null);

  const openSettings = (id) => {
    setActiveWidgetId(id);
    settingsModal.open();
  };

  const updateWidgetData = (id, newData) => {
    setWidgets(prev =>
      prev.map(widget =>
        widget.id === id ? { ...widget, data: newData } : widget
      )
    );
  };

  const renderWidgetContent = (widget) => {
    switch (widget.type) {
      case 'notes':
        return <NotesWidget data={widget.data || []} onUpdate={(data) => updateWidgetData(widget.id, data)} />;
      case 'todo':
        return <TodoWidget data={widget.data || []} onUpdate={(data) => updateWidgetData(widget.id, data)} />;
      case 'weather':
        return <WeatherWidget data={widget.data} onUpdate={(data) => updateWidgetData(widget.id, data)} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <>
      <div className="w-full p-4">
      {/* ✅ NEW: Layout toggle button (hidden on mobile since carousel is default there) */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setLayoutMode(layoutMode === "grid" ? "list" : "grid")}
          className="px-3 py-1 rounded-lg bg-blue-500 text-white shadow hover:bg-blue-600 transition hidden sm:block"
        >
          {layoutMode === "grid" ? "Switch to List" : "Switch to Grid"}
        </button>
      </div>

      {/* ✅ Desktop/Tablet Layout (Grid/List) */}
      <div
        className={`hidden sm:grid gap-4 ${
          layoutMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col"
        }`}
      >

        <AnimatePresence>
          {widgets.map(widget => {
            const style = settings.widgetStyles[widget.id] || {};
            const savedTitle = settings.widgetTitles?.[widget.id] || widget.title;

            return (
              <Widget
                key={widget.id}
                id={widget.id}
                title={savedTitle}
                description={`This is your ${savedTitle.toLowerCase()} widget.`}
                layout={layoutMode}
                style={{ backgroundColor: style.backgroundColor || '#fef3c7' }}
                onSettingsClick={() => openSettings(widget.id)} 
              >
                {renderWidgetContent(widget)}
              </Widget>
            );
          })}
        </AnimatePresence>
      </div>
        <div className="sm:hidden">
          <DashboardCarousel
            widgets={widgets}
            settings={settings}
            renderWidgetContent={renderWidgetContent}
            openSettings={openSettings}
            slidesPerView={1}
          />
        </div>

      {activeWidgetId && (
        <SettingsModal
          isOpen={settingsModal.isOpen}
          onClose={settingsModal.close}
          widgetId={activeWidgetId}
        />
      )}
      </div>
    </>
  );
}

export default Dashboard;
