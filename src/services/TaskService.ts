import type { Task, CreateTaskInput, UpdateTaskInput } from '../models/Task';
import { TaskStatus } from '../models/Task';
import { TaskRepository } from '../repositories/TaskRepository';

export class TaskService {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  getAllTasks(): Task[] {
    return this.repository.getAll();
  }

  createTask(input: CreateTaskInput): Task {
    if (!input.title.trim()) {
      throw new Error('El título de la tarea es obligatorio.');
    }

    const now = new Date().toISOString();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category.trim(),
      priority: input.priority,
      status: TaskStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };

    this.repository.save(newTask);
    return newTask;
  }

  editTask(id: string, changes: UpdateTaskInput): Task {
    const existing = this.repository.getById(id);
    if (!existing) {
      throw new Error(`No se encontró la tarea con id "${id}".`);
    }

    if (changes.title !== undefined && !changes.title.trim()) {
      throw new Error('El título de la tarea no puede quedar vacío.');
    }

    const updated: Task = {
      ...existing,
      ...changes,
      updatedAt: new Date().toISOString(),
    };

    this.repository.update(id, updated);
    return updated;
  }

  deleteTask(id: string): void {
    const existing = this.repository.getById(id);
    if (!existing) {
      throw new Error(`No se encontró la tarea con id "${id}".`);
    }
    this.repository.delete(id);
  }

  toggleTaskStatus(id: string): Task {
    const existing = this.repository.getById(id);
    if (!existing) {
      throw new Error(`No se encontró la tarea con id "${id}".`);
    }

    const updated: Task = {
      ...existing,
      status: existing.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED,
      updatedAt: new Date().toISOString(),
    };

    this.repository.update(id, updated);
    return updated;
  }
}
