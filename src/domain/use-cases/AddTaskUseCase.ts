import { TaskRepository } from '../repositories/TaskRepository';
import { Task, TaskEntity } from '../entities/Task';

export class AddTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(
    title: string,
    category: 'Work' | 'Personal',
    dueDate: string,
    workLocation?: 'Work from Home' | 'Work from Company'
  ): Promise<Task> {
    if (!title || !title.trim()) {
      throw new Error('Task title cannot be empty');
    }

    const newTask = new TaskEntity(
      Date.now(),
      title.trim(),
      category,
      dueDate || new Date().toISOString().split('T')[0],
      false,
      category === 'Work' ? workLocation : undefined
    );

    return this.taskRepository.addTask(newTask);
  }
}