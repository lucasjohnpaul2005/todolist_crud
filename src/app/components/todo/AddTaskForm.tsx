import React, { useState } from 'react';

interface AddTaskFormProps {
  onAdd: (text: string, category: 'Work' | 'Personal', dueDate: string, workLocation?: 'Work from Home' | 'Work from Company') => void;
  onCancel: () => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd, onCancel }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<'Work' | 'Personal'>('Personal');
  const [workLocation, setWorkLocation] = useState<'Work from Home' | 'Work from Company'>('Work from Home');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (): void => {
    if (text.trim()) {
      onAdd(
        text.trim(),
        category,
        dueDate || new Date().toISOString().split('T')[0],
        category === 'Work' ? workLocation : undefined
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

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as 'Work' | 'Personal')}
        className="add-select"
      >
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>

      {category === 'Work' && (
        <select
          value={workLocation}
          onChange={(e) => setWorkLocation(e.target.value as 'Work from Home' | 'Work from Company')}
          className="add-select"
        >
          <option value="Work from Home">Work from Home</option>
          <option value="Work from Company">Work from Company</option>
        </select>
      )}

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="add-input"
      />

      <div className="add-buttons">
        <button onClick={handleSubmit} className="save-add-btn">Add Task</button>
        <button onClick={onCancel} className="cancel-add-btn">Cancel</button>
      </div>
    </div>
  );
};