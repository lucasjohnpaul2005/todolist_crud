import * as types from './task.types';

const initialState = {
  tasks: [],
  activeTab: 'personal',
  isLoading: false,
  error: null,
  repositoryType: 'localStorage',
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    // CRUD Operations
    case types.CREATE_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    
    case types.READ_TASKS:
      return { ...state, tasks: action.payload };
    
    case types.UPDATE_TASK:
      const updateIndex = state.tasks.findIndex(t => t.id === action.payload.id);
      if (updateIndex !== -1) {
        const newTasks = [...state.tasks];
        newTasks[updateIndex] = action.payload;
        return { ...state, tasks: newTasks };
      }
      return state;
    
    case types.DELETE_TASK:
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    
    // UI State
    case types.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case types.SET_ERROR:
      return { ...state, error: action.payload };
    
    case types.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    
    case types.SWITCH_REPOSITORY:
      return { ...state, tasks: action.payload.tasks, repositoryType: action.payload.type };
    
    default:
      return state;
  }
};

export default taskReducer;