import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loadTasks,
  addTask,
  toggleComplete,
  editTask,
  deleteTask,
  clearAllTasks,
  switchRepository,
  setActiveTab,
} from '../../store/task.slice';
import { Sidebar } from '../components/todo/Sidebar';
import { TodoList } from '../components/todo/TodoList';
import { AddTaskForm } from '../components/todo/AddTaskForm';
import { EditModal } from '../components/todo/EditModal';

export const TodoPage = () => {
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

  React.useEffect(() => {
    dispatch(loadTasks());
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

  const getCategoryCount = (category) => {
    return tasks.filter(t => t.category === category && !t.completed).length;
  };

  const filteredTodos = getFilteredTodos();
  const counts = {
    work: getCategoryCount('Work'),
    personal: getCategoryCount('Personal'),
    completed: tasks.filter(t => t.completed).length,
  };

  const handleAddTodo = () => {
    if (newText.trim()) {
      dispatch(addTask({
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

  const handleToggleComplete = (id) => {
    dispatch(toggleComplete(id));
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

  const handleSaveEdit = () => {
    if (editText.trim()) {
      const updates = { title: editText.trim(), dueDate: editDueDate };
      if (editingTodo.category === 'Work') {
        updates.workLocation = editWorkLocation;
      }
      dispatch(editTask({ id: editingTodo.id, updates }));
      setShowEditModal(false);
      setEditingTodo(null);
    }
  };

  const handleDeleteTodo = (id) => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Delete all tasks?')) {
      dispatch(clearAllTasks());
    }
  };

  const handleSwitchRepository = (type) => {
    dispatch(switchRepository(type));
  };

  if (isLoading && tasks.length === 0) {
    return <div className="app"><div className="loading-state">Loading...</div></div>;
  }

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={(tab) => dispatch(setActiveTab(tab))} counts={counts} />
      
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
            <TodoList
              todos={filteredTodos}
              onToggleComplete={handleToggleComplete}
              onEdit={openEditModal}
              onDelete={handleDeleteTodo}
            />

            {!showAddForm ? (
              <button onClick={() => setShowAddForm(true)} className="add-task-btn">+ Add New Task</button>
            ) : (
              <AddTaskForm
                onAdd={(text, category, dueDate, workLocation) => {
                  dispatch(addTask({ title: text, category, dueDate, workLocation }));
                  setShowAddForm(false);
                }}
                onCancel={() => setShowAddForm(false)}
              />
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
              <button onClick={handleClearAll} className="danger-btn"> Delete All Tasks</button>
            </div>

            <div className="settings-section">
              <h3> Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-number">{tasks.length}</div><div className="stat-label">Total</div></div>
                <div className="stat-card"><div className="stat-number">{tasks.filter(t => t.completed).length}</div><div className="stat-label">Done</div></div>
                <div className="stat-card"><div className="stat-number">{tasks.filter(t => !t.completed).length}</div><div className="stat-label">Pending</div></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <EditModal
        isOpen={showEditModal}
        todo={editingTodo}
        onSave={(id, updates) => {
          dispatch(editTask({ id, updates }));
          setShowEditModal(false);
          setEditingTodo(null);
        }}
        onClose={() => {
          setShowEditModal(false);
          setEditingTodo(null);
        }}
      />
    </div>
  );
};