import { Task } from '../entities/Task';

export interface TaskRepository {
  getAllTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  addTask(task: Task): Promise<Task>;
  updateTask(id: number, updates: Partial<Omit<Task, 'id'>>): Promise<Task | undefined>;
  removeTask(id: number): Promise<boolean>;
  clearAll(): Promise<void>;
  getTasksByCategory(category: 'Work' | 'Personal'): Promise<Task[]>;
  getCompletedTasks(): Promise<Task[]>;
}