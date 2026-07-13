import { Task } from '../domain/entities/Task';
import { TaskRepository } from '../domain/repositories/TaskRepository';
import { AddTaskUseCase } from '../domain/use-cases/AddTaskUseCase';
import { RemoveTaskUseCase } from '../domain/use-cases/RemoveTaskUseCase';
import { UpdateTaskUseCase } from '../domain/use-cases/UpdateTaskUseCase';
import { GetAllTasksUseCase } from '../domain/use-cases/GetAllTasksUseCase';
import { GetTaskUseCase } from '../domain/use-cases/GetTaskUseCase';
import { ClearAllTasksUseCase } from '../domain/use-cases/ClearAllTasksUseCase';
import { LocalStorageTaskRepository } from '../data/repositories/LocalStorageTaskRepository';
import { InMemoryTaskRepository } from '../data/repositories/InMemoryTaskRepository';

export type RepositoryType = 'localStorage' | 'inMemory';

export class TaskService {
  private repository!: TaskRepository;  // ✅ Should work if import is correct
  private repositoryType: RepositoryType;

  constructor(repositoryType: RepositoryType = 'localStorage') {
    this.repositoryType = repositoryType;
    this.setRepository(repositoryType);
  }

  setRepository(type: RepositoryType): void {
    this.repositoryType = type;
    if (type === 'inMemory') {
      this.repository = new InMemoryTaskRepository();
    } else {
      this.repository = new LocalStorageTaskRepository();
    }
  }

  async addTask(
    title: string,
    category: 'Work' | 'Personal',
    dueDate: string,
    workLocation?: 'Work from Home' | 'Work from Company'
  ): Promise<Task> {
    const useCase = new AddTaskUseCase(this.repository);
    return useCase.execute(title, category, dueDate, workLocation);
  }

  async removeTask(id: number): Promise<boolean> {
    const useCase = new RemoveTaskUseCase(this.repository);
    return useCase.execute(id);
  }

  async updateTask(
    id: number,
    updates: Partial<Omit<Task, 'id'>>
  ): Promise<Task | undefined> {
    const useCase = new UpdateTaskUseCase(this.repository);
    return useCase.execute(id, updates);
  }

  async getAllTasks(): Promise<Task[]> {
    const useCase = new GetAllTasksUseCase(this.repository);
    return useCase.execute();
  }

  async getTask(id: number): Promise<Task | undefined> {
    const useCase = new GetTaskUseCase(this.repository);
    return useCase.execute(id);
  }

  async clearAllTasks(): Promise<void> {
    const useCase = new ClearAllTasksUseCase(this.repository);
    return useCase.execute();
  }

  async switchRepository(type: RepositoryType): Promise<Task[]> {
    this.setRepository(type);
    return this.getAllTasks();
  }
}