//uld you merge 
// pages/WidgetDetail.jsx
import { useParams } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import NotesWidget from "../components/NotesWidget.jsx";
import TodoWidget from "../components/TodoWidget.jsx"
import WeatherWidget from "../components/WeatherWidget.jsx";
import CalculatorWidget from "../components/CalculatorWidget.jsx";
import CalendarWidget from "../components/CalendarWidget.jsx";

const initialWidgets = [
  { id: 1, type: "weather", title: "Weather", data: null },
  { id: 2, type: "notes", title: "Notes", data: [] },
  { id: 3, type: "todo", title: "To-Do", data: [] },
  { id: 4, type: "calculator", title: "Calculator", data: null },
  { id: 5, type: "calendar", title: "Calendar", data: null }
];

function WidgetDetail() {
  const { id } = useParams();
  const { settings } = useSettings();
  const widget = initialWidgets.find((w) => w.id.toString() === id);

const renderWidgetContent = () => {
    switch (widget?.type) {
      case "notes":
        return <NotesWidget data={widget.data || []} />;
      case "todo":
        return <TodoWidget data={widget.data || []} />;
      case "weather":
        return <WeatherWidget data={widget.data} />;
      case "calculator":
        return <CalculatorWidget data={widget.data} />;
      case "calendar":
        return <CalendarWidget data={widget.data} />;
      default:
        return <div>Unknown widget</div>;
    }
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        settings.theme === "dark" ? "bg-gray-900 text-white" : "bg-white"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">{widget?.title}</h1>

      {/* Render actual widget */}
      {renderWidgetContent()}

      {/* Extra components for detail page */}
      <div className="mt-6 space-y-4">
        <div className="p-4 shadow rounded">🔧 Settings Panel</div>
        <div className="p-4 shadow rounded">📊 Extra Chart or Info</div>
      </div>
    </div>
  );
}

export default WidgetDetail;
// Merge this Widget Page because I feel they serve the same purpose
//d here is WidgetDetail Code
