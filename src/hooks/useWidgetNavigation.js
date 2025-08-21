import { useState, useEffect, useRef } from "react";

export function useWidgetNavigation(widgets, layoutMode, navigate) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const widgetRefs = useRef([]);

  // focus management
  useEffect(() => {
    if (widgetRefs.current[focusedIndex]) {
      widgetRefs.current[focusedIndex].focus();
    }
  }, [focusedIndex]);

  const handleKeyDown = (e, index, widget) => {
    if (e.key === "Enter") {
      navigate(`/widget/${widget.id}`);
    } else if (layoutMode === "grid") {
      if (e.key === "ArrowRight") {
        setFocusedIndex((prev) => (prev + 1) % widgets.length);
      } else if (e.key === "ArrowLeft") {
        setFocusedIndex((prev) =>
          prev === 0 ? widgets.length - 1 : prev - 1
        );
      }
    } else if (layoutMode === "list") {
      if (e.key === "ArrowDown") {
        setFocusedIndex((prev) => (prev + 1) % widgets.length);
      } else if (e.key === "ArrowUp") {
        setFocusedIndex((prev) =>
          prev === 0 ? widgets.length - 1 : prev - 1
        );
      }
    }
  };

  return {
    focusedIndex,
    setFocusedIndex,
    widgetRefs,
    handleKeyDown,
  };
}
