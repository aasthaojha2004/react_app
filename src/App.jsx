//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import Dashboard from "./pages/dashboard";
import WidgetDetail from "./pages/WidgetDetail";

function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />  Per
          <Route path="/widget/:id" element={<WidgetDetail />} />
        </Routes>
      </Router>
    </SettingsProvider>
  );
}

export default App;

