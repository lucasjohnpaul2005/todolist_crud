export class ToggleCompleteUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  execute(id) {
    const task = this.taskRepository.getTask(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    task.completed = !task.completed;
    return this.taskRepository.updateTask(id, { completed: task.completed });
  }
}