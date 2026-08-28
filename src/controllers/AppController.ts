import type { Task, CreateTaskInput } from '../models/Task';
import { Priority } from '../models/Task';
import { TaskRepository } from '../repositories/TaskRepository';
import { TaskService } from '../services/TaskService';
import { applyFilters, defaultFilterCriteria } from '../filters/taskFilters';
import type { FilterCriteria, StatusFilter, PriorityFilter } from '../filters/taskFilters';
import { renderTaskList } from '../ui/taskListView';

export class AppController {
  private service: TaskService;
  private criteria: FilterCriteria;
  private editingTaskId: string | null;

  // Referencias al DOM, resueltas una sola vez
  private form: HTMLFormElement;
  private idInput: HTMLInputElement;
  private titleInput: HTMLInputElement;
  private descriptionInput: HTMLTextAreaElement;
  private categoryInput: HTMLInputElement;
  private priorityInput: HTMLSelectElement;
  private submitBtn: HTMLButtonElement;
  private cancelBtn: HTMLButtonElement;
  private searchInput: HTMLInputElement;
  private statusFilter: HTMLSelectElement;
  private priorityFilter: HTMLSelectElement;
  private listEl: HTMLUListElement;

  constructor() {
    this.service = new TaskService(new TaskRepository());
    this.criteria = defaultFilterCriteria();
    this.editingTaskId = null;

    this.form = document.querySelector('#task-form')!;
    this.idInput = document.querySelector('#task-id')!;
    this.titleInput = document.querySelector('#task-title')!;
    this.descriptionInput = document.querySelector('#task-description')!;
    this.categoryInput = document.querySelector('#task-category')!;
    this.priorityInput = document.querySelector('#task-priority')!;
    this.submitBtn = document.querySelector('#form-submit-btn')!;
    this.cancelBtn = document.querySelector('#form-cancel-btn')!;
    this.searchInput = document.querySelector('#search-input')!;
    this.statusFilter = document.querySelector('#status-filter')!;
    this.priorityFilter = document.querySelector('#priority-filter')!;
    this.listEl = document.querySelector('#task-list')!;
  }

  init(): void {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.cancelBtn.addEventListener('click', () => this.exitEditMode());
    this.searchInput.addEventListener('input', () => this.handleFilterChange());
    this.statusFilter.addEventListener('change', () => this.handleFilterChange());
    this.priorityFilter.addEventListener('change', () => this.handleFilterChange());

    // Delegación de eventos: un solo listener para toda la lista,
    // en vez de uno por cada tarjeta de tarea.
    this.listEl.addEventListener('click', (e) => this.handleListClick(e));
    this.listEl.addEventListener('change', (e) => this.handleListChange(e));

    this.refresh();
  }

  private refresh(): void {
    const allTasks = this.service.getAllTasks();
    const filtered = applyFilters(allTasks, this.criteria);
    renderTaskList(filtered);
  }

  private handleSubmit(e: SubmitEvent): void {
    e.preventDefault();

    const input: CreateTaskInput = {
      title: this.titleInput.value,
      description: this.descriptionInput.value,
      category: this.categoryInput.value,
      priority: this.priorityInput.value as Priority,
    };

    try {
      if (this.editingTaskId) {
        this.service.editTask(this.editingTaskId, input);
      } else {
        this.service.createTask(input);
      }
      this.exitEditMode();
      this.refresh();
    } catch (error) {
      this.showFormError(error);
    }
  }

  private handleListClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const card = target.closest<HTMLLIElement>('[data-task-id]');
    if (!card) return;

    const taskId = card.dataset.taskId!;

    if (target.matches('.task-delete-btn')) {
      this.handleDelete(taskId);
    } else if (target.matches('.task-edit-btn')) {
      this.enterEditMode(taskId);
    }
  }

  private handleListChange(e: Event): void {
    const target = e.target as HTMLElement;
    const card = target.closest<HTMLLIElement>('[data-task-id]');
    if (!card) return;

    if (target.matches('.task-toggle')) {
      this.service.toggleTaskStatus(card.dataset.taskId!);
      this.refresh();
    }
  }

  private handleDelete(taskId: string): void {
    const confirmed = window.confirm('¿Seguro que deseas eliminar esta tarea? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    this.service.deleteTask(taskId);
    if (this.editingTaskId === taskId) {
      this.exitEditMode();
    }
    this.refresh();
  }

  private enterEditMode(taskId: string): void {
    const task = this.service.getAllTasks().find((t: Task) => t.id === taskId);
    if (!task) return;

    this.editingTaskId = taskId;
    this.idInput.value = task.id;
    this.titleInput.value = task.title;
    this.descriptionInput.value = task.description;
    this.categoryInput.value = task.category;
    this.priorityInput.value = task.priority;

    this.submitBtn.textContent = 'Guardar cambios';
    this.cancelBtn.hidden = false;
    this.titleInput.focus();
  }

  private exitEditMode(): void {
    this.editingTaskId = null;
    this.form.reset();
    this.idInput.value = '';
    this.submitBtn.textContent = 'Agregar tarea';
    this.cancelBtn.hidden = true;
  }

  private handleFilterChange(): void {
    this.criteria = {
      status: this.statusFilter.value as StatusFilter,
      priority: this.priorityFilter.value as PriorityFilter,
      searchTerm: this.searchInput.value,
    };
    this.refresh();
  }

  private showFormError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
    window.alert(message);
  }
}
