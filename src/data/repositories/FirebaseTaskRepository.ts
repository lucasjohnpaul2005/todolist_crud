import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Task } from '../../domain/entities/Task';
import { TaskRepository } from '../../domain/repositories/TaskRepository';

export class FirebaseTaskRepository implements TaskRepository {
  private userId: string;
  private tasksCollection: string;

  constructor(userId: string) {
    this.userId = userId;
    this.tasksCollection = 'tasks';
    console.log('🔥 FirebaseTaskRepository initialized for user:', userId);
  }

  private getCollection() {
    return collection(db, 'users', this.userId, this.tasksCollection);
  }

  private getDocument(id: string) {
    return doc(db, 'users', this.userId, this.tasksCollection, id);
  }

  // ✅ Generate numeric ID using timestamp
  private generateId(): number {
    return Date.now();
  }

  async getAllTasks(): Promise<Task[]> {
    console.log('📖 Firebase: Getting all tasks for user:', this.userId);
    try {
      const snapshot = await getDocs(this.getCollection());
      const tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: parseInt(doc.id), // ✅ Convert string ID to number
          title: data.title || '',
          category: data.category || 'Personal',
          dueDate: data.dueDate || new Date().toISOString().split('T')[0],
          completed: data.completed || false,
          workLocation: data.workLocation || null,
        } as Task;
      });
      console.log('📖 Firebase: Found', tasks.length, 'tasks');
      return tasks;
    } catch (error) {
      console.error('❌ Firebase: Error getting tasks:', error);
      return [];
    }
  }

  async getTask(id: number): Promise<Task | undefined> {
    console.log('🔍 Firebase: Getting task:', id);
    try {
      const docRef = this.getDocument(id.toString());
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        return {
          id: parseInt(snapshot.id),
          title: data.title || '',
          category: data.category || 'Personal',
          dueDate: data.dueDate || new Date().toISOString().split('T')[0],
          completed: data.completed || false,
          workLocation: data.workLocation || null,
        } as Task;
      }
      return undefined;
    } catch (error) {
      console.error('❌ Firebase: Error getting task:', error);
      return undefined;
    }
  }

  async addTask(task: Task): Promise<Task> {
    console.log('➕ Firebase: Adding task:', task.title);
    try {
      // ✅ Use numeric ID
      const id = this.generateId();
      const docRef = this.getDocument(id.toString());
      await setDoc(docRef, {
        title: task.title,
        category: task.category,
        dueDate: task.dueDate,
        completed: task.completed,
        workLocation: task.workLocation || null,
        createdAt: new Date().toISOString()
      });
      const newTask = { ...task, id: id };
      console.log('✅ Firebase: Task added with ID:', id);
      return newTask;
    } catch (error) {
      console.error('❌ Firebase: Error adding task:', error);
      throw error;
    }
  }

  async updateTask(id: number, updates: Partial<Omit<Task, 'id'>>): Promise<Task | undefined> {
    console.log('✏️ Firebase: Updating task:', id);
    try {
      const docRef = this.getDocument(id.toString());
      await updateDoc(docRef, updates);
      const updated = await this.getTask(id);
      console.log('✅ Firebase: Task updated:', id);
      return updated;
    } catch (error) {
      console.error('❌ Firebase: Error updating task:', error);
      return undefined;
    }
  }

  async removeTask(id: number): Promise<boolean> {
    console.log('🗑️ Firebase: Removing task:', id);
    try {
      const docRef = this.getDocument(id.toString());
      await deleteDoc(docRef);
      console.log('✅ Firebase: Task removed:', id);
      return true;
    } catch (error) {
      console.error('❌ Firebase: Error removing task:', error);
      return false;
    }
  }

  async clearAll(): Promise<void> {
    console.log('🗑️ Firebase: Clearing all tasks');
    try {
      const snapshot = await getDocs(this.getCollection());
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log('✅ Firebase: All tasks cleared');
    } catch (error) {
      console.error('❌ Firebase: Error clearing tasks:', error);
    }
  }

  async getTasksByCategory(category: 'Work' | 'Personal'): Promise<Task[]> {
    console.log('📖 Firebase: Getting tasks by category:', category);
    try {
      const q = query(this.getCollection(), where('category', '==', category));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: parseInt(doc.id),
          title: data.title || '',
          category: data.category || 'Personal',
          dueDate: data.dueDate || new Date().toISOString().split('T')[0],
          completed: data.completed || false,
          workLocation: data.workLocation || null,
        } as Task;
      });
    } catch (error) {
      console.error('❌ Firebase: Error getting tasks by category:', error);
      return [];
    }
  }

  async getCompletedTasks(): Promise<Task[]> {
    console.log('📖 Firebase: Getting completed tasks');
    try {
      const q = query(this.getCollection(), where('completed', '==', true));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: parseInt(doc.id),
          title: data.title || '',
          category: data.category || 'Personal',
          dueDate: data.dueDate || new Date().toISOString().split('T')[0],
          completed: data.completed || false,
          workLocation: data.workLocation || null,
        } as Task;
      });
    } catch (error) {
      console.error('❌ Firebase: Error getting completed tasks:', error);
      return [];
    }
  }
}