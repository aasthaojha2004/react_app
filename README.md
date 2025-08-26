
# React Dashboard

A customizable, extensible dashboard application built with React, Vite, and Tailwind CSS. Organize your workspace with draggable widgets, persistent settings, and a modern UI.

---

## 🚀 Features

- **Drag-and-drop widget layout** (desktop)
- **Mobile carousel** for widgets
- **Widget types:**
	- Weather: Current conditions for your location
	- Notes: Add, edit, and organize notes
	- To-Do: Task management with completion tracking
	- Calculator: Simple calculator for quick math
	- Calendar: Interactive calendar view
- **Widget customization:**
	- Change widget color and title
	- Remove or reorder widgets
- **Theme switcher:** Light/dark mode
- **Persistent settings:** Saved in localStorage
- **Responsive design:** Works on desktop, tablet, and mobile

---

## 🧩 Widgets Overview

| Widget      | Description                          |
|-------------|--------------------------------------|
| Weather     | Shows current weather for a location |
| Notes       | Add, edit, drag, and delete notes    |
| To-Do       | Manage tasks, mark complete, reorder |
| Calculator  | Basic calculator functions           |
| Calendar    | Select and view dates                |

---

## 🛠️ Tech Stack

- **React 19+**
- **Vite** (fast dev/build)
- **Tailwind CSS** (utility-first styling)
- **@hello-pangea/dnd** (drag-and-drop)
- **framer-motion** (animations)
- **react-calendar** (calendar widget)

---

## ⚡ Getting Started

1. **Clone the repo:**
	 ```sh
	 git clone https://github.com/aasthaojha2004/react_app.git
	 cd react-dashboard
	 ```
2. **Install dependencies:**
	 ```sh
	 npm install
	 ```
3. **Start development server:**
	 ```sh
	 npm run dev
	 ```
4. **Build for production:**
	 ```sh
	 npm run build
	 ```

---

## 📁 Project Structure

```
src/
	components/
		WidgetGrid.jsx
		Widget.jsx
		WeatherWidget.jsx
		NotesWidget.jsx
		TodoWidget.jsx
		CalculatorWidget.jsx
		CalendarWidget.jsx
		AddWidgetButton.jsx
		SettingsModal.jsx
		DashboardCarousel.jsx
	context/
		SettingsContext.jsx
		hooks/
			useLocalStorage.js
			useModal.js
	pages/
		dashboard.jsx
		WidgetDetail.jsx
	index.css
	main.jsx
	App.jsx
```

---

## 📝 Usage & Customization

- **Add widgets:** Create a new component and add it to the widget registry in `dashboard.jsx`.
- **Change widget color/title:** Use the settings modal on each widget card.
- **Reorder widgets:** Drag and drop on desktop, swipe carousel on mobile.
- **Theme:** Toggle light/dark mode from the dashboard.
- **Persistent settings:** All customizations are saved automatically.

---

## 🐞 Troubleshooting

- If drag-and-drop does not work, check your React version and use `@hello-pangea/dnd` for React 19+.
- For build errors, ensure all file extensions are correct (e.g., `.jsx` for components).
- If widget colors/titles do not persist, check localStorage and context usage.

---

## 🙏 Credits

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- [framer-motion](https://www.framer.com/motion/)
- [react-calendar](https://github.com/wojtekmaj/react-calendar)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
