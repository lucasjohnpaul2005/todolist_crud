import * as types from './task.types';
import { TaskService } from '../../TaskService';
import { Task } from '../../../domain/entities/Task';
import { AppDispatch } from '../store';
import { auth } from '../../../firebase/config';

//  Create service based on user and repository type
const getTaskService = (type?: 'localStorage' | 'inMemory' | 'firebase') => {
  const user = auth.currentUser;
  const repoType = type || 'localStorage';
  
  console.log(' Creating service for repository:', repoType);
  
  if (repoType === 'firebase' && user) {
    console.log(' Using Firebase repository for user:', user.uid);
    return new TaskService('firebase', user.uid);
  }
  
  if (repoType === 'inMemory') {
    console.log(' Using InMemory repository');
    return new TaskService('inMemory');
  }
  
  console.log(' Using LocalStorage repository');
  return new TaskService('localStorage');
};

// CRUD Actions
export const createTask = (taskData: {
  title: string;
  category: 'Work' | 'Personal';
  dueDate: string;
  workLocation?: 'Work from Home' | 'Work from Company';
}) => async (dispatch: AppDispatch, getState: any) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const state = getState();
    const currentRepo = state.tasks.repositoryType || 'localStorage';
    const taskService = getTaskService(currentRepo);
    
    console.log(' Creating task in repository:', currentRepo);
    const newTask = await taskService.addTask(
      taskData.title,
      taskData.category,
      taskData.dueDate,
      taskData.workLocation
    );
    dispatch({ type: types.CREATE_TASK, payload: newTask });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error: any) {
    console.error(' Create task error:', error);
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const readTasks = () => async (dispatch: AppDispatch, getState: any) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const state = getState();
    const currentRepo = state.tasks.repositoryType || 'localStorage';
    const taskService = getTaskService(currentRepo);
    
    console.log(' Reading tasks from repository:', currentRepo);
    const tasks = await taskService.getAllTasks();
    dispatch({ type: types.READ_TASKS, payload: tasks });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error: any) {
    console.error(' Read tasks error:', error);
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const updateTask = (id: number, updates: Partial<Omit<Task, 'id'>>) => async (dispatch: AppDispatch, getState: any) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const state = getState();
    const currentRepo = state.tasks.repositoryType || 'localStorage';
    const taskService = getTaskService(currentRepo);
    
    console.log(' Updating task in repository:', currentRepo);
    const updated = await taskService.updateTask(id, updates);
    dispatch({ type: types.UPDATE_TASK, payload: updated });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error: any) {
    console.error(' Update task error:', error);
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const deleteTask = (id: number) => async (dispatch: AppDispatch, getState: any) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const state = getState();
    const currentRepo = state.tasks.repositoryType || 'localStorage';
    const taskService = getTaskService(currentRepo);
    
    console.log(' Deleting task from repository:', currentRepo);
    await taskService.removeTask(id);
    dispatch({ type: types.DELETE_TASK, payload: id });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error: any) {
    console.error(' Delete task error:', error);
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const switchRepository = (type: 'localStorage' | 'inMemory' | 'firebase') => async (dispatch: AppDispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const user = auth.currentUser;
    let taskService;
    
    if (type === 'firebase' && user) {
      taskService = new TaskService('firebase', user.uid);
    } else {
      taskService = new TaskService(type);
    }
    
    const tasks = await taskService.getAllTasks();
    console.log(' Switched to repository:', type, 'Tasks:', tasks.length);
    dispatch({ type: types.SWITCH_REPOSITORY, payload: { tasks, type } });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error: any) {
    console.error(' Switch repository error:', error);
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const setActiveTab = (tab: 'work' | 'personal' | 'completed' | 'settings') => ({
  type: types.SET_ACTIVE_TAB,
  payload: tab,
});