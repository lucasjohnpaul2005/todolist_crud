/**
 * Task Repository Interface
 * This defines the contract that all concrete repositories must follow
 * This should be an interface/abstract class, NOT a concrete implementation
 */
export class TaskRepository {
  // These are abstract methods - they should be implemented by concrete repositories
  addTask(task) {
    throw new Error('Method not implemented');
  }

  removeTask(id) {
    throw new Error('Method not implemented');
  }

  updateTask(id, updates) {
    throw new Error('Method not implemented');
  }

  getAllTasks() {
    throw new Error('Method not implemented');
  }

  getTask(id) {
    throw new Error('Method not implemented');
  }

  clearAll() {
    throw new Error('Method not implemented');
  }
}