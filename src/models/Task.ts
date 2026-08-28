export const Priority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

export const TaskStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Datos que el usuario provee al crear una tarea (sin campos generados por el sistema)
export type CreateTaskInput = Pick<Task, 'title' | 'description' | 'category' | 'priority'>;

// Campos editables de una tarea existente (todos opcionales, edición parcial)
export type UpdateTaskInput = Partial<Pick<Task, 'title' | 'description' | 'category' | 'priority'>>;
