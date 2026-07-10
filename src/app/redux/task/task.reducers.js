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
    case types.LOAD_TASKS:
      return { ...state, tasks: action.payload };
    
    case types.ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    
    case types.TOGGLE_COMPLETE:
    case types.EDIT_TASK:
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        const newTasks = [...state.tasks];
        newTasks[index] = action.payload;
        return { ...state, tasks: newTasks };
      }
      return state;
    
    case types.DELETE_TASK:
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    
    case types.CLEAR_ALL:
      return { ...state, tasks: [] };
    
    case types.SWITCH_REPOSITORY:
      return { ...state, tasks: action.payload.tasks, repositoryType: action.payload.type };
    
    case types.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    
    case types.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case types.SET_ERROR:
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
};

export default taskReducer;