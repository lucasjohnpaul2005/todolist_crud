import { TaskRepository } from '../repositories/TaskRepository';

export class ClearAllTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(): Promise<void> {
    await this.taskRepository.clearAll();
  }
}