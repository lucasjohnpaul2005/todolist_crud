import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TaskService } from '../../TaskService';

const taskService = new TaskService('localStorage');

// CRUD Thunks
export const createTask = createAsyncThunk('tasks/create', async (taskData) => {
  return taskService.addTask(taskData.title, taskData.category, taskData.dueDate, taskData.workLocation);
});

export const readTasks = createAsyncThunk('tasks/read', async () => {
  return taskService.getAllTasks();
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, updates }) => {
  return taskService.updateTask(id, updates);
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id) => {
  taskService.removeTask(id);
  return id;
});

export const switchRepository = createAsyncThunk('tasks/switchRepository', async (type) => {
  return taskService.switchRepository(type);
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    activeTab: 'personal',
    isLoading: false,
    error: null,
    repositoryType: 'localStorage',
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Read
      .addCase(readTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(readTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(readTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Update
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        state.error = null;
      })
      // Switch Repository
      .addCase(switchRepository.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.repositoryType = action.meta.arg;
        state.error = null;
      });
  },
});

export const { setActiveTab } = taskSlice.actions;
export default taskSlice.reducer;