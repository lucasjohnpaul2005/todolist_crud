import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage
const loadTodos = () => {
  const saved = localStorage.getItem('todos');
  return saved ? JSON.parse(saved) : [
    { id: 1, text: 'Creating a To Do List Application', category: 'Work', workLocation: 'Work from Company', dueDate: '2026-06-08', completed: false },
        { id: 2, text: 'Call client regarding feedback of ToDoList', category: 'Work', workLocation: 'Work from Company', dueDate: '2026-06-16', completed: false },
        { id: 3, text: 'Team meeting summary of To Do List Output ', category: 'Work', workLocation: 'Work from Home', dueDate: '2026-06-12', completed: false },
        { id: 4, text: 'Integrate State Management using Redux Toolkit ', category: 'Work', workLocation: 'Work from Company', dueDate: '2026-06-15', completed: false },
        { id: 5, text: 'Call client regarding feedback of Redux Toolkit', category: 'Work', workLocation: 'Work from Company', dueDate: '2026-06-16', completed: false },
        { id: 6, text: 'Team meeting summary of Redux Toolkit', category: 'Work', workLocation: 'Work from Home', dueDate: '2026-06-19', completed: false },
        { id: 7, text: 'Buy groceries', category: 'Personal', dueDate: '2026-06-11', completed: false },
        { id: 8, text: 'Go to gym', category: 'Personal', dueDate: '2026-06-10', completed: false },
        { id: 9, text: 'Wash clothes', category: 'Personal', dueDate: '2026-06-20', completed: false },
        { id: 10, text: 'Plan weekend trip', category: 'Personal', dueDate: '2026-06-14', completed: false },
        { id: 11, text: 'Read a book', category: 'Personal', dueDate: '2026-06-18', completed: false },
      ];
};

// Save to localStorage
const saveTodos = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

const todosSlice = createSlice({
  name: 'todos',
  initialState: loadTodos(),
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
      saveTodos(state);
    },
    toggleComplete: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state);
      }
    },
    editTodo: (state, action) => {
      const { id, updates } = action.payload;
      const todo = state.find(t => t.id === id);
      if (todo) {
        Object.assign(todo, updates);
        saveTodos(state);
      }
    },
    deleteTodo: (state, action) => {
      const newState = state.filter(t => t.id !== action.payload);
      saveTodos(newState);
      return newState;
    },
    deleteAllTodos: (state) => {
      saveTodos([]);
      return [];
    },
    resetTodos: (state) => {
      const defaultTodos = [
        { id: 1, text: 'Creating a To Do List Application', category: 'Work', workLocation: 'Work from Company', dueDate: '2026-06-08', completed: false },
        { id: 2, text: 'Call client regarding feedback of ToDoList', category: 'Work', workLocation: 'Work from Company', dueDate: '2026-06-16', completed: false },
        { id: 3, text: 'Team meeting summary of To Do List Output ', category: 'Work', workLocation: 'Work from Home', dueDate: '2026-06-12', completed: false },
        { id: 4, text: 'Integrate State Management using Redux Toolkit ', category: 'Work', workLocation: 'Work from Company', dueDate: '2026-06-15', completed: false },
        { id: 5, text: 'Call client regarding feedback of Redux Toolkit', category: 'Work', workLocation: 'Work from Company', dueDate: '2026-06-16', completed: false },
        { id: 6, text: 'Team meeting summary of Redux Toolkit', category: 'Work', workLocation: 'Work from Home', dueDate: '2026-06-19', completed: false },
        { id: 7, text: 'Buy groceries', category: 'Personal', dueDate: '2026-06-11', completed: false },
        { id: 8, text: 'Go to gym', category: 'Personal', dueDate: '2026-06-10', completed: false },
        { id: 9, text: 'Wash clothes', category: 'Personal', dueDate: '2026-06-20', completed: false },
        { id: 10, text: 'Plan weekend trip', category: 'Personal', dueDate: '2026-06-14', completed: false },
        { id: 11, text: 'Read a book', category: 'Personal', dueDate: '2026-06-18', completed: false },
      ];
      saveTodos(defaultTodos);
      return defaultTodos;
    },
  },
});

export const {
  addTodo,
  toggleComplete,
  editTodo,
  deleteTodo,
  deleteAllTodos,
  resetTodos,
} = todosSlice.actions;

export default todosSlice.reducer;