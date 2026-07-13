import { TaskRepository } from '../repositories/TaskRepository';

export class RemoveTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: number): Promise<boolean> {
    const task = await this.taskRepository.getTask(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return this.taskRepository.removeTask(id);
  }
}