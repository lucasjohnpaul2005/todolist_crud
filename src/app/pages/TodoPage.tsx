import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  createTask,
  updateTask,
  deleteTask,
  switchRepository,
  setActiveTab,
} from '../redux/task/task.actions';
import { TodoList } from '../components/todo/TodoList';
import { EditModal } from '../components/todo/EditModal';
import { Task } from '../../domain/entities/Task';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';

export const TodoPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, activeTab, isLoading, error, repositoryType } = useAppSelector((state) => state.tasks);

  //  Sidebar state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // UI state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<'Work' | 'Personal'>('Personal');
  const [newWorkLocation, setNewWorkLocation] = useState<'Work from Home' | 'Work from Company'>('Work from Home');
  const [newDueDate, setNewDueDate] = useState('');

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getFilteredTodos = (): Task[] => {
    if (activeTab === 'work') {
      return tasks.filter(t => t.category === 'Work' && !t.completed);
    } else if (activeTab === 'personal') {
      return tasks.filter(t => t.category === 'Personal' && !t.completed);
    } else if (activeTab === 'completed') {
      return tasks.filter(t => t.completed);
    }
    return tasks.filter(t => !t.completed);
  };

  const getCategoryCount = (category: 'Work' | 'Personal'): number => {
    return tasks.filter(t => t.category === category && !t.completed).length;
  };

  const filteredTodos = getFilteredTodos();

  const handleAddTodo = (): void => {
    if (newText.trim()) {
      dispatch(createTask({
        title: newText.trim(),
        category: newCategory,
        dueDate: newDueDate || new Date().toISOString().split('T')[0],
        workLocation: newCategory === 'Work' ? newWorkLocation : undefined,
      }));
      setNewText('');
      setNewCategory('Personal');
      setNewWorkLocation('Work from Home');
      setNewDueDate('');
      setShowAddForm(false);
    }
  };

  const handleToggleComplete = (id: number): void => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      dispatch(updateTask(id, { completed: !task.completed }));
    }
  };

  const openEditModal = (todo: Task): void => {
    setEditingTodo(todo);
    setShowEditModal(true);
  };

  const handleSaveEdit = (id: number, updates: { title: string; dueDate: string; workLocation?: 'Work from Home' | 'Work from Company' }): void => {
    dispatch(updateTask(id, updates));
    setShowEditModal(false);
    setEditingTodo(null);
  };

  const handleDeleteTodo = (id: number): void => {
    const task = tasks.find(t => t.id === id);
    if (task?.workLocation === 'Work from Company') {
      alert(' Cannot delete Company tasks!');
      return;
    }
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  const handleClearAll = (): void => {
    const hasCompanyTasks = tasks.some(t => t.workLocation === 'Work from Company');
    if (hasCompanyTasks) {
      alert(' Cannot delete all tasks. Company tasks cannot be deleted.');
      return;
    }
    if (window.confirm('Delete all tasks?')) {
      tasks.forEach(task => {
        dispatch(deleteTask(task.id));
      });
    }
  };

  const handleSwitchRepository = (type: 'localStorage' | 'inMemory' | 'firebase'): void => {
    if (type === 'firebase' && !auth.currentUser) {
      alert('Please login first to use Firebase repository.');
      return;
    }
    dispatch(switchRepository(type));
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
      {/*  HAMBURGER MENU BUTTON - Only visible on mobile */}
      <button 
        className="menu-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/*  SIDEBAR - Always visible on desktop, toggles on mobile */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2> TodoList</h2>
          <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
            ✕
          </button>
        </div>
        <div className="logo">
          <h2> TodoList</h2>
        </div>
        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'work' ? 'active' : ''}`}
            onClick={() => {
              dispatch(setActiveTab('work'));
              setIsSidebarOpen(false);
            }}
          >
            <span className="nav-icon"></span>
            <span className="nav-text">Work Tasks</span>
            <span className="nav-count">{getCategoryCount('Work')}</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => {
              dispatch(setActiveTab('personal'));
              setIsSidebarOpen(false);
            }}
          >
            <span className="nav-icon"></span>
            <span className="nav-text">Personal Tasks</span>
            <span className="nav-count">{getCategoryCount('Personal')}</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => {
              dispatch(setActiveTab('completed'));
              setIsSidebarOpen(false);
            }}
          >
            <span className="nav-icon"></span>
            <span className="nav-text">Completed</span>
            <span className="nav-count">{tasks.filter(t => t.completed).length}</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => {
              dispatch(setActiveTab('settings'));
              setIsSidebarOpen(false);
            }}
          >
            <span className="nav-icon"></span>
            <span className="nav-text">Settings</span>
          </button>
        </nav>
      </div>

      {/*  OVERLAY - Only visible on mobile when sidebar is open */}
      {isSidebarOpen && (
        <div className="sidebar-overlay open" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div className="header-left">
            <h1>
              {activeTab === 'work' && ' Work Tasks'}
              {activeTab === 'personal' && ' Personal Tasks'}
              {activeTab === 'completed' && ' Completed Tasks'}
              {activeTab === 'settings' && ' Settings'}
            </h1>
            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="header-right">
            <span className="user-email"> {auth.currentUser?.email || 'User'}</span>
            <button onClick={handleLogout} className="logout-btn">
               Logout
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-number">{tasks.length}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{tasks.filter(t => t.completed).length}</div>
              <div className="stat-label">Done</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{tasks.filter(t => !t.completed).length}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="progress-section">
            <div className="progress-header">
              <span>Progress</span>
              <span>{tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%` }}
              />
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {activeTab !== 'settings' ? (
          <>
            <TodoList
              todos={filteredTodos}
              onToggleComplete={handleToggleComplete}
              onEdit={openEditModal}
              onDelete={handleDeleteTodo}
            />

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
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as 'Work' | 'Personal')}
                  className="add-select"
                >
                  <option value="Work"> Work</option>
                  <option value="Personal"> Personal</option>
                </select>
                {newCategory === 'Work' && (
                  <select
                    value={newWorkLocation}
                    onChange={(e) => setNewWorkLocation(e.target.value as 'Work from Home' | 'Work from Company')}
                    className="add-select"
                  >
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
                <button
                  className={`repo-btn ${repositoryType === 'firebase' ? 'active' : ''}`}
                  onClick={() => handleSwitchRepository('firebase')}
                >
                   Firebase
                </button>
              </div>
              <p style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>
                Current: <strong>
                  {repositoryType === 'localStorage' && ' Local Storage'}
                  {repositoryType === 'inMemory' && ' In Memory'}
                  {repositoryType === 'firebase' && ' Firebase'}
                </strong>
              </p>
              {repositoryType === 'firebase' && (
                <p style={{ marginTop: '8px', fontSize: '12px', color: '#28a745' }}>
                   Connected to Firebase Cloud
                </p>
              )}
            </div>

            <div className="settings-section">
              <h3>Data Management</h3>
              <button onClick={handleClearAll} className="danger-btn">
                 Delete All Tasks
              </button>
            </div>

            <div className="settings-section">
              <h3> Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-number">{tasks.length}</div><div className="stat-label">Total</div></div>
                <div className="stat-card"><div className="stat-number">{tasks.filter(t => t.completed).length}</div><div className="stat-label">Done</div></div>
                <div className="stat-card"><div className="stat-number">{tasks.filter(t => !t.completed).length}</div><div className="stat-label">Pending</div></div>
                <div className="stat-card"><div className="stat-number">{tasks.filter(t => t.category === 'Work' && !t.completed).length}</div><div className="stat-label">Work</div></div>
                <div className="stat-card"><div className="stat-number">{tasks.filter(t => t.category === 'Personal' && !t.completed).length}</div><div className="stat-label">Personal</div></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <EditModal
        isOpen={showEditModal}
        todo={editingTodo}
        onSave={handleSaveEdit}
        onClose={() => {
          setShowEditModal(false);
          setEditingTodo(null);
        }}
      />
    </div>
  );
};