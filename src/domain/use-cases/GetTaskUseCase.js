export class GetTaskUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  execute(id) {
    const task = this.taskRepository.getTask(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return task;
  }
}