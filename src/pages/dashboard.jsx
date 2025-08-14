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

const initialWidgets = [
  { id: 1, type: 'weather', title: 'Weather', data: null },
  { id: 2, type: 'notes', title: 'Notes', data: [] },
  { id: 3, type: 'todo', title: 'To-Do', data: [] },
];

function Dashboard() {
  const [widgets, setWidgets] = useState(initialWidgets);
  const { settings } = useSettings();

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                style={{ backgroundColor: style.backgroundColor || '#fef3c7' }}
                onSettingsClick={() => openSettings(widget.id)}
              >
                {renderWidgetContent(widget)}
              </Widget>
            );
          })}
        </AnimatePresence>
      </div>

      {activeWidgetId && (
        <SettingsModal
          isOpen={settingsModal.isOpen}
          onClose={settingsModal.close}
          widgetId={activeWidgetId}
        />
      )}
    </>
  );
}

export default Dashboard;
//import React from 'react';