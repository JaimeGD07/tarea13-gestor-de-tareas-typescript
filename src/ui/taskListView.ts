import type { Task } from '../models/Task';
import { TaskStatus, Priority } from '../models/Task';

const priorityLabels: Record<Priority, string> = {
  [Priority.LOW]: 'Baja',
  [Priority.MEDIUM]: 'Media',
  [Priority.HIGH]: 'Alta',
};

function createTaskCard(task: Task): HTMLLIElement {
  const li = document.createElement('li');
  li.className = `task-card priority-${task.priority}`;
  li.dataset.taskId = task.id;

  if (task.status === TaskStatus.COMPLETED) {
    li.classList.add('completed');
  }

  li.innerHTML = `
    <div class="task-card-header">
      <input type="checkbox" class="task-toggle" ${task.status === TaskStatus.COMPLETED ? 'checked' : ''} />
      <h3 class="task-title">${escapeHtml(task.title)}</h3>
      <span class="task-priority-badge">${priorityLabels[task.priority]}</span>
    </div>
    ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
    <div class="task-card-footer">
      ${task.category ? `<span class="task-category">${escapeHtml(task.category)}</span>` : ''}
      <div class="task-actions">
        <button class="task-edit-btn" type="button">Editar</button>
        <button class="task-delete-btn" type="button">Eliminar</button>
      </div>
    </div>
  `;

  return li;
}

// Previene inyección de HTML si el usuario escribe < > & etc. en título/descripción
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function renderTaskList(tasks: Task[]): void {
  const listEl = document.querySelector<HTMLUListElement>('#task-list')!;
  const emptyStateEl = document.querySelector<HTMLParagraphElement>('#empty-state')!;

  listEl.innerHTML = '';

  if (tasks.length === 0) {
    emptyStateEl.hidden = false;
    return;
  }

  emptyStateEl.hidden = true;
  const fragment = document.createDocumentFragment();
  tasks.forEach((task) => fragment.appendChild(createTaskCard(task)));
  listEl.appendChild(fragment);
}
