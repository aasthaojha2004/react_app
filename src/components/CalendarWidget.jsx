// components/CalendarWidget.jsx
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSettings } from "../context/SettingsContext";

function CalendarWidget() {
  const { settings, setSettings } = useSettings();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [currentView, setCurrentView] = useState(new Date());

  // Add mark
  const handleMarkDate = () => {
    if (!reason.trim()) return;
    const newMark = {
      id: Date.now().toString(),
      date: selectedDate.toDateString(),
      iso: selectedDate.toISOString(),
      reason,
    };
    setSettings({
      ...settings,
      calendarMarks: [...settings.calendarMarks, newMark],
    });
    setReason("");
  };

  // Reorder drag-drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(settings.calendarMarks);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setSettings({ ...settings, calendarMarks: items });
  };

  // Highlight marked dates in calendar
  const tileClassName = ({ date }) => {
    if (
      settings.calendarMarks.some(
        (m) => new Date(m.iso).toDateString() === date.toDateString()
      )
    ) {
      return "bg-blue-300 rounded-full"; // ✅ highlight
    }
    return null;
  };

  // Filter list → only current month/year
  const filteredMarks = settings.calendarMarks.filter((m) => {
    const d = new Date(m.iso);
    return (
      d.getMonth() === currentView.getMonth() &&
      d.getFullYear() === currentView.getFullYear()
    );
  });

  return (
    <div className="p-4 shadow rounded bg-white dark:bg-gray-800">
      <h2 className="text-lg font-bold mb-2">📅 Calendar</h2>

      {/* Calendar */}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={tileClassName}
        onActiveStartDateChange={({ activeStartDate }) =>
          setCurrentView(activeStartDate)
        }
      />

      {/* Mark date */}
      <div className="mt-3">
        <p className="text-sm">
          Selected: <strong>{selectedDate.toDateString()}</strong>
        </p>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for marking"
          className="border p-2 w-full mt-2 rounded dark:bg-gray-700"
        />
        <button
          onClick={handleMarkDate}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Mark Date
        </button>
      </div>

      {/* Marked list with drag/drop */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">
          Marked Dates for {currentView.toLocaleString("default", { month: "long" })}{" "}
          {currentView.getFullYear()}
        </h3>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="marked-list">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {filteredMarks.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-2 border rounded bg-gray-100 dark:bg-gray-700"
                      >
                        <span className="font-bold">{item.date}</span>:{" "}
                        {item.reason}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default CalendarWidget;
