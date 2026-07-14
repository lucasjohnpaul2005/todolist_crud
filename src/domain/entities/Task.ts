export interface Task {
  id: number;
  title: string;
  category: 'Work' | 'Personal';
  dueDate: string;
  completed: boolean;
  workLocation?: 'Work from Home' | 'Work from Company' | null;
}

export class TaskEntity implements Task {
  constructor(
    public id: number,
    public title: string,
    public category: 'Work' | 'Personal',
    public dueDate: string,
    public completed: boolean = false,
    public workLocation?: 'Work from Home' | 'Work from Company' | null
  ) {}

  toggleComplete(): void {
    this.completed = !this.completed;
  }

  toJSON(): Omit<Task, 'toJSON'> {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      dueDate: this.dueDate,
      completed: this.completed,
      workLocation: this.workLocation,
    };
  }

  static fromJSON(data: Task): TaskEntity {
    return new TaskEntity(
      data.id,
      data.title,
      data.category,
      data.dueDate,
      data.completed,
      data.workLocation
    );
  }
}