import { TaskRepository } from '../../domain/repositories/TaskRepository';

export class InMemoryTaskRepository extends TaskRepository {
  constructor() {
    super();
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
    return task;
  }

  removeTask(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }

  updateTask(id, updates) {
    const task = this.getTask(id);
    if (task) {
      Object.assign(task, updates);
      return task;
    }
    return null;
  }

  getAllTasks() {
    return [...this.tasks];
  }

  getTask(id) {
    return this.tasks.find(t => t.id === id);
  }

  getTasksByCategory(category) {
    return this.tasks.filter(t => t.category === category && !t.completed);
  }

  getCompletedTasks() {
    return this.tasks.filter(t => t.completed);
  }

  clearAll() {
    this.tasks = [];
  }
}