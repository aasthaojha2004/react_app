import { useSettings } from "../context/SettingsContext";

function LayoutControls() {
  const { settings, setSettings, toggleTheme } = useSettings();

  const toggleLayout = () => {
    setSettings((prev) => ({
      ...prev,
      layoutMode: prev.layoutMode === "grid" ? "list" : "grid",
    }));
  };

  return (
    <div className="flex justify-end gap-3 mb-4">
      <button
        onClick={toggleLayout}
        className="px-3 py-1 rounded-lg bg-blue-500 text-white shadow hover:bg-blue-600 transition hidden sm:block dark:bg-blue-700 dark:hover:bg-blue-600"
      >
        {settings.layoutMode === "grid" ? "Switch to List" : "Switch to Grid"}
      </button>

      <button
        onClick={toggleTheme}
        className="px-3 py-2 rounded bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {settings.theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>
  );
}

export default LayoutControls;
