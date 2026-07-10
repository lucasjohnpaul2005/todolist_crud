import React from 'react';

export const TodoList = ({ todos, onToggleComplete, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getWorkLocationColor = (location) => {
    switch(location) {
      case 'Work from Home': return '#10b981';
      case 'Work from Company': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  if (todos.length === 0) {
    return <div className="empty-state"><p>No tasks here. Add one below!</p></div>;
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
              <button onClick={() => onEdit(todo)} className="edit-btn"> Edit</button>
              <button onClick={() => onDelete(todo.id)} className="delete-btn"> Delete</button>
            </div>
          </div>
          <div className="task-footer">
            {todo.category === 'Work' && todo.workLocation && (
              <span className="location-badge" style={{ backgroundColor: getWorkLocationColor(todo.workLocation) }}>
                 {todo.workLocation}
              </span>
            )}
            <span className="due-date"> {formatDate(todo.dueDate)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};