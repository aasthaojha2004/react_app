// components/AddWidgetButton.jsx
import { useSettings } from "../context/SettingsContext";
import { v4 as uuidv4 } from "uuid";

export default function AddWidgetButton() {
  const { addWidget } = useSettings();

  const handleAdd = (type) => {
    addWidget({
      id: uuidv4(),
      type,      // must match registry ("weather", "notes", "todo")
      props: {}  // extra props can go here
    });
  };

  return (
    <div className="flex gap-2 my-4">
      <button
        onClick={() => handleAdd("weather")}
        className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        ➕ Add Weather
      </button>
      <button
        onClick={() => handleAdd("calendar")}
        className="px-3 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
      >
        ➕ Add Calendar
      </button>
      <button
        onClick={() => handleAdd("calculator")}
        className="px-3 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
      >
        ➕ Add Calculator
      </button>
    </div>
  );
}
