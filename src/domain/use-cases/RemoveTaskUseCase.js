export class RemoveTaskUseCase {
  /**
   * @param {TaskRepository} taskRepository - Must implement TaskRepository interface
   */
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  execute(id) {
    const task = this.taskRepository.getTask(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return this.taskRepository.removeTask(id);
  }
}