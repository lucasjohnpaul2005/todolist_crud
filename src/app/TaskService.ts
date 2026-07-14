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
import { FirebaseTaskRepository } from '../data/repositories/FirebaseTaskRepository';

export type RepositoryType = 'localStorage' | 'inMemory' | 'firebase';

export class TaskService {
  private repository: TaskRepository;
  private repositoryType: RepositoryType;
  private userId: string | null = null;

  constructor(repositoryType: RepositoryType = 'localStorage', userId?: string) {
    this.repositoryType = repositoryType;
    if (userId) {
      this.userId = userId;
    }
    this.repository = this.createRepository(repositoryType);
    console.log(' TaskService created with repository:', repositoryType);
  }

  private createRepository(type: RepositoryType): TaskRepository {
    console.log(' Creating repository:', type);
    
    if (type === 'inMemory') {
      console.log(' Creating InMemory repository (temporary)');
      return new InMemoryTaskRepository();
    } else if (type === 'firebase') {
      if (!this.userId) {
        console.warn(' No user ID for Firebase repository, falling back to LocalStorage');
        return new LocalStorageTaskRepository();
      }
      console.log(' Creating Firebase repository for user:', this.userId);
      return new FirebaseTaskRepository(this.userId);
    } else {
      console.log(' Creating LocalStorage repository (persistent)');
      return new LocalStorageTaskRepository();
    }
  }

  setUserId(userId: string): void {
    console.log(' Setting user ID:', userId);
    this.userId = userId;
    this.repository = this.createRepository(this.repositoryType);
  }

  getUserId(): string | null {
    return this.userId;
  }

  setRepository(type: RepositoryType): void {
    console.log(' Setting repository type:', type);
    this.repositoryType = type;
    this.repository = this.createRepository(type);
  }

  async addTask(
    title: string,
    category: 'Work' | 'Personal',
    dueDate: string,
    workLocation?: 'Work from Home' | 'Work from Company'
  ): Promise<Task> {
    console.log(' Adding task to:', this.repositoryType, 'Title:', title);
    const useCase = new AddTaskUseCase(this.repository);
    const result = await useCase.execute(title, category, dueDate, workLocation);
    console.log(' Task added to:', this.repositoryType);
    return result;
  }

  async removeTask(id: number): Promise<boolean> {
    console.log(' Removing task from:', this.repositoryType, 'ID:', id);
    const useCase = new RemoveTaskUseCase(this.repository);
    return useCase.execute(id);
  }

  async updateTask(
    id: number,
    updates: Partial<Omit<Task, 'id'>>
  ): Promise<Task | undefined> {
    console.log(' Updating task in:', this.repositoryType, 'ID:', id);
    const useCase = new UpdateTaskUseCase(this.repository);
    return useCase.execute(id, updates);
  }

  async getAllTasks(): Promise<Task[]> {
    console.log(' Getting all tasks from:', this.repositoryType);
    const useCase = new GetAllTasksUseCase(this.repository);
    const tasks = await useCase.execute();
    console.log(' Found', tasks.length, 'tasks in', this.repositoryType);
    return tasks;
  }

  async getTask(id: number): Promise<Task | undefined> {
    const useCase = new GetTaskUseCase(this.repository);
    return useCase.execute(id);
  }

  async clearAllTasks(): Promise<void> {
    console.log(' Clearing all tasks from:', this.repositoryType);
    const useCase = new ClearAllTasksUseCase(this.repository);
    return useCase.execute();
  }

  async switchRepository(type: RepositoryType): Promise<Task[]> {
    this.setRepository(type);
    return this.getAllTasks();
  }
}