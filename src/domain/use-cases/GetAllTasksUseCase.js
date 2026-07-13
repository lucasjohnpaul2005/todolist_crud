export class GetAllTasksUseCase {
  /**
   * @param {TaskRepository} taskRepository - Must implement TaskRepository interface
   */
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  execute() {
    // Data fetching happens in the repository
    return this.taskRepository.getAllTasks();
  }

  getByCategory(category) {
    // Data fetching happens in the repository
    return this.taskRepository.getAllTasks().filter(t => t.category === category && !t.completed);
  }

  getCompleted() {
    return this.taskRepository.getAllTasks().filter(t => t.completed);
  }

  getPending() {
    return this.taskRepository.getAllTasks().filter(t => !t.completed);
  }
}