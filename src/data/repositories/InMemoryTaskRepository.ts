import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { Task } from '../../domain/entities/Task';

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];

  async getAllTasks(): Promise<Task[]> {
    return [...this.tasks];
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.find(t => t.id === id);
  }

  async addTask(task: Task): Promise<Task> {
    this.tasks.push(task);
    return task;
  }

  async updateTask(id: number, updates: Partial<Omit<Task, 'id'>>): Promise<Task | undefined> {
    const task = await this.getTask(id);
    if (task) {
      Object.assign(task, updates);
      return task;
    }
    return undefined;
  }

  async removeTask(id: number): Promise<boolean> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }

  async clearAll(): Promise<void> {
    this.tasks = [];
  }

  async getTasksByCategory(category: 'Work' | 'Personal'): Promise<Task[]> {
    return this.tasks.filter(t => t.category === category && !t.completed);
  }

  async getCompletedTasks(): Promise<Task[]> {
    return this.tasks.filter(t => t.completed);
  }
}