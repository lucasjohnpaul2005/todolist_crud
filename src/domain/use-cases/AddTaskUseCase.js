import { Task } from '../entities/Task';

export class AddTaskUseCase {
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

    return this.taskRepository.addTask(newTask);
  }
}