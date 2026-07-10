export class Task {
  constructor(id, title, category, dueDate, completed = false, workLocation = null) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.dueDate = dueDate;
    this.completed = completed;
    this.workLocation = workLocation;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      dueDate: this.dueDate,
      completed: this.completed,
      workLocation: this.workLocation,
    };
  }

  static fromJSON(data) {
    return new Task(
      data.id,
      data.title,
      data.category,
      data.dueDate,
      data.completed || false,
      data.workLocation || null
    );
  }
}