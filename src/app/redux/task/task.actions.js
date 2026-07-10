import * as types from './task.types';
import { TaskService } from '../../TaskService';

const taskService = new TaskService('localStorage');

export const loadTasks = () => async (dispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const tasks = taskService.getAllTasks();
    dispatch({ type: types.LOAD_TASKS, payload: tasks });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const addTask = (taskData) => async (dispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const newTask = taskService.addTask(
      taskData.title,
      taskData.category,
      taskData.dueDate,
      taskData.workLocation
    );
    dispatch({ type: types.ADD_TASK, payload: newTask });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const toggleComplete = (id) => async (dispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const task = taskService.getTask(id);
    if (task) {
      task.completed = !task.completed;
      const updated = taskService.updateTask(id, { completed: task.completed });
      dispatch({ type: types.TOGGLE_COMPLETE, payload: updated });
    }
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

export const editTask = (id, updates) => async (dispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    const updated = taskService.updateTask(id, updates);
    dispatch({ type: types.EDIT_TASK, payload: updated });
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

export const clearAllTasks = () => async (dispatch) => {
  dispatch({ type: types.SET_LOADING, payload: true });
  try {
    taskService.clearAllTasks();
    dispatch({ type: types.CLEAR_ALL });
    dispatch({ type: types.SET_ERROR, payload: null });
  } catch (error) {
    dispatch({ type: types.SET_ERROR, payload: error.message });
  }
  dispatch({ type: types.SET_LOADING, payload: false });
};

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

export const setActiveTab = (tab) => ({
  type: types.SET_ACTIVE_TAB,
  payload: tab,
});