import { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable
} from '@hello-pangea/dnd';
import Widget from './Widget';
import { useLocalStorage } from '../hooks/useLocalStorage'; // ✅ Import the hook

function NotesWidget({ id }) {
  const [notes, setNotes] = useLocalStorage(`notes-${id}`, []); // ✅ Use the hook
  const [input, setInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editInput, setEditInput] = useState('');

  const handleAddNote = () => {
    if (input.trim()) {
      setNotes([...notes, input]);
      setInput('');
    }
  };

  const handleDeleteNote = (indexToDelete) => {
    setNotes(notes.filter((_, index) => index !== indexToDelete));
  };

  const handleEditNote = (index) => {
    setEditingIndex(index);
    setEditInput(notes[index]);
  };

  const handleSaveEdit = () => {
    const updatedNotes = [...notes];
    updatedNotes[editingIndex] = editInput;
    setNotes(updatedNotes);
    setEditingIndex(null);
    setEditInput('');
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedNotes = Array.from(notes);
    const [movedNote] = reorderedNotes.splice(result.source.index, 1);
    reorderedNotes.splice(result.destination.index, 0, movedNote);

    setNotes(reorderedNotes);
  };

  return (
    <Widget
      id={id}
      //title=""
      description="Write, edit, and organize your notes with drag-and-drop support."
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Write a note..."
        className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
      />

      <button
        onClick={handleAddNote}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Note
      </button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="notes">
          {(provided) => (
            <ul
              className="mt-4 space-y-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {notes.map((note, index) => (
                <Draggable key={index} draggableId={`note-${index}`} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-100 px-3 py-2 rounded"
                    >
                      {editingIndex === index ? (
                        <div className="flex flex-col sm:flex-row sm:items-center w-full gap-2">
                          <input
                            type="text"
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 flex-grow"
                          />
                          <button
                            onClick={handleSaveEdit}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center w-full">
                          <span>{note}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditNote(index)}
                              className="text-yellow-500 hover:text-yellow-600"
                              aria-label="Edit note"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteNote(index)}
                              className="text-red-500 hover:text-red-700"
                              aria-label="Delete note"
                            >
                              ✖
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </Widget>
  );
}

export default NotesWidget;
