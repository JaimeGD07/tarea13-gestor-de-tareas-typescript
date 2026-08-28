# Sistema de Gestión de Tareas

Aplicación de gestión de tareas construida con **TypeScript vanilla** y **Vite**, sin frameworks de UI. Permite crear, editar, filtrar y persistir tareas localmente en el navegador.

Proyecto desarrollado para **Kodigo — Desarrollo Frontend Moderno con TypeScript**.

## Características implementadas

- Crear tareas con título, descripción, categoría y prioridad.
- Editar tareas existentes.
- Eliminar tareas con confirmación previa.
- Marcar tareas como completadas o incompletas.
- Filtrar por estado (todas / pendientes / completadas).
- Filtrar por nivel de prioridad.
- Buscar tareas por título en tiempo real.
- Persistencia automática en `localStorage` (los datos sobreviven al cerrar el navegador).
- Diseño responsive (móvil, tablet, desktop) con estética tipo "fichero de índice".
- Arquitectura en capas: modelos, repositorio, servicios, filtros, UI y controlador.

## Arquitectura

src/
├── models/ # Interfaces y tipos (Task, Priority, TaskStatus)
├── repositories/ # Acceso a localStorage (TaskRepository)
├── services/ # Lógica de negocio (TaskService)
├── filters/ # Funciones puras de filtrado y búsqueda
├── ui/ # Renderizado del DOM (taskListView)
├── controllers/ # Composition root: conecta todo (AppController)
├── main.ts
└── style.css

Cada capa depende solo de la capa inmediatamente inferior: el controlador orquesta servicio + filtros + UI, el servicio contiene las reglas de negocio, y el repositorio es el único que conoce `localStorage`.

## Instalación y ejecución

Requiere [pnpm](https://pnpm.io/installation).

```bash
# Clonar el repositorio
git clone https://github.com/JaimeGD07/tarea13-gestor-de-tareas-typescript.git
cd task-manager-ts

# Instalar dependencias
pnpm install

# Levantar el servidor de desarrollo
pnpm dev
```

Abre `http://localhost:5173` en el navegador.

### Otros comandos

```bash
pnpm build       # Compila para producción
pnpm exec tsc --noEmit   # Verifica tipos sin generar archivos
```

## Tecnologías

- TypeScript
- Vite
- HTML5 + CSS3 (sin frameworks de UI)
- localStorage (persistencia)