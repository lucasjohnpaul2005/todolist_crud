import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/redux/hooks';
import {
  readTasks,
  createTask,
  updateTask,
  deleteTask,
  switchRepository,
  setActiveTab,
} from './app/redux/task/task.actions';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const { tasks, activeTab, isLoading, error, repositoryType } = useAppSelector((state) => state.tasks);
  
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

  // Load tasks on mount - READ operation
  useEffect(() => {
    dispatch(readTasks());
  }, [dispatch]);

  const getFilteredTodos = () => {
    if (activeTab === 'work') {
      return tasks.filter(t => t.category === 'Work' && !t.completed);
    } else if (activeTab === 'personal') {
      return tasks.filter(t => t.category === 'Personal' && !t.completed);
    } else if (activeTab === 'completed') {
      return tasks.filter(t => t.completed);
    }
    return tasks.filter(t => !t.completed);
  };

  // CREATE operation
  const handleAddTodo = () => {
    if (newText.trim()) {
      dispatch(createTask({
        title: newText.trim(),
        category: newCategory,
        dueDate: newDueDate || new Date().toISOString().split('T')[0],
        workLocation: newCategory === 'Work' ? newWorkLocation : null,
      }));
      setNewText('');
      setNewCategory('Personal');
      setNewWorkLocation('Work from Home');
      setNewDueDate('');
      setShowAddForm(false);
    }
  };

  // UPDATE operation - toggle complete
  const handleToggleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      dispatch(updateTask(id, { completed: !task.completed }));
    }
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setEditText(todo.title);
    setEditDueDate(todo.dueDate);
    if (todo.category === 'Work') {
      setEditWorkLocation(todo.workLocation);
    }
    setShowEditModal(true);
  };

  // UPDATE operation - edit task
  const handleSaveEdit = () => {
    if (editText.trim()) {
      const updates = {
        title: editText.trim(),
        dueDate: editDueDate,
      };
      if (editingTodo.category === 'Work') {
        updates.workLocation = editWorkLocation;
      }
      dispatch(updateTask(editingTodo.id, updates));
      setShowEditModal(false);
      setEditingTodo(null);
    }
  };

  // DELETE operation
  const handleDeleteTodo = (id) => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Delete all tasks?')) {
      // Delete all tasks one by one
      tasks.forEach(task => {
        dispatch(deleteTask(task.id));
      });
    }
  };

  const handleSwitchRepository = (type) => {
    dispatch(switchRepository(type));
  };

  const getWorkLocationColor = (location) => {
    switch(location) {
      case 'Work from Home': return '#10b981';
      case 'Work from Company': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getCategoryCount = (category) => {
    return tasks.filter(t => t.category === category && !t.completed).length;
  };

  const filteredTodos = getFilteredTodos();

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="app">
        <div className="sidebar">
          <div className="logo">
            <h2> TodoList</h2>
          </div>
        </div>
        <div className="main-content">
          <div className="loading-state">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h2> TodoList</h2>
        </div>
        
        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'work' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('work'))}
          >
            <span className="nav-text">Work Tasks</span>
            <span className="nav-count">{getCategoryCount('Work')}</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('personal'))}
          >
            <span className="nav-text">Personal Tasks</span>
            <span className="nav-count">{getCategoryCount('Personal')}</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('completed'))}
          >
            <span className="nav-text">Completed</span>
            <span className="nav-count">{tasks.filter(t => t.completed).length}</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('settings'))}
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

        {error && <div className="error-message">{error}</div>}

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
                        onChange={() => handleToggleComplete(task.id)}
                        className="task-checkbox"
                      />
                      <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                        {task.title}
                      </span>
                      <div className="task-actions">
                        <button onClick={() => openEditModal(task)} className="edit-btn"> Edit</button>
                        <button onClick={() => handleDeleteTodo(task.id)} className="delete-btn"> Delete</button>
                      </div>
                    </div>
                    <div className="task-footer">
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
                  <button onClick={handleAddTodo} className="save-add-btn">Add Task</button>
                  <button onClick={() => setShowAddForm(false)} className="cancel-add-btn">Cancel</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="settings-panel">
            <div className="settings-section">
              <h3> Data Repository</h3>
              <div className="repository-switch">
                <button 
                  className={`repo-btn ${repositoryType === 'localStorage' ? 'active' : ''}`}
                  onClick={() => handleSwitchRepository('localStorage')}
                >
                   Local Storage
                </button>
                <button 
                  className={`repo-btn ${repositoryType === 'inMemory' ? 'active' : ''}`}
                  onClick={() => handleSwitchRepository('inMemory')}
                >
                   In Memory
                </button>
              </div>
              <p style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>
                Current: <strong>{repositoryType === 'localStorage' ? ' Local Storage' : ' In Memory'}</strong>
              </p>
            </div>

            <div className="settings-section">
              <h3>Data Management</h3>
              <button onClick={handleClearAll} className="danger-btn">
                 Delete All Tasks
              </button>
            </div>
            
            <div className="settings-section">
              <h3>Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{tasks.length}</div>
                  <div className="stat-label">Total Tasks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{tasks.filter(t => t.completed).length}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{tasks.filter(t => !t.completed).length}</div>
                  <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{tasks.filter(t => t.category === 'Work' && !t.completed).length}</div>
                  <div className="stat-label">Work Tasks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{tasks.filter(t => t.category === 'Personal' && !t.completed).length}</div>
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
              <button onClick={handleSaveEdit} className="modal-save">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;