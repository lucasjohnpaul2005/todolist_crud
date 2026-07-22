import React from 'react';
import { Task } from '../../../domain/entities/Task';
import { Pencil, Trash2, Home, Building2, CalendarDays, Inbox } from 'lucide-react';

interface TodoListProps {
  todos: Task[];
  onToggleComplete: (id: number) => void;
  onEdit: (todo: Task) => void;
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getWorkLocationColor = (location?: string): string => {
    switch (location) {
      case 'Work from Home':
        return '#2f9e6e';
      case 'Work from Company':
        return '#1f6f5c';
      default:
        return '#7d7565';
    }
  };

  const getWorkLocationIcon = (location?: string) => {
    switch (location) {
      case 'Work from Home':
        return <Home size={12} />;
      case 'Work from Company':
        return <Building2 size={12} />;
      default:
        return null;
    }
  };

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <Inbox className="empty-icon" size={48} strokeWidth={1.5} />
        <p>No tasks here. Add one below!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {todos.map((todo) => (
        <div key={todo.id} className="task-card">
          <div className="task-header">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggleComplete(todo.id)}
              className="task-checkbox"
            />
            <span className={`task-text ${todo.completed ? 'completed' : ''}`}>
              {todo.title}
            </span>
            <div className="task-actions">
              <button onClick={() => onEdit(todo)} className="edit-btn">
                <Pencil size={14} /> Edit
              </button>
              <button onClick={() => onDelete(todo.id)} className="delete-btn">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
          <div className="task-footer">
            {todo.category === 'Work' && todo.workLocation && (
              <span
                className="location-badge"
                style={{ backgroundColor: getWorkLocationColor(todo.workLocation) }}
              >
                {getWorkLocationIcon(todo.workLocation)} {todo.workLocation}
              </span>
            )}
            <span className="due-date">
              <CalendarDays size={14} /> {formatDate(todo.dueDate)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};