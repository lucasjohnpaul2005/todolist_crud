export class ClearAllTasksUseCase {
  /**
   * @param {TaskRepository} taskRepository - Must implement TaskRepository interface
   */
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  execute() {
    return this.taskRepository.clearAll();
  }
}