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

//  SINGLETON: Create repositories once and reuse them
class RepositorySingleton {
  private static instance: RepositorySingleton;
  private inMemoryRepo: InMemoryTaskRepository | null = null;
  private localStorageRepo: LocalStorageTaskRepository | null = null;

  private constructor() {}

  static getInstance(): RepositorySingleton {
    if (!RepositorySingleton.instance) {
      RepositorySingleton.instance = new RepositorySingleton();
    }
    return RepositorySingleton.instance;
  }

  getInMemoryRepo(): InMemoryTaskRepository {
    if (!this.inMemoryRepo) {
      this.inMemoryRepo = new InMemoryTaskRepository();
    }
    return this.inMemoryRepo;
  }

  getLocalStorageRepo(): LocalStorageTaskRepository {
    if (!this.localStorageRepo) {
      this.localStorageRepo = new LocalStorageTaskRepository();
    }
    return this.localStorageRepo;
  }
}

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
    const singleton = RepositorySingleton.getInstance();
    
    if (type === 'inMemory') {
      console.log(' Using singleton InMemory repository');
      return singleton.getInMemoryRepo();
    } else if (type === 'firebase') {
      if (!this.userId) {
        console.warn(' No user ID for Firebase, using LocalStorage');
        return singleton.getLocalStorageRepo();
      }
      console.log(' Creating Firebase repository for user:', this.userId);
      return new FirebaseTaskRepository(this.userId);
    } else {
      console.log(' Using singleton LocalStorage repository');
      return singleton.getLocalStorageRepo();
    }
  }

  setUserId(userId: string): void {
    this.userId = userId;
    this.repository = this.createRepository(this.repositoryType);
  }

  getUserId(): string | null {
    return this.userId;
  }

  setRepository(type: RepositoryType): void {
    this.repositoryType = type;
    this.repository = this.createRepository(type);
  }

  async addTask(
    title: string,
    category: 'Work' | 'Personal',
    dueDate: string,
    workLocation?: 'Work from Home' | 'Work from Company'
  ): Promise<Task> {
    console.log(' TaskService: addTask() - Title:', title);
    const useCase = new AddTaskUseCase(this.repository);
    const result = await useCase.execute(title, category, dueDate, workLocation);
    console.log(' TaskService: addTask() - Result ID:', result.id);
    return result;
  }

  async removeTask(id: number): Promise<boolean> {
    console.log(' TaskService: removeTask() - ID:', id);
    const useCase = new RemoveTaskUseCase(this.repository);
    return useCase.execute(id);
  }

  async updateTask(
    id: number,
    updates: Partial<Omit<Task, 'id'>>
  ): Promise<Task | undefined> {
    console.log(' TaskService: updateTask() - ID:', id);
    const useCase = new UpdateTaskUseCase(this.repository);
    return useCase.execute(id, updates);
  }

  async getAllTasks(): Promise<Task[]> {
    console.log(' TaskService: getAllTasks()');
    const useCase = new GetAllTasksUseCase(this.repository);
    const tasks = await useCase.execute();
    console.log(' TaskService: Found', tasks.length, 'tasks');
    return tasks;
  }

  async getTask(id: number): Promise<Task | undefined> {
    const useCase = new GetTaskUseCase(this.repository);
    return useCase.execute(id);
  }

  async clearAllTasks(): Promise<void> {
    console.log(' TaskService: clearAllTasks()');
    const useCase = new ClearAllTasksUseCase(this.repository);
    return useCase.execute();
  }

  async switchRepository(type: RepositoryType): Promise<Task[]> {
    this.setRepository(type);
    return this.getAllTasks();
  }
}