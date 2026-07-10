import React, { useState } from 'react';

export const AddTaskForm = ({ onAdd, onCancel }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Personal');
  const [workLocation, setWorkLocation] = useState('Work from Home');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(
        text.trim(),
        category,
        dueDate || new Date().toISOString().split('T')[0],
        category === 'Work' ? workLocation : null
      );
      setText('');
      setCategory('Personal');
      setDueDate('');
    }
  };

  return (
    <div className="add-form">
      <input
        type="text"
        placeholder="Task name"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="add-input"
        autoFocus
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)} className="add-select">
        <option value="Work"> Work</option>
        <option value="Personal"> Personal</option>
      </select>

      {category === 'Work' && (
        <select value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} className="add-select">
          <option value="Work from Home"> Work from Home</option>
          <option value="Work from Company"> Work from Company</option>
        </select>
      )}

      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="add-input" />

      <div className="add-buttons">
        <button onClick={handleSubmit} className="save-add-btn">Add Task</button>
        <button onClick={onCancel} className="cancel-add-btn">Cancel</button>
      </div>
    </div>
  );
};