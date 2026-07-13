import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { Task, TaskEntity } from '../../domain/entities/Task';

export class LocalStorageTaskRepository implements TaskRepository {
  private readonly STORAGE_KEY = 'todos';

  private loadFromStorage(): any[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  private saveToStorage(data: any[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  async getAllTasks(): Promise<Task[]> {
    const data = this.loadFromStorage();
    return data.map((item: any) => TaskEntity.fromJSON(item));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const tasks = await this.getAllTasks();
    return tasks.find(t => t.id === id);
  }

  async addTask(task: Task): Promise<Task> {
    const tasks = await this.getAllTasks();
    const newTask = task instanceof TaskEntity ? task : TaskEntity.fromJSON(task);
    tasks.push(newTask);
    this.saveToStorage(tasks.map(t => t instanceof TaskEntity ? t.toJSON() : t));
    return newTask;
  }

  async updateTask(id: number, updates: Partial<Omit<Task, 'id'>>): Promise<Task | undefined> {
    const tasks = await this.getAllTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      const updatedTask = { ...tasks[index], ...updates };
      tasks[index] = updatedTask;
      this.saveToStorage(tasks);
      return updatedTask;
    }
    return undefined;
  }

  async removeTask(id: number): Promise<boolean> {
    const tasks = await this.getAllTasks();
    const filtered = tasks.filter(t => t.id !== id);
    if (filtered.length === tasks.length) {
      return false;
    }
    this.saveToStorage(filtered);
    return true;
  }

  async clearAll(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  async getTasksByCategory(category: 'Work' | 'Personal'): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter(t => t.category === category && !t.completed);
  }

  async getCompletedTasks(): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter(t => t.completed);
  }
}