import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TaskService } from '../../TaskService';
import { Task } from '../../../domain/entities/Task';

export type RepositoryType = 'localStorage' | 'inMemory' | 'firebase';

const taskService = new TaskService('localStorage');

// CRUD Thunks
export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData: {
    title: string;
    category: 'Work' | 'Personal';
    dueDate: string;
    workLocation?: 'Work from Home' | 'Work from Company';
  }) => {
    return taskService.addTask(taskData.title, taskData.category, taskData.dueDate, taskData.workLocation);
  }
);

export const readTasks = createAsyncThunk('tasks/read', async () => {
  return taskService.getAllTasks();
});

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, updates }: { id: number; updates: Partial<Omit<Task, 'id'>> }) => {
    return taskService.updateTask(id, updates);
  }
);

export const deleteTask = createAsyncThunk('tasks/delete', async (id: number) => {
  await taskService.removeTask(id);
  return id;
});

//  Updated to accept all three repository types
export const switchRepository = createAsyncThunk(
  'tasks/switchRepository',
  async (type: 'localStorage' | 'inMemory' | 'firebase') => {
    return taskService.switchRepository(type);
  }
);

interface TaskState {
  tasks: Task[];
  activeTab: 'work' | 'personal' | 'completed' | 'settings';
  isLoading: boolean;
  error: string | null;
  repositoryType: RepositoryType;
}

const initialState: TaskState = {
  tasks: [],
  activeTab: 'personal',
  isLoading: false,
  error: null,
  repositoryType: 'localStorage',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'work' | 'personal' | 'completed' | 'settings'>) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create task';
      })
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
        state.error = action.error.message || 'Failed to read tasks';
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload?.id);
        if (index !== -1 && action.payload) {
          state.tasks[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update task';
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        state.error = null;
      })
      //  Updated to handle all three repository types
      .addCase(switchRepository.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.repositoryType = action.meta.arg;
        state.error = null;
      });
  },
});

export const { setActiveTab } = taskSlice.actions;
export default taskSlice.reducer;