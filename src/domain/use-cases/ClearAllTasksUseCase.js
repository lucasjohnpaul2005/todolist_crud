export class ClearAllTasksUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  execute() {
    this.taskRepository.clearAll();
  }
}