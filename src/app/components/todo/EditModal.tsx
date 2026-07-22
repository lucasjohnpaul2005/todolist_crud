import React, { useState, useEffect } from 'react';
import { Task } from '../../../domain/entities/Task';
import { Pencil } from 'lucide-react';

interface EditModalProps {
  isOpen: boolean;
  todo: Task | null;
  onSave: (id: number, updates: { title: string; dueDate: string; workLocation?: 'Work from Home' | 'Work from Company' }) => void;
  onClose: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({ isOpen, todo, onSave, onClose }) => {
  const [text, setText] = useState('');
  const [workLocation, setWorkLocation] = useState<'Work from Home' | 'Work from Company'>('Work from Home');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (todo) {
      setText(todo.title);
      setWorkLocation(todo.workLocation || 'Work from Home');
      setDueDate(todo.dueDate);
    }
  }, [todo]);

  if (!isOpen || !todo) return null;

  const handleSave = () => {
    if (text.trim()) {
      const updates: { title: string; dueDate: string; workLocation?: 'Work from Home' | 'Work from Company' } = {
        title: text.trim(),
        dueDate: dueDate,
      };
      if (todo.category === 'Work') {
        updates.workLocation = workLocation;
      }
      onSave(todo.id, updates);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3><Pencil size={18} /> Edit Task</h3>
        <div className="modal-field">
          <label htmlFor="edit-task-title">Task Name</label>
          <input
            type="text"
            id="edit-task-title"
            name="edit-task-title"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="modal-input"
          />
        </div>
        {todo.category === 'Work' && (
          <div className="modal-field">
            <label htmlFor="edit-task-work-location">Work Location</label>
            <select
              id="edit-task-work-location"
              name="edit-task-work-location"
              value={workLocation}
              onChange={(e) => setWorkLocation(e.target.value as 'Work from Home' | 'Work from Company')}
              className="modal-select"
            >
              <option value="Work from Home">Work from Home</option>
              <option value="Work from Company">Work from Company</option>
            </select>
          </div>
        )}
        <div className="modal-field">
          <label htmlFor="edit-task-due-date">Due Date</label>
          <input
            type="date"
            id="edit-task-due-date"
            name="edit-task-due-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="modal-input"
          />
        </div>
        <div className="modal-buttons">
          <button onClick={onClose} className="modal-cancel">Cancel</button>
          <button onClick={handleSave} className="modal-save">Save Changes</button>
        </div>
      </div>
    </div>
  );
};