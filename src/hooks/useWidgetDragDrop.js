import { useState } from "react";

export function useWidgetDragDrop(initialWidgets = []) {
  const [widgets, setWidgets] = useState(initialWidgets);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(widgets);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setWidgets(reordered);
  };

  return { widgets, setWidgets, handleDragEnd };
}
