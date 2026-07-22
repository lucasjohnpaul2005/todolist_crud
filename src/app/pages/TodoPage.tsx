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
import {
  Menu,
  X,
  Briefcase,
  Home,
  CheckCircle2,
  Settings as SettingsIcon,
  ClipboardList,
  LogOut,
  Plus,
  Database,
  HardDrive,
  MemoryStick,
  Flame,
  Trash2,
  BarChart3,
} from 'lucide-react';

export const TodoPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, activeTab, isLoading, error, repositoryType } = useAppSelector((state) => state.tasks);

  // Sidebar state for mobile
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

  const TAB_META = {
    work: { label: 'Work Tasks', Icon: Briefcase },
    personal: { label: 'Personal Tasks', Icon: Home },
    completed: { label: 'Completed Tasks', Icon: CheckCircle2 },
    settings: { label: 'Settings', Icon: SettingsIcon },
  } as const;

  // CREATE - Add Task
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

  // UPDATE - Toggle Complete
  const handleToggleComplete = (id: number): void => {
    const task = tasks.find(t => t.id === id);

    if (task) {
      dispatch(updateTask(id, { completed: !task.completed }));
    } else {
      console.error('handleToggleComplete: Task with ID', id, 'not found in Redux state');
    }
  };

  const openEditModal = (todo: Task): void => {
    setEditingTodo(todo);
    setShowEditModal(true);
  };

  // UPDATE - Save Edit
  const handleSaveEdit = (id: number, updates: { title: string; dueDate: string; workLocation?: 'Work from Home' | 'Work from Company' }): void => {
    dispatch(updateTask(id, updates));
    setShowEditModal(false);
    setEditingTodo(null);
  };

  // DELETE - Delete Task
  const handleDeleteTodo = (id: number): void => {
    const task = tasks.find(t => t.id === id);

    if (task?.workLocation === 'Work from Company') {
      alert('Company tasks cannot be deleted.');
      return;
    }

    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  const handleClearAll = (): void => {
    const hasCompanyTasks = tasks.some(t => t.workLocation === 'Work from Company');
    if (hasCompanyTasks) {
      alert('Cannot delete all tasks — Company tasks cannot be deleted.');
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
            <h2><ClipboardList size={22} /> TodoList</h2>
          </div>
        </div>
        <div className="main-content">
          <div className="loading-state">Loading...</div>
        </div>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="app">
      {/* HAMBURGER MENU BUTTON - Mobile Only */}
      <button
        className="menu-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* SIDEBAR */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2><ClipboardList size={22} /> TodoList</h2>
          <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>
        <div className="logo">
          <h2><ClipboardList size={22} /> TodoList</h2>
        </div>
        <nav className="nav-menu">
          <button
            className={`nav-item ${activeTab === 'work' ? 'active' : ''}`}
            aria-current={activeTab === 'work' ? 'page' : undefined}
            onClick={() => {
              dispatch(setActiveTab('work'));
              setIsSidebarOpen(false);
            }}
          >
            <span className="nav-icon"><Briefcase size={18} /></span>
            <span className="nav-text">Work Tasks</span>
            <span className="nav-count">{getCategoryCount('Work')}</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
            aria-current={activeTab === 'personal' ? 'page' : undefined}
            onClick={() => {
              dispatch(setActiveTab('personal'));
              setIsSidebarOpen(false);
            }}
          >
            <span className="nav-icon"><Home size={18} /></span>
            <span className="nav-text">Personal Tasks</span>
            <span className="nav-count">{getCategoryCount('Personal')}</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'completed' ? 'active' : ''}`}
            aria-current={activeTab === 'completed' ? 'page' : undefined}
            onClick={() => {
              dispatch(setActiveTab('completed'));
              setIsSidebarOpen(false);
            }}
          >
            <span className="nav-icon"><CheckCircle2 size={18} /></span>
            <span className="nav-text">Completed</span>
            <span className="nav-count">{completedCount}</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            aria-current={activeTab === 'settings' ? 'page' : undefined}
            onClick={() => {
              dispatch(setActiveTab('settings'));
              setIsSidebarOpen(false);
            }}
          >
            <span className="nav-icon"><SettingsIcon size={18} /></span>
            <span className="nav-text">Settings</span>
          </button>
        </nav>
      </div>

      {/* OVERLAY - Mobile only */}
      {isSidebarOpen && (
        <div className="sidebar-overlay open" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div className="header-left">
            <h1>
              {(() => {
                const { Icon, label } = TAB_META[activeTab as keyof typeof TAB_META];
                return (
                  <>
                    <Icon size={30} strokeWidth={2} />
                    {label}
                  </>
                );
              })()}
            </h1>
            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="header-right">
            <span className="user-email">{auth.currentUser?.email || 'User'}</span>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} />
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
              <div className="stat-number">{completedCount}</div>
              <div className="stat-label">Done</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{pendingCount}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="progress-section">
            <div className="progress-header">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {error && <div className="error-message" role="alert" aria-live="polite">{error}</div>}

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
                <Plus size={18} />
                Add New Task
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
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                </select>
                {newCategory === 'Work' && (
                  <select
                    value={newWorkLocation}
                    onChange={(e) => setNewWorkLocation(e.target.value as 'Work from Home' | 'Work from Company')}
                    className="add-select"
                  >
                    <option value="Work from Home">Work from Home</option>
                    <option value="Work from Company">Work from Company</option>
                  </select>
                )}
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="add-input"
                />
                <div className="add-buttons">
                  <button onClick={handleAddTodo} className="save-add-btn" disabled={!newText.trim()}>
                    Add Task
                  </button>
                  <button onClick={() => setShowAddForm(false)} className="cancel-add-btn">Cancel</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="settings-panel">
            <div className="settings-section">
              <h3><Database size={18} /> Data Repository</h3>
              <div className="repository-switch">
                <button
                  className={`repo-btn ${repositoryType === 'localStorage' ? 'active' : ''}`}
                  onClick={() => handleSwitchRepository('localStorage')}
                >
                  <HardDrive size={16} /> Local Storage
                </button>
                <button
                  className={`repo-btn ${repositoryType === 'inMemory' ? 'active' : ''}`}
                  onClick={() => handleSwitchRepository('inMemory')}
                >
                  <MemoryStick size={16} /> In Memory
                </button>
                <button
                  className={`repo-btn ${repositoryType === 'firebase' ? 'active' : ''}`}
                  onClick={() => handleSwitchRepository('firebase')}
                >
                  <Flame size={16} /> Firebase
                </button>
              </div>
              <p className="repo-status-text">
                Current: <strong>
                  {repositoryType === 'localStorage' && 'Local Storage'}
                  {repositoryType === 'inMemory' && 'In Memory'}
                  {repositoryType === 'firebase' && 'Firebase'}
                </strong>
              </p>
              {repositoryType === 'firebase' && (
                <p className="repo-connected-text">
                  <CheckCircle2 size={14} /> Connected to Firebase Cloud
                </p>
              )}
            </div>

            <div className="settings-section">
              <h3>Data Management</h3>
              <button onClick={handleClearAll} className="danger-btn">
                <Trash2 size={16} /> Delete All Tasks
              </button>
            </div>

            <div className="settings-section">
              <h3><BarChart3 size={18} /> Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-number">{tasks.length}</div><div className="stat-label">Total</div></div>
                <div className="stat-card"><div className="stat-number">{completedCount}</div><div className="stat-label">Done</div></div>
                <div className="stat-card"><div className="stat-number">{pendingCount}</div><div className="stat-label">Pending</div></div>
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