import { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable
} from '@hello-pangea/dnd';
import Widget from './Widget';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSettings } from '../context/SettingsContext'; // ✅ Import theme context

function TodoWidget({ id }) {
  const [tasks, setTasks] = useLocalStorage(`todo-${id}`, []);
  const [input, setInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editInput, setEditInput] = useState('');
  const { settings } = useSettings(); // ✅ Access theme

  const handleAddTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { text: input, completed: false }]);
      setInput('');
    }
  };

  const handleToggleComplete = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleEditTask = (index) => {
    setEditingIndex(index);
    setEditInput(tasks[index].text);
  };

  const handleSaveEdit = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editingIndex].text = editInput;
    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditInput('');
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);

    setTasks(reorderedTasks);
  };

  return (
    <Widget
      id={id}
      description="Manage your tasks with drag-and-drop, editing, and completion tracking."
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a task..."
        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full mb-2
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />

      <button
        onClick={handleAddTask}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600
                   dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Add Task
      </button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              className="mt-4 space-y-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No tasks yet. Add one!
                </p>
              ) : (
                tasks.map((task, index) => (
                  <Draggable key={index} draggableId={`task-${index}`} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex flex-col sm:flex-row sm:items-center justify-between 
                                   bg-gray-100 dark:bg-gray-800 
                                   px-3 py-2 rounded"
                      >
                        {editingIndex === index ? (
                          <div className="flex flex-col sm:flex-row sm:items-center w-full gap-2">
                            <input
                              type="text"
                              value={editInput}
                              onChange={(e) => setEditInput(e.target.value)}
                              className="border border-gray-300 dark:border-gray-600 
                                         rounded px-2 py-1 flex-grow
                                         bg-white dark:bg-gray-700
                                         text-gray-900 dark:text-gray-100"
                            />
                            <button
                              onClick={handleSaveEdit}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600
                                         dark:bg-green-600 dark:hover:bg-green-700"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center w-full">
                            <span
                              onClick={() => handleToggleComplete(index)}
                              className={`flex-grow cursor-pointer ${
                                task.completed
                                  ? 'line-through text-gray-400 dark:text-gray-500'
                                  : 'text-gray-900 dark:text-gray-100'
                              }`}
                            >
                              {task.text}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditTask(index)}
                                className="text-yellow-500 hover:text-yellow-600"
                                aria-label="Edit task"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteTask(index)}
                                className="text-red-500 hover:text-red-700"
                                aria-label="Delete task"
                              >
                                ✖
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </Widget>
  );
}

export default TodoWidget;
