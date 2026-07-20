import * as types from './task.types';
import { TaskService } from '../../TaskService';
import { Task } from '../../../domain/entities/Task';
import { AppDispatch } from '../store';
import { auth } from '../../../firebase/config';

//  Cache the service by repository type
const serviceCache: Record<string, TaskService> = {};

const getTaskService = (type?: 'localStorage' | 'inMemory' | 'firebase') => {
  const user = auth.currentUser;
  const repoType = type || 'localStorage';
  const cacheKey = `${repoType}_${user?.uid || 'anonymous'}`;
  
  if (!serviceCache[cacheKey]) {
    console.log(' Creating new TaskService for:', cacheKey);
    if (repoType === 'firebase' && user) {
      serviceCache[cacheKey] = new TaskService('firebase', user.uid);
    } else {
      serviceCache[cacheKey] = new TaskService(repoType);
    }
  } else {
    console.log(' Reusing existing TaskService for:', cacheKey);
  }
  
  return serviceCache[cacheKey];
};

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
    
    const newTask = await taskService.addTask(
      taskData.title,
      taskData.category,
      taskData.dueDate,
      taskData.workLocation
    );
    
    console.log(' createTask: Task added with ID:', newTask.id);
    dispatch({ type: types.CREATE_TASK, payload: newTask });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error: any) {
    console.error(' createTask: ERROR:', error);
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
    
    const tasks = await taskService.getAllTasks();
    console.log(' readTasks: Found', tasks.length, 'tasks');
    dispatch({ type: types.READ_TASKS, payload: tasks });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error: any) {
    console.error(' readTasks: ERROR:', error);
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const updateTask = (id: number, updates: Partial<Omit<Task, 'id'>>) => async (dispatch: AppDispatch, getState: any) => {
  console.log(' updateTask: Called with ID:', id);
  
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const state = getState();
    const currentRepo = state.tasks.repositoryType || 'localStorage';
    const taskService = getTaskService(currentRepo);
    
    const updated = await taskService.updateTask(id, updates);
    
    if (!updated) {
      console.error(' updateTask: Task NOT found for ID:', id);
      dispatch({ type: types.SET_ERROR, payload: `Task with id ${id} not found` });
    } else {
      console.log(' updateTask: Task updated:', updated);
      dispatch({ type: types.UPDATE_TASK, payload: updated });
      dispatch({ type: types.SET_ERROR, payload: null });
    }
  } catch (error: any) {
    console.error(' updateTask: ERROR:', error);
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const deleteTask = (id: number) => async (dispatch: AppDispatch, getState: any) => {
  console.log(' deleteTask: Called with ID:', id);
  
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const state = getState();
    const currentRepo = state.tasks.repositoryType || 'localStorage';
    const taskService = getTaskService(currentRepo);
    
    const deleted = await taskService.removeTask(id);
    
    if (!deleted) {
      console.error(' deleteTask: Task NOT found for ID:', id);
      dispatch({ type: types.SET_ERROR, payload: `Task with id ${id} not found` });
    } else {
      console.log(' deleteTask: Task deleted');
      dispatch({ type: types.DELETE_TASK, payload: id });
      dispatch({ type: types.SET_ERROR, payload: null });
    }
  } catch (error: any) {
    console.error(' deleteTask: ERROR:', error);
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
    dispatch({ type: types.SWITCH_REPOSITORY, payload: { tasks, type } });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error: any) {
    console.error(' switchRepository: ERROR:', error);
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const setActiveTab = (tab: 'work' | 'personal' | 'completed' | 'settings') => ({
  type: types.SET_ACTIVE_TAB,
  payload: tab,
});