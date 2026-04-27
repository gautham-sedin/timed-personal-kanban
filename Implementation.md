Got it — one day, two intermediates, mixed split. That changes everything. Let me give you a tight, realistic plan.One day completely reshapes the strategy. You can't do everything in the spec — and you shouldn't try to. Here's the full plan: what to cut, how to split the day, and exactly what to build.

---

## First — reframe what "done" means for one day

A one-day build should feel complete, not rushed. That means making deliberate scope cuts upfront rather than running out of time mid-feature. Here's the scope decision:

| Feature | Keep | Cut | Reason |
|---|---|---|---|
| Onboarding (name) | Yes | — | 15 mins max |
| Project list + create | Yes | — | Core navigation |
| Default columns | Yes | — | Pre-seed, no effort |
| Add/delete task | Yes | — | Core board feature |
| Drag and drop | Yes | — | The centrepiece |
| Time tracking per column | Yes | — | The key feature |
| Completed task stats | Yes | — | Payoff of time tracking |
| Custom column add/edit | Keep add only | Skip edit | Edit = extra form complexity |
| Column delete with migration | Cut | Yes | Complex, low payoff today |
| Multi-project support | Yes | — | Simple list, no extra cost |
| localStorage persist | Yes | — | `effect()` + one service |

This leaves a working, impressive app — not a trimmed skeleton.

---

## The day broken into time blocks

A realistic one-day build assuming you start together in the morning:---

src/app/
│
├── models/
│   └── index.ts                  ← shared types (both agree on this first)
│
├── services/                     ← Person A owns this folder
│   ├── project.service.ts
│   ├── storage.service.ts
│   └── timer.service.ts
│
├── pipes/                        ← Person A
│   └── time-display.pipe.ts
│
├── pages/
│   ├── onboarding/               ← Person A
│   │   └── onboarding.component.ts
│   ├── project-list/             ← Person A
│   │   └── project-list.component.ts
│   └── kanban-board/             ← Person B
│       └── kanban-board.component.ts
│
├── components/
│   ├── column/                   ← Person B
│   │   └── column.component.ts
│   ├── task-card/                ← Person B
│   │   └── task-card.component.ts
│   ├── task-stats/               ← Person A
│   │   └── task-stats.component.ts
│   └── column-manager/           ← Person B
│       └── column-manager.component.ts
│
├── guards/
│   └── onboarding.guard.ts       ← Person A
│
├── app.routes.ts                 ← together
└── app.component.ts              ← together

## The 30-minute morning setup (do this together, don't skip it)

This is the highest-leverage 30 minutes of the day. If you rush past this, you'll spend the afternoon fixing mismatches instead of building features.

**Terminal — one person runs this, both watch:**

```bash
ng new timed-kanban --routing --style=css --standalone
cd timed-kanban
ng add @angular/cdk
```

**Then both of you write this file together before splitting:**

```typescript
// src/app/models/index.ts

export interface TimeEntry {
  totalMs: number;
  enteredAt: number | null;
}

export interface Task {
  id: string;
  title: string;
  columnId: string;
  createdAt: number;
  timeLog: Record<string, TimeEntry>;
}

export interface Column {
  id: string;
  name: string;
  order: number;
  locked: boolean;   // true = can't delete (todo, completed)
}

export interface Project {
  id: string;
  name: string;
  columns: Column[];
  tasks: Task[];
}

export const DEFAULT_COLUMNS: Omit<Column, 'id'>[] = [
  { name: 'Todo',           order: 0, locked: true  },
  { name: 'Working',        order: 1, locked: false },
  { name: 'Testing',        order: 2, locked: false },
  { name: 'Review',         order: 3, locked: false },
  { name: 'Actual Testing', order: 4, locked: false },
  { name: 'Completed',      order: 5, locked: true  },
];
```

**Then write the service shells together — empty methods, agreed signatures:**

```typescript
// src/app/services/project.service.ts  — shells only, no implementation yet

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private storage = inject(StorageService);

  projects = signal<Project[]>([]);

  createProject(name: string): Project { throw new Error('TODO') }
  getProject(id: string): Project | undefined { throw new Error('TODO') }
  addTask(projectId: string, columnId: string, title: string): void { throw new Error('TODO') }
  deleteTask(projectId: string, taskId: string): void { throw new Error('TODO') }
  moveTask(projectId: string, taskId: string, toColumnId: string): void { throw new Error('TODO') }
  addColumn(projectId: string, name: string): void { throw new Error('TODO') }
  deleteColumn(projectId: string, columnId: string): void { throw new Error('TODO') }
}
```

Once these shells exist, Person B can call `projectService.moveTask(...)` in their drop handler without waiting for Person A to finish. It'll throw at runtime but it won't break the TypeScript build.

---

## What each person actually builds

### Person A — the data backbone

Person A owns everything that doesn't render a UI column or task card. The work is mostly services and two pages.

```typescript
// storage.service.ts — wrap localStorage with signals effect auto-save
@Injectable({ providedIn: 'root' })
export class StorageService {
  save<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  load<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  }
}

// In ProjectService constructor — auto-save whenever signal changes
constructor() {
  const saved = this.storage.load<Project[]>('projects');
  if (saved) this.projects.set(saved);

  effect(() => {
    this.storage.save('projects', this.projects());
  });
}
```

```typescript
// timer.service.ts — this is the integration contract with Person B
@Injectable({ providedIn: 'root' })
export class TimerService {

  // Called by Person B's drop handler
  recordMove(task: Task, fromColumnId: string, toColumnId: string): Task {
    const now = Date.now();
    const updatedLog = { ...task.timeLog };

    // Close the old column entry
    if (updatedLog[fromColumnId]?.enteredAt) {
      updatedLog[fromColumnId] = {
        totalMs: updatedLog[fromColumnId].totalMs + (now - updatedLog[fromColumnId].enteredAt!),
        enteredAt: null
      };
    }

    // Open the new column entry
    updatedLog[toColumnId] = {
      totalMs: updatedLog[toColumnId]?.totalMs ?? 0,
      enteredAt: now
    };

    return { ...task, columnId: toColumnId, timeLog: updatedLog };
  }

  formatMs(ms: number): string {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
  }
}
```

Person A also builds the two pages — onboarding and project list — which are mostly just forms calling service methods.

---

### Person B — the board and interactions

Person B owns everything visual on the board itself. The key piece is the CDK drop handler, which is where the two halves of the app meet:

```typescript
// kanban-board.component.ts
export class KanbanBoardComponent {
  private projectService = inject(ProjectService);
  private timerService = inject(TimerService);
  private route = inject(ActivatedRoute);

  project = computed(() => {
    const id = this.route.snapshot.paramMap.get('id')!;
    return this.projectService.getProject(id);
  });

  columnsWithTasks = computed(() => {
    const p = this.project();
    if (!p) return [];
    return [...p.columns]
      .sort((a, b) => a.order - b.order)
      .map(col => ({
        column: col,
        tasks: p.tasks.filter(t => t.columnId === col.id)
      }));
  });

  // THE integration point — Person B calls Person A's timer service here
  onDrop(event: CdkDragDrop<Task[]>, toColumn: Column) {
    if (event.previousContainer === event.container) return;

    const task = event.item.data as Task;
    const fromColumnId = event.previousContainer.id;

    // Person A's timer logic runs here
    const updatedTask = this.timerService.recordMove(task, fromColumnId, toColumn.id);

    this.projectService.moveTask(this.project()!.id, updatedTask);
  }
}
```

The board template uses CDK's `cdkDropListGroup` to connect all columns:

```html
<!-- kanban-board.component.html -->
<div class="board" cdkDropListGroup>
  @for (entry of columnsWithTasks(); track entry.column.id) {
    <div class="column"
         cdkDropList
         [id]="entry.column.id"
         [cdkDropListData]="entry.tasks"
         (cdkDropListDropped)="onDrop($event, entry.column)">

      <h3>{{ entry.column.name }}</h3>

      @for (task of entry.tasks; track task.id) {
        <app-task-card [task]="task" cdkDrag [cdkDragData]="task"
                       (deleted)="deleteTask(task.id)"/>
      }
    </div>
  }
</div>
```

---

## The one conversation you must have at lunch

When you sync over lunch, align on exactly this — the `moveTask` signature in `ProjectService`. Person A may have changed it while implementing. Person B is about to call it. Make sure they match:

```typescript
// Agree on this exact shape
moveTask(projectId: string, updatedTask: Task): void
//                          ^^^^^^^^^^^^^^^^^^^
// Person A's timer returns the full updated task object
// Person B passes it straight through — no second-guessing the internals
```

This is the only real integration seam. Everything else is independent.

---

## The stats panel — Person A's afternoon target

When a task lands in the `Completed` column, a small breakdown should appear on its card. Person A builds this as a simple component:

```typescript
// task-stats.component.ts
@Component({
  selector: 'app-task-stats',
  standalone: true,
  template: `
    @for (entry of entries(); track entry.columnName) {
      <div class="stat-row">
        <span>{{ entry.columnName }}</span>
        <span>{{ entry.formatted }}</span>
      </div>
    }
  `
})
export class TaskStatsComponent {
  @Input() task!: Task;
  @Input() columns!: Column[];

  private timer = inject(TimerService);

  entries = computed(() =>
    this.columns
      .filter(c => this.task.timeLog[c.id]?.totalMs > 0)
      .map(c => ({
        columnName: c.name,
        formatted: this.timer.formatMs(this.task.timeLog[c.id].totalMs)
      }))
  );
}
```

Person B drops it into the task card template:

```html
<!-- task-card.component.html -->
<div class="card">
  <span>{{ task.title }}</span>
  @if (isCompleted()) {
    <app-task-stats [task]="task" [columns]="allColumns"/>
  }
</div>
```

---

## Deploying in under 10 minutes

At 17:30, one person runs:

```bash
ng build
# Then drag the dist/ folder to netlify.com/drop
# Or: npm i -g vercel && vercel
```

Netlify Drop is the fastest — no CLI, just drop the `dist/timed-kanban/browser/` folder onto the page. Done.

---

## The risk list — know these before you start

Three things most likely to burn your time:

The `cdkDropList [id]` binding must be a plain string, not an expression like `[id]="'col-' + column.id"` — CDK uses it as a DOM id and cross-list references break silently if they don't match. Use the raw `column.id` as-is.

The `effect()` for auto-save will trigger on every `projects.set()` call, including the initial load from localStorage. Guard against the first write overwriting an empty array over your saved data by only saving after the first render cycle, or by checking `projects().length > 0`.

The board needs `overflow-x: auto` on the host element. With 6 default columns and a narrow viewport, the CDK drop zones will collapse without it and drag-and-drop breaks in weird ways.

---

That's the complete plan. You have everything you need to start — want me to go deeper on any specific block, like the full `project.service.ts` implementation or the board's CSS grid setup?

---

## Implementation Plan

Implementation Plan

So, the overall project structure has been divided into four phases - Phase 1 -> Before split setting up.
Phase 2 -> Person 1 implementation that covers all the code file contents.
Phase 3 -> Person 2 implementation that covers all the code file contents.
Phase 4 -> Final integration that involves linking the both.  This is the current plan - I wanted to create a project - and set things up - and then push it to github, so that my friend will be able to pull the project, and work simulataneously and then finally we both will push it seperately in our branches - and then we will merge it to the main from each of the branches resolving the conflicts, and then working on the final integrations as well.
Now - Give me the full implementation with file-by-file - for the Before splitting(The first phase). Accordingly, after this response - when I ask you - Give me the Person 1 implementation that contains all the code files includes css stylings as well.

When I say give me the implementation that includes - full codefile implementation, any changes - creation or editing of angular files, setup, github commands and others.

Now the Phase 1 - has been implemented completely.

---
