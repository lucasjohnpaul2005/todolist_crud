import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { Task } from '../../domain/entities/Task';

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];
  private nextId: number = 1;

  async getAllTasks(): Promise<Task[]> {
    console.log(' InMemory: getAllTasks() ->', this.tasks.length, 'tasks');
    return [...this.tasks];
  }

  async getTask(id: number): Promise<Task | undefined> {
    console.log(' InMemory: getTask(', id, ') - Available IDs:', this.tasks.map(t => t.id));
    const found = this.tasks.find(t => t.id === id);
    console.log(' InMemory: getTask(', id, ') -> found:', found ? 'YES' : 'NO');
    return found;
  }

  async addTask(task: any): Promise<Task> {
    const newTask: Task = {
      id: this.nextId++,
      title: task.title || 'Untitled',
      category: task.category || 'Personal',
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
      completed: false,
      workLocation: task.workLocation || null,
    };
    console.log(' InMemory: addTask() -> assigned ID:', newTask.id);
    this.tasks.push(newTask);
    console.log(' InMemory: addTask() -> total tasks:', this.tasks.length);
    console.log(' InMemory: addTask() -> all IDs:', this.tasks.map(t => t.id));
    return newTask;
  }

  async updateTask(id: number, updates: any): Promise<Task | undefined> {
    console.log(' InMemory: updateTask(', id, ')');
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      Object.assign(task, updates);
      console.log(' InMemory: updateTask() -> updated:', task);
      return task;
    }
    console.log(' InMemory: updateTask() -> NOT FOUND!');
    return undefined;
  }

  async removeTask(id: number): Promise<boolean> {
    console.log(' InMemory: removeTask(', id, ')');
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      console.log(' InMemory: removeTask() -> removed, remaining:', this.tasks.length);
      return true;
    }
    console.log(' InMemory: removeTask() -> NOT FOUND!');
    return false;
  }

  async clearAll(): Promise<void> {
    this.tasks = [];
    this.nextId = 1;
  }

  async getTasksByCategory(category: 'Work' | 'Personal'): Promise<Task[]> {
    return this.tasks.filter(t => t.category === category && !t.completed);
  }

  async getCompletedTasks(): Promise<Task[]> {
    return this.tasks.filter(t => t.completed);
  }
}