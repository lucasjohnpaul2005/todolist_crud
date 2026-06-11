import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Draft project proposal', category: 'Work', workLocation: 'Work from Home', dueDate: '2026-06-15', completed: false },
      { id: 2, text: 'Call client regarding feedback', category: 'Work', workLocation: 'Work from Company', dueDate: '2026-06-16', completed: false },
      { id: 3, text: 'Team meeting summary', category: 'Work', workLocation: 'Work from Home', dueDate: '2026-06-12', completed: false },
      { id: 4, text: 'Buy groceries', category: 'Personal', dueDate: '2026-06-11', completed: false },
      { id: 5, text: 'Go to gym', category: 'Personal', dueDate: '2026-06-10', completed: false },
      { id: 6, text: 'Research market trends', category: 'Work', workLocation: 'Work from Company', dueDate: '2026-06-18', completed: false },
    ];
  });
  
  const [activeTab, setActiveTab] = useState('personal');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');
  const [editWorkLocation, setEditWorkLocation] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');
  const [newWorkLocation, setNewWorkLocation] = useState('Work from Home');
  const [newDueDate, setNewDueDate] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Filter tasks based on active tab
  const getFilteredTodos = () => {
    if (activeTab === 'work') {
      return todos.filter(t => t.category === 'Work' && !t.completed);
    } else if (activeTab === 'personal') {
      return todos.filter(t => t.category === 'Personal' && !t.completed);
    } else if (activeTab === 'completed') {
      return todos.filter(t => t.completed);
    }
    return todos.filter(t => !t.completed);
  };

  const addTodo = () => {
    if (newText.trim()) {
      const newTodo = {
        id: Date.now(),
        text: newText.trim(),
        category: newCategory,
        dueDate: newDueDate || new Date().toISOString().split('T')[0],
        completed: false
      };
      
      // Only add workLocation if category is Work
      if (newCategory === 'Work') {
        newTodo.workLocation = newWorkLocation;
      }
      
      setTodos([...todos, newTodo]);
      setNewText('');
      setNewCategory('Personal');
      setNewWorkLocation('Work from Home');
      setNewDueDate('');
      setShowAddForm(false);
    }
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setEditText(todo.text);
    setEditDueDate(todo.dueDate);
    if (todo.category === 'Work') {
      setEditWorkLocation(todo.workLocation);
    }
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      const updatedTodo = {
        ...editingTodo,
        text: editText.trim(),
        dueDate: editDueDate
      };
      
      // Only update workLocation if it's a Work task
      if (editingTodo.category === 'Work') {
        updatedTodo.workLocation = editWorkLocation;
      }
      
      setTodos(todos.map(t => 
        t.id === editingTodo.id ? updatedTodo : t
      ));
      setShowEditModal(false);
      setEditingTodo(null);
    }
  };

  const deleteTodo = (id) => {
    if (window.confirm('Delete this task?')) {
      setTodos(todos.filter(t => t.id !== id));
    }
  };

  const getWorkLocationColor = (location) => {
    switch(location) {
      case 'Work from Home': return '#10b981';
      case 'Work from Company': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getCategoryCount = (category) => {
    return todos.filter(t => t.category === category && !t.completed).length;
  };

  const filteredTodos = getFilteredTodos();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h2> QuickTask</h2>
        </div>
        
        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'work' ? 'active' : ''}`}
            onClick={() => setActiveTab('work')}
          >
            <span className="nav-text">Work Tasks</span>
            <span className="nav-count">{getCategoryCount('Work')}</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <span className="nav-text">Personal Tasks</span>
            <span className="nav-count">{getCategoryCount('Personal')}</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <span className="nav-text">Completed</span>
            <span className="nav-count">{todos.filter(t => t.completed).length}</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-text">Settings</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>
            {activeTab === 'work' && ' Work Tasks'}
            {activeTab === 'personal' && ' Personal Tasks'}
            {activeTab === 'completed' && ' Completed Tasks'}
            {activeTab === 'settings' && ' Settings'}
          </h1>
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {activeTab !== 'settings' ? (
          <>
            <div className="task-list">
              {filteredTodos.length === 0 ? (
                <div className="empty-state">
                  <p>No tasks in {activeTab}</p>
                  <button onClick={() => setShowAddForm(true)} className="empty-add-btn">+ Add your first task</button>
                </div>
              ) : (
                filteredTodos.map(task => (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                        className="task-checkbox"
                      />
                      <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                        {task.text}
                      </span>
                      <div className="task-actions">
                        <button onClick={() => openEditModal(task)} className="edit-btn"> Edit</button>
                        <button onClick={() => deleteTodo(task.id)} className="delete-btn"> Delete</button>
                      </div>
                    </div>
                    <div className="task-footer">
                      {/* Only show work location for Work tasks */}
                      {task.category === 'Work' && task.workLocation && (
                        <span className="location-badge" style={{ backgroundColor: getWorkLocationColor(task.workLocation) }}>
                           {task.workLocation}
                        </span>
                      )}
                      <span className="due-date">Date {formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!showAddForm ? (
              <button onClick={() => setShowAddForm(true)} className="add-task-btn">
                + Add New Task
              </button>
            ) : (
              <div className="add-form">
                <input
                  type="text"
                  placeholder="Task name"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="add-input"
                  autoFocus
                />
                
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="add-select">
                  <option value="Work"> Work</option>
                  <option value="Personal"> Personal</option>
                </select>
                
                {/* Only show Work Location if category is Work */}
                {newCategory === 'Work' && (
                  <select value={newWorkLocation} onChange={(e) => setNewWorkLocation(e.target.value)} className="add-select">
                    <option value="Work from Home"> Work from Home</option>
                    <option value="Work from Company"> Work from Company</option>
                  </select>
                )}
                
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="add-input"
                />
                
                <div className="add-buttons">
                  <button onClick={addTodo} className="save-add-btn">Add Task</button>
                  <button onClick={() => setShowAddForm(false)} className="cancel-add-btn">Cancel</button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Settings Panel
          <div className="settings-panel">
            <div className="settings-section">
              <h3>Data Management</h3>
              <button onClick={() => {
                if (window.confirm('Delete all tasks? This cannot be undone!')) {
                  setTodos([]);
                }
              }} className="danger-btn">
                 Delete All Tasks
              </button>
              <button onClick={() => {
                if (window.confirm('Reset to sample tasks?')) {
                  localStorage.removeItem('todos');
                  window.location.reload();
                }
              }} className="warning-btn">
                 Reset to Sample Tasks
              </button>
            </div>
            
            <div className="settings-section">
              <h3>Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{todos.length}</div>
                  <div className="stat-label">Total Tasks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{todos.filter(t => t.completed).length}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{todos.filter(t => !t.completed).length}</div>
                  <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{todos.filter(t => t.category === 'Work' && !t.completed).length}</div>
                  <div className="stat-label">Work Tasks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{todos.filter(t => t.category === 'Personal' && !t.completed).length}</div>
                  <div className="stat-label">Personal Tasks</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3> Edit Task</h3>
            <div className="modal-field">
              <label>Task Name</label>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="modal-input"
              />
            </div>
            
            {/* Only show Work Location in edit modal if task is Work */}
            {editingTodo && editingTodo.category === 'Work' && (
              <div className="modal-field">
                <label>Work Location</label>
                <select value={editWorkLocation} onChange={(e) => setEditWorkLocation(e.target.value)} className="modal-select">
                  <option value="Work from Home"> Work from Home</option>
                  <option value="Work from Company"> Work from Company</option>
                </select>
              </div>
            )}
            
            <div className="modal-field">
              <label>Due Date</label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="modal-input"
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => setShowEditModal(false)} className="modal-cancel">Cancel</button>
              <button onClick={saveEdit} className="modal-save">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;