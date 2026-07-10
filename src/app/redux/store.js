import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './task/task.reducers';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});