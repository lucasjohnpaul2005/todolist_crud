export class UpdateTaskUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  execute(id, updates) {
    const task = this.taskRepository.getTask(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    const cleanUpdates = {};
    
    if (updates.title !== undefined) {
      if (!updates.title.trim()) {
        throw new Error('Task title cannot be empty');
      }
      cleanUpdates.title = updates.title.trim();
    }
    
    if (updates.dueDate !== undefined) {
      if (!updates.dueDate) {
        throw new Error('Due date cannot be empty');
      }
      cleanUpdates.dueDate = updates.dueDate;
    }
    
    if (updates.workLocation !== undefined) {
      if (task.category !== 'Work') {
        throw new Error('Work location can only be set for Work tasks');
      }
      cleanUpdates.workLocation = updates.workLocation;
    }
    
    if (updates.completed !== undefined) {
      cleanUpdates.completed = updates.completed;
    }

    return this.taskRepository.updateTask(id, cleanUpdates);
  }
}