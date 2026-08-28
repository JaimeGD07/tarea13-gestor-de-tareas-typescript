import type { Task } from '../models/Task';

const STORAGE_KEY = 'task-manager:tasks';

export class TaskRepository {
  private readCache(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Task[]) : [];
    } catch {
      console.error('TaskRepository: datos corruptos en localStorage, reiniciando.');
      return [];
    }
  }

  private writeCache(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  getAll(): Task[] {
    return this.readCache();
  }

  getById(id: string): Task | undefined {
    return this.readCache().find((task) => task.id === id);
  }

  save(task: Task): void {
    const tasks = this.readCache();
    tasks.push(task);
    this.writeCache(tasks);
  }

  update(id: string, updatedTask: Task): void {
    const tasks = this.readCache();
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      throw new Error(`TaskRepository: no existe una tarea con id "${id}".`);
    }
    tasks[index] = updatedTask;
    this.writeCache(tasks);
  }

  delete(id: string): void {
    const tasks = this.readCache().filter((task) => task.id !== id);
    this.writeCache(tasks);
  }
}
