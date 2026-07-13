import { TaskRepository } from '../repositories/TaskRepository';
import { Task } from '../entities/Task';

export class GetTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: number): Promise<Task | undefined> {
    const task = await this.taskRepository.getTask(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return task;
  }
}