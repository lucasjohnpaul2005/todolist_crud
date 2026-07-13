import { Task } from '../entities/Task';

export class AddTaskUseCase {
  /**
   * @param {TaskRepository} taskRepository - Must implement TaskRepository interface
   */
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  execute(title, category, dueDate, workLocation = null) {
    if (!title || !title.trim()) {
      throw new Error('Task title cannot be empty');
    }

    const newTask = new Task(
      Date.now(),
      title.trim(),
      category || 'Personal',
      dueDate || new Date().toISOString().split('T')[0],
      false,
      category === 'Work' ? workLocation : null
    );

    // Use the repository interface method
    return this.taskRepository.addTask(newTask);
  }
}