import React, { useState, useEffect } from 'react';
import './App.css';

const Sidebar = ({ notes, onNoteSelect, onAddNote, sidebarVisible, toggleSidebar }) => {
  return (
    <div className={`sidebar ${sidebarVisible ? '' : 'collapsed'}`}>
      <div className="sidebar-buttons">
        <button onClick={() => { onAddNote(); toggleSidebar(); }} className="add-note-button">
          Create New Note
        </button>
        <button onClick={toggleSidebar} className="toggle-button">
          ☰
        </button>
      </div>
      {notes.map((note) => (
        <div key={note.id} className="note-item" onClick={() => { onNoteSelect(note); toggleSidebar(); }}>
          {note.title}
        </div>
      ))}
    </div>
  );
};

const Editor = ({ selectedNote, onSave, onDelete, toggleSidebar }) => {
  const [editedNote, setEditedNote] = useState(selectedNote);

  useEffect(() => {
    setEditedNote(selectedNote);
  }, [selectedNote]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedNote({
      ...editedNote,
      [name]: value,
      lastEditedAt: new Date().toISOString(),
    });
  };

  const handleSave = (editedNote) => {
    onSave(editedNote);
    toggleSidebar(); // Toggle sidebar visibility after saving
  };

  const handleDelete = (id) => {
    onDelete(id);
    toggleSidebar(); // Toggle sidebar visibility after deleting
  };

  return (
    <div className="editor">
      <input
        type="text"
        name="title"
        value={editedNote.title}
        onChange={handleInputChange}
        placeholder="Title"
      />
      <textarea
        name="content"
        value={editedNote.content}
        onChange={handleInputChange}
        placeholder="Write your note here..."
      />

      <div className="save-delete-buttons">
        <button onClick={() => handleSave(editedNote)}>Save</button>
        <button onClick={() => handleDelete(editedNote.id)} className="delete-button">Delete</button>
      </div>
    </div>
  );
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    const savedNotesString = localStorage.getItem('notes');
    const savedNotes = savedNotesString ? JSON.parse(savedNotesString) : [];
    setNotes(savedNotes);
  }, []);

  const saveNotesToLocalStorage = (updatedNotes) => {
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const handleAddNote = () => {
    const newNote = {
      id: new Date().getTime(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      lastEditedAt: new Date().toISOString(),
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveNotesToLocalStorage(updatedNotes);
    setSelectedNote(newNote);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    saveNotesToLocalStorage(updatedNotes);
    setSelectedNote(null);
  };

  const handleSaveNote = (editedNote) => {
    const updatedNotes = notes.map((note) => (note.id === editedNote.id ? editedNote : note));
    setNotes(updatedNotes);
    saveNotesToLocalStorage(updatedNotes);
    setSelectedNote(null);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="App">
      <div className={`container ${sidebarVisible ? '' : 'sidebar-collapsed'}`}>
        <Sidebar
          notes={notes}
          onNoteSelect={handleEditNote}
          onAddNote={handleAddNote}
          sidebarVisible={sidebarVisible}
          toggleSidebar={toggleSidebar}
        />
        {selectedNote && <Editor selectedNote={selectedNote} onSave={handleSaveNote} onDelete={handleDeleteNote} toggleSidebar={toggleSidebar} />}
      </div>
    </div>
  );
};

export default App;
