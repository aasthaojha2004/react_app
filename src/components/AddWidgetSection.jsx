import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import AddWidgetButton from "./AddWidgetButton";
import { widgetRegistry } from "../helper/WidgetRegistry";

function AddWidgetSection() {
  const { settings, removeWidget } = useSettings();
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <AddWidgetButton />

      <div
        className={`grid gap-4 ${
          settings.layoutMode === "grid" ? "grid-cols-3" : "grid-cols-1"
        }`}
      >
        {settings.widgets.map((w) => {
          const WidgetComponent = widgetRegistry[w.type]; // ✅ look up by type

          return (
            <div
              key={w.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow cursor-pointer hover:shadow-lg transition"
              //  onClick={() => navigate(`/widget/${w.id}`)}
            >
              {/* Title + Settings button */}
         
            
              

              {/* ✅ Actual Widget Rendered */}
              <div className="mt-2 bg-white dark:bg-gray-800">
                {WidgetComponent ? (
                  <WidgetComponent {...w.props} />
                ) : (
                  <p className="text-gray-400 text-sm">Widget not found.</p>
                )}
              </div>

              {/* Remove button */}
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
          );
        })}
      </div>
    </div>
  );
}

export default AddWidgetSection;
