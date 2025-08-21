// src/WidgetRegistry.js

import WeatherWidget from "../components/WeatherWidget";
import NotesWidget from "../components/NotesWidget";
import TodoWidget from "../components/ToDoWidget";
import CalculatorWidget from "../components/CalculatorWidget";
import CalendarWidget from "../components/CalendarWidget";
import StopwatchWidget from "../components/StopWatchWidget";
import { s } from "framer-motion/client";

// ✅ Centralized registry of available widgets
export const widgetRegistry = {
  weather: WeatherWidget,
  notes: NotesWidget,
  todo: TodoWidget,
  calculator: CalculatorWidget,
  calendar: CalendarWidget,
  stopwatch: StopwatchWidget,
  // add more widgets here
};
