import type { Task, Priority, TaskStatus } from '../models/Task';

export type StatusFilter = 'all' | TaskStatus;
export type PriorityFilter = 'all' | Priority;

export interface FilterCriteria {
  status: StatusFilter;
  priority: PriorityFilter;
  searchTerm: string;
}

export function filterByStatus(tasks: Task[], status: StatusFilter): Task[] {
  if (status === 'all') return tasks;
  return tasks.filter((task) => task.status === status);
}

export function filterByPriority(tasks: Task[], priority: PriorityFilter): Task[] {
  if (priority === 'all') return tasks;
  return tasks.filter((task) => task.priority === priority);
}

export function filterBySearchTerm(tasks: Task[], term: string): Task[] {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return tasks;
  return tasks.filter((task) => task.title.toLowerCase().includes(normalized));
}

// Combina los tres filtros en un solo pipeline
export function applyFilters(tasks: Task[], criteria: FilterCriteria): Task[] {
  let result = tasks;
  result = filterByStatus(result, criteria.status);
  result = filterByPriority(result, criteria.priority);
  result = filterBySearchTerm(result, criteria.searchTerm);
  return result;
}

export function defaultFilterCriteria(): FilterCriteria {
  return {
    status: 'all',
    priority: 'all',
    searchTerm: '',
  };
}
