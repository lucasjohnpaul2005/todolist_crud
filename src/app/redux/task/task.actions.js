import * as types from './task.types';
import { TaskService } from '../../TaskService';

const taskService = new TaskService('localStorage');

// CRUD Actions (4 main actions)
export const createTask = (taskData) => async (dispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const newTask = taskService.addTask(
      taskData.title,
      taskData.category,
      taskData.dueDate,
      taskData.workLocation
    );
    dispatch({ type: types.CREATE_TASK, payload: newTask });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const readTasks = () => async (dispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const tasks = taskService.getAllTasks();
    dispatch({ type: types.READ_TASKS, payload: tasks });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const updateTask = (id, updates) => async (dispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const updated = taskService.updateTask(id, updates);
    dispatch({ type: types.UPDATE_TASK, payload: updated });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const deleteTask = (id) => async (dispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    taskService.removeTask(id);
    dispatch({ type: types.DELETE_TASK, payload: id });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

// UI Actions (not part of CRUD)
export const setActiveTab = (tab) => ({
  type: types.SET_ACTIVE_TAB,
  payload: tab,
});

export const switchRepository = (type) => async (dispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const tasks = taskService.switchRepository(type);
    dispatch({ type: types.SWITCH_REPOSITORY, payload: { tasks, type } });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};