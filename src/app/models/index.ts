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
    locked: boolean;
}

export interface Project {
    id: string;
    name: string;
    columns: Column[];
    tasks: Task[];
    createdAt: number;
}

export interface AppState {
    userName: string | null;
    projects: Project[];
}

export const DEFAULT_COLUMNS: Column[] = [
    { id: 'col-todo', name: 'Todo', order: 0, locked: true },
    { id: 'col-working', name: 'Working', order: 1, locked: false },
    { id: 'col-testing', name: 'Testing', order: 2, locked: false },
    { id: 'col-review', name: 'Review', order: 3, locked: false },
    { id: 'col-actual-testing', name: 'Actual Testing', order: 4, locked: false },
    { id: 'col-completed', name: 'Completed', order: 5, locked: true },
];

export const STORAGE_KEYS = {
    USER_NAME: 'tk_user_name',
    PROJECTS: 'tk_projects',
} as const;