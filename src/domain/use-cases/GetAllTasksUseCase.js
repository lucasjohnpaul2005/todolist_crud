export class GetAllTasksUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  execute() {
    return this.taskRepository.getAllTasks();
  }

  getByCategory(category) {
    return this.taskRepository.getTasksByCategory(category);
  }

  getCompleted() {
    return this.taskRepository.getCompletedTasks();
  }

  getPending() {
    return this.taskRepository.getAllTasks().filter(task => !task.completed);
  }
}