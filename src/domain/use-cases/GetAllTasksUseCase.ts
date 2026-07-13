import { TaskRepository } from '../repositories/TaskRepository';
import { Task } from '../entities/Task';

export class GetAllTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.getAllTasks();
  }

  async getByCategory(category: 'Work' | 'Personal'): Promise<Task[]> {
    return this.taskRepository.getTasksByCategory(category);
  }

  async getCompleted(): Promise<Task[]> {
    return this.taskRepository.getCompletedTasks();
  }

  async getPending(): Promise<Task[]> {
    const all = await this.taskRepository.getAllTasks();
    return all.filter(task => !task.completed);
  }
}