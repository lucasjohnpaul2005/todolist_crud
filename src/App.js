import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTodo,
  toggleComplete,
  editTodo,
  deleteTodo,
  deleteAllTodos,
  resetTodos,
} from './store/todosSlice';
import './App.css';
const Icon = ({ d, size = 16, strokeWidth = 2 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} height={size}
    viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
  >
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Icons = {
  briefcase: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  user:      ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  check:     "M20 6L9 17l-5-5",
  checkCirc: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4L12 14.01l-3-3"],
  settings:  ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  pencil:    ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  trash:     ["M3 6h18", "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6", "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"],
  plus:      "M12 5v14M5 12h14",
  moon:      "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  sun:       ["M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42", "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"],
  calendar:  ["M8 2v4M16 2v4", "M3 8h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
  mapPin:    ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  database:  ["M12 2C6.48 2 2 4.69 2 8s4.48 6 10 6 10-2.69 10-6-4.48-6-10-6z", "M2 8v8c0 3.31 4.48 6 10 6s10-2.69 10-6V8", "M2 12c0 3.31 4.48 6 10 6s10-2.69 10-6"],
  alertTri: ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4M12 17h.01"],
  barChart:  ["M12 20V10", "M18 20V4", "M6 20v-4"],
  x:         "M18 6L6 18M6 6l12 12",
  zap:       "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
};

/*  Helpers  */
const getWorkLocationColor = (location) => {
  switch (location) {
    case 'Work from Home':    return '#10B981';
    case 'Work from Company': return '#3B82F6';
    default:                  return '#6B7280';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

function App() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);

  const [activeTab,        setActiveTab]        = useState('personal');
  const [showEditModal,    setShowEditModal]    = useState(false);
  const [editingTodo,      setEditingTodo]      = useState(null);
  const [editText,         setEditText]         = useState('');
  const [editWorkLocation, setEditWorkLocation] = useState('');
  const [editDueDate,      setEditDueDate]      = useState('');
  const [showAddForm,      setShowAddForm]      = useState(false);
  const [newText,          setNewText]          = useState('');
  const [newCategory,      setNewCategory]      = useState('Personal');
  const [newWorkLocation,  setNewWorkLocation]  = useState('Work from Home');
  const [newDueDate,       setNewDueDate]       = useState('');
  const [darkMode,         setDarkMode]         = useState(false);

  /* Apply dark mode */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  /*  Derived counts  */
  const getCategoryCount = (cat) =>
    todos.filter((t) => t.category === cat && !t.completed).length;

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount   = todos.filter((t) => !t.completed).length;
  const totalCount     = todos.length;
  const completionPct  = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  /*  Filter  */
  const getFilteredTodos = () => {
    if (activeTab === 'work')      return todos.filter((t) => t.category === 'Work'     && !t.completed);
    if (activeTab === 'personal')  return todos.filter((t) => t.category === 'Personal' && !t.completed);
    if (activeTab === 'completed') return todos.filter((t) => t.completed);
    return todos.filter((t) => !t.completed);
  };

  /*  Handlers (unchanged logic)  */
  const handleAddTodo = () => {
    if (!newText.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: newText.trim(),
      category: newCategory,
      dueDate: newDueDate || new Date().toISOString().split('T')[0],
      completed: false,
    };
    if (newCategory === 'Work') newTodo.workLocation = newWorkLocation;
    dispatch(addTodo(newTodo));
    setNewText(''); setNewCategory('Personal');
    setNewWorkLocation('Work from Home'); setNewDueDate('');
    setShowAddForm(false);
  };

  const handleToggleComplete = (id) => dispatch(toggleComplete(id));

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setEditText(todo.text);
    setEditDueDate(todo.dueDate);
    if (todo.category === 'Work' && todo.workLocation) setEditWorkLocation(todo.workLocation);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    const updates = { text: editText.trim(), dueDate: editDueDate };
    if (editingTodo.category === 'Work') updates.workLocation = editWorkLocation;
    dispatch(editTodo({ id: editingTodo.id, updates }));
    setShowEditModal(false); setEditingTodo(null);
  };

  const handleDeleteTodo = (id) => {
    if (window.confirm('Delete this task?')) dispatch(deleteTodo(id));
  };

  const handleDeleteAll = () => {
    if (window.confirm('Delete all tasks? This cannot be undone!')) dispatch(deleteAllTodos());
  };

  const handleReset = () => {
    if (window.confirm('Reset to sample tasks?')) dispatch(resetTodos());
  };

  const tabs = [
    { id: 'work',      icon: Icons.briefcase, label: 'Work Tasks',     count: getCategoryCount('Work') },
    { id: 'personal',  icon: Icons.user,      label: 'Personal Tasks', count: getCategoryCount('Personal') },
    { id: 'completed', icon: Icons.checkCirc, label: 'Completed',      count: completedCount },
    { id: 'settings',  icon: Icons.settings,  label: 'Settings' },
  ];

  const filteredTodos = getFilteredTodos();

  const tabTitle = {
    work:      'Work Tasks',
    personal:  'Personal Tasks',
    completed: 'Completed',
    settings:  'Settings',
  };

  const tabEmoji = { work: '', personal: '', completed: '', settings: '' };

  return (
    <div className="app">

      {/*  Sidebar  */}
      <aside className="sidebar">

        {/* Logo */}
        <div className="logo">
          <div className="logo-inner">
            <div className="logo-icon">⚡</div>
            <div>
              <h2>TodoList</h2>
              <span className="logo-badge">Ni Lucas</span>
            </div>
          </div>
        </div>

    

        {/* Nav */}
        <nav className="nav-menu">
          <div className="nav-section-label">Tasks</div>

          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">
                <Icon d={tab.icon} size={16} />
              </span>
              <span className="nav-text">{tab.label}</span>
              {tab.count !== undefined && (
                <span className="nav-count">{tab.count}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer / theme */}
        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            <Icon d={darkMode ? Icons.sun : Icons.moon} size={15} />
            <span className="theme-label" style={{ fontSize: 13, fontFamily: 'inherit', color: 'inherit' }}>
              {darkMode ? 'Light mode' : 'Dark mode'}
            </span>
            <div className={`toggle-track ${darkMode ? 'on' : ''}`}>
              <div className="toggle-thumb" />
            </div>
          </button>
        </div>
      </aside>

      {/*  Main Content  */}
      <main className="main-content">

        {/* Header */}
        <div className="header">
          <div className="header-greeting">
            {getGreeting()} &nbsp;
            <span style={{ color: 'var(--indigo-500)' }}>{tabEmoji[activeTab]} {tabTitle[activeTab]}</span>
          </div>
          <div className="header-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          {/* Productivity summary bar */}
          {activeTab !== 'settings' && (
            <div className="header-summary">
              <div className="summary-stat">
                <div className="summary-number">{totalCount}</div>
                <div className="summary-label">Total</div>
              </div>
              <div className="summary-stat">
                <div className="summary-number">{pendingCount}</div>
                <div className="summary-label">Pending</div>
              </div>
              <div className="summary-stat">
                <div className="summary-number">{completedCount}</div>
                <div className="summary-label">Done</div>
              </div>
              <div className="summary-stat progress-bar-wrap">
                <div className="progress-label">
                  <span>Daily progress</span>
                  <span className="progress-pct">{completionPct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${completionPct}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/*  Task views  */}
        {activeTab !== 'settings' ? (
          <>
            <div className="section-title">
              {filteredTodos.length} {activeTab === 'completed' ? 'completed' : 'active'} task{filteredTodos.length !== 1 ? 's' : ''}
            </div>

            <div className="task-list">
              {filteredTodos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{activeTab === 'completed' ? '🎉' : '✨'}</div>
                  <h3>{activeTab === 'completed' ? 'Nothing completed yet' : 'All clear!'}</h3>
                  <p>
                    {activeTab === 'completed'
                      ? 'Finish a task and it will appear here.'
                      : 'No tasks in this section. Add one to get started.'}
                  </p>
                  {activeTab !== 'completed' && (
                    <button onClick={() => setShowAddForm(true)} className="empty-add-btn">
                      <Icon d={Icons.plus} size={14} /> Add a task
                    </button>
                  )}
                </div>
              ) : (
                filteredTodos.map((task) => (
                  <div
                    key={task.id}
                    className={`task-card ${task.completed ? 'completed-card' : ''}`}
                  >
                    <div className="task-card-inner">
                      <div className="task-header">
                        <div className="task-checkbox-wrap">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleComplete(task.id)}
                            className="task-checkbox"
                          />
                        </div>

                        <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                          {task.text}
                        </span>

                        {!task.completed && (
                          <div className="task-actions">
                            <button
                              onClick={() => openEditModal(task)}
                              className="icon-btn edit-btn"
                              title="Edit task"
                            >
                              <Icon d={Icons.pencil} size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteTodo(task.id)}
                              className="icon-btn delete-btn"
                              title="Delete task"
                            >
                              <Icon d={Icons.trash} size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="task-footer">
                        {task.category === 'Work' && task.workLocation && (
                          <span
                            className="location-badge"
                            style={{ backgroundColor: getWorkLocationColor(task.workLocation) }}
                          >
                            <Icon d={Icons.mapPin} size={10} />
                            {task.workLocation}
                          </span>
                        )}
                        <span className="due-date">
                          <Icon d={Icons.calendar} size={11} />
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add task button / form */}
            {activeTab !== 'completed' && (
              <>
                {!showAddForm ? (
                  <button onClick={() => setShowAddForm(true)} className="add-task-btn">
                    <Icon d={Icons.plus} size={16} />
                    Add new task
                  </button>
                ) : (
                  <div className="add-form">
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="What needs to be done?"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                        className="add-input"
                        autoFocus
                      />
                    </div>

                    <div className="form-row">
                      <select
                        value={newCategory}
                        onChange={(e) => {
                          setNewCategory(e.target.value);
                          if (e.target.value === 'Personal') setNewWorkLocation('Work from Home');
                        }}
                        className="add-select"
                      >
                        <option value="Work"> Work</option>
                        <option value="Personal"> Personal</option>
                      </select>
                    </div>

                    {newCategory === 'Work' && (
                      <div className="form-row">
                        <select
                          value={newWorkLocation}
                          onChange={(e) => setNewWorkLocation(e.target.value)}
                          className="add-select"
                        >
                          <option value="Work from Home"> Work from Home</option>
                          <option value="Work from Company"> Work from Company</option>
                        </select>
                      </div>
                    )}

                    <div className="form-row">
                      <input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="add-input"
                      />
                    </div>

                    <div className="add-buttons">
                      <button onClick={handleAddTodo} className="save-add-btn">
                        Add Task
                      </button>
                      <button onClick={() => setShowAddForm(false)} className="cancel-add-btn">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (

          /*  Settings  */
          <div className="settings-panel">

            <div className="settings-section">
              <h3><Icon d={Icons.database} size={15} style={{ display: 'inline', marginRight: 6 }} /> Data Persistence</h3>
              <p className="settings-desc">Your tasks are automatically saved to localStorage and restored every session.</p>
              <div className="settings-status">
                <Icon d={Icons.check} size={13} />
                Auto-save active
              </div>
            </div>

            <div className="settings-section">
              <h3><Icon d={Icons.alertTri} size={15} style={{ display: 'inline', marginRight: 6 }} /> Data Management</h3>
              <p className="settings-desc">These actions are irreversible. Proceed with caution.</p>
              <div className="btn-row">
                <button onClick={handleDeleteAll} className="danger-btn">
                  <Icon d={Icons.trash} size={14} /> Delete all tasks
                </button>
                <button onClick={handleReset} className="warning-btn">
                  <Icon d={Icons.zap} size={14} /> Reset to samples
                </button>
              </div>
            </div>

            <div className="settings-section">
              <h3><Icon d={Icons.barChart} size={15} style={{ display: 'inline', marginRight: 6 }} /> Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{totalCount}</div>
                  <div className="stat-label">Total tasks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{completedCount}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{pendingCount}</div>
                  <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{getCategoryCount('Work')}</div>
                  <div className="stat-label">Work tasks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{getCategoryCount('Personal')}</div>
                  <div className="stat-label">Personal</div>
                </div>
              </div>

              <div className="completion-bar-wrap" style={{ marginTop: 20 }}>
                <div className="completion-label-row">
                  <span>Overall completion</span>
                  <span className="completion-pct">{completionPct}%</span>
                </div>
                <div className="progress-track" style={{ height: 8 }}>
                  <div className="progress-fill" style={{ width: `${completionPct}%` }} />
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/*  Edit Modal  */}
      {showEditModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Task</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <Icon d={Icons.x} size={15} />
              </button>
            </div>

            <div className="modal-field">
              <label>Task name</label>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                className="modal-input"
                autoFocus
              />
            </div>

            {editingTodo?.category === 'Work' && (
              <div className="modal-field">
                <label>Work location</label>
                <select
                  value={editWorkLocation}
                  onChange={(e) => setEditWorkLocation(e.target.value)}
                  className="modal-select"
                >
                  <option value="Work from Home"> Work from Home</option>
                  <option value="Work from Company"> Work from Company</option>
                </select>
              </div>
            )}

            <div className="modal-field">
              <label>Due date</label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="modal-input"
              />
            </div>

            <div className="modal-buttons">
              <button onClick={() => setShowEditModal(false)} className="modal-cancel">
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="modal-save">
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;