import { AddTaskUseCase } from '../domain/use-cases/AddTaskUseCase';
import { RemoveTaskUseCase } from '../domain/use-cases/RemoveTaskUseCase';
import { UpdateTaskUseCase } from '../domain/use-cases/UpdateTaskUseCase';
import { GetAllTasksUseCase } from '../domain/use-cases/GetAllTasksUseCase';
import { GetTaskUseCase } from '../domain/use-cases/GetTaskUseCase';
import { ClearAllTasksUseCase } from '../domain/use-cases/ClearAllTasksUseCase';
import { LocalStorageTaskRepository } from '../data/repositories/LocalStorageTaskRepository';
import { InMemoryTaskRepository } from '../data/repositories/InMemoryTaskRepository';

export class TaskService {
  constructor(repositoryType = 'localStorage') {
    this.repositoryType = repositoryType;
    this.setRepository(repositoryType);
  }

  setRepository(type) {
    this.repositoryType = type;
    if (type === 'inMemory') {
      this.repository = new InMemoryTaskRepository();
    } else {
      this.repository = new LocalStorageTaskRepository();
    }
  }

  addTask(title, category, dueDate, workLocation) {
    const useCase = new AddTaskUseCase(this.repository);
    const task = useCase.execute(title, category, dueDate, workLocation);
    return task;
  }

  removeTask(id) {
    const useCase = new RemoveTaskUseCase(this.repository);
    return useCase.execute(id);
  }

  updateTask(id, updates) {
    const useCase = new UpdateTaskUseCase(this.repository);
    return useCase.execute(id, updates);
  }

  getAllTasks() {
    const useCase = new GetAllTasksUseCase(this.repository);
    const tasks = useCase.execute();
    return tasks;
  }

  getTask(id) {
    const useCase = new GetTaskUseCase(this.repository);
    return useCase.execute(id);
  }

  getTasksByCategory(category) {
    const useCase = new GetAllTasksUseCase(this.repository);
    return useCase.getByCategory(category);
  }

  getCompletedTasks() {
    const useCase = new GetAllTasksUseCase(this.repository);
    return useCase.getCompleted();
  }

  getPendingTasks() {
    const useCase = new GetAllTasksUseCase(this.repository);
    return useCase.getPending();
  }

  clearAllTasks() {
    const useCase = new ClearAllTasksUseCase(this.repository);
    return useCase.execute();
  }

  switchRepository(type) {
    this.setRepository(type);
    return this.getAllTasks();
  }
}