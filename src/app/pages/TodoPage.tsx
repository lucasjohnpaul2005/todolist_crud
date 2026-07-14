import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  createTask,
  updateTask,
  deleteTask,
  switchRepository,
  setActiveTab,
} from '../redux/task/task.actions';
import { Sidebar } from '../components/todo/Sidebar';
import { TodoList } from '../components/todo/TodoList';
import { EditModal } from '../components/todo/EditModal';
import { Task } from '../../domain/entities/Task';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';

export const TodoPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, activeTab, isLoading, error, repositoryType } = useAppSelector((state) => state.tasks);

  // UI state
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editingTodo, setEditingTodo] = React.useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = React.useState(false);

  const [newText, setNewText] = React.useState('');
  const [newCategory, setNewCategory] = React.useState<'Work' | 'Personal'>('Personal');
  const [newWorkLocation, setNewWorkLocation] = React.useState<'Work from Home' | 'Work from Company'>('Work from Home');
  const [newDueDate, setNewDueDate] = React.useState('');

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
  const counts = {
    work: getCategoryCount('Work'),
    personal: getCategoryCount('Personal'),
    completed: tasks.filter(t => t.completed).length,
  };

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
    // Check if trying to switch to Firebase without being logged in
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
      <Sidebar activeTab={activeTab} onTabChange={(tab) => dispatch(setActiveTab(tab))} counts={counts} />

      <div className="main-content">
        {/* HEADER WITH LOGOUT BUTTON */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '12px 20px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', color: 'white', margin: 0 }}>
              {activeTab === 'work' && ' Work Tasks'}
              {activeTab === 'personal' && ' Personal Tasks'}
              {activeTab === 'completed' && ' Completed Tasks'}
              {activeTab === 'settings' && ' Settings'}
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: 'white', fontSize: '14px' }}>
               {auth.currentUser?.email || 'User'}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 24px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
               Logout
            </button>
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