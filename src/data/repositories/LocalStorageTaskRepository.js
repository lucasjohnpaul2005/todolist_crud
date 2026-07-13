import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { Task } from '../../domain/entities/Task';

/**
 * Concrete implementation of TaskRepository
 * Handles all data fetching and storage
 */
export class LocalStorageTaskRepository extends TaskRepository {
  constructor() {
    super();
    this.STORAGE_KEY = 'todos';
  }

  // Private methods for data persistence
  loadFromStorage() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  saveToStorage(data) {
    const plainData = data.map(item => {
      if (item.toJSON) {
        return item.toJSON();
      }
      return item;
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(plainData));
  }

  // Public methods - these implement the interface
  getAllTasks() {
    const data = this.loadFromStorage();
    return data.map(item => Task.fromJSON(item));
  }

  getTask(id) {
    return this.getAllTasks().find(t => t.id === id);
  }

  addTask(task) {
    const tasks = this.getAllTasks();
    tasks.push(task);
    this.saveToStorage(tasks);
    return task;
  }

  removeTask(id) {
    const tasks = this.getAllTasks().filter(t => t.id !== id);
    this.saveToStorage(tasks);
    return true;
  }

  updateTask(id, updates) {
    const tasks = this.getAllTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      const updatedTask = { ...tasks[index], ...updates };
      tasks[index] = updatedTask;
      this.saveToStorage(tasks);
      return updatedTask;
    }
    return null;
  }

  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}