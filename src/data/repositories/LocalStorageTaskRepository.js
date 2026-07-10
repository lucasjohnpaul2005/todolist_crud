import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { Task } from '../../domain/entities/Task';

export class LocalStorageTaskRepository extends TaskRepository {
  constructor() {
    super();
    this.STORAGE_KEY = 'todos';
  }

  loadFromStorage() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  saveToStorage(data) {
    // Convert Task objects to plain objects before saving
    const plainData = data.map(item => {
      if (item.toJSON) {
        return item.toJSON();
      }
      return item; // Already plain object
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(plainData));
  }

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

  getTasksByCategory(category) {
    return this.getAllTasks().filter(t => t.category === category && !t.completed);
  }

  getCompletedTasks() {
    return this.getAllTasks().filter(t => t.completed);
  }

  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}