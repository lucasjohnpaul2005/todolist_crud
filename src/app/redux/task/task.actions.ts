import * as types from './task.types';
import { TaskService } from '../../TaskService';
import { Task } from '../../../domain/entities/Task';
import { AppDispatch } from '../store';

const taskService = new TaskService('localStorage');

// CRUD Actions
export const createTask = (taskData: { 
  title: string; 
  category: 'Work' | 'Personal'; 
  dueDate: string; 
  workLocation?: 'Work from Home' | 'Work from Company' 
}) => async (dispatch: AppDispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const newTask = await taskService.addTask(
      taskData.title,
      taskData.category,
      taskData.dueDate,
      taskData.workLocation
    );
    dispatch({ type: types.CREATE_TASK, payload: newTask });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error: any) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const readTasks = () => async (dispatch: AppDispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const tasks = await taskService.getAllTasks();
    dispatch({ type: types.READ_TASKS, payload: tasks });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error: any) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const updateTask = (id: number, updates: Partial<Omit<Task, 'id'>>) => async (dispatch: AppDispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const updated = await taskService.updateTask(id, updates);
    dispatch({ type: types.UPDATE_TASK, payload: updated });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error: any) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const deleteTask = (id: number) => async (dispatch: AppDispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    await taskService.removeTask(id);
    dispatch({ type: types.DELETE_TASK, payload: id });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error: any) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const switchRepository = (type: 'localStorage' | 'inMemory') => async (dispatch: AppDispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const tasks = await taskService.switchRepository(type);
    dispatch({ type: types.SWITCH_REPOSITORY, payload: { tasks, type } });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error: any) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const setActiveTab = (tab: 'work' | 'personal' | 'completed' | 'settings') => ({
  type: types.SET_ACTIVE_TAB,
  payload: tab,
});