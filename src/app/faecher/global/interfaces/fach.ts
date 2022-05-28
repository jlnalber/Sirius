import { Color } from "src/app/whiteboard/global-whiteboard/interfaces/whiteboard";

export interface Faecher {
    faecher: Fach[],
    categories: Category[]
}

export interface Category {
    name: string,
    color: Color,
    id: string
}

export interface Fach {
    id: string,
    name: string,
    description: string,
    files: string[],
    einheiten: Einheit[],
    notes: string,
    tasks: Task[],
    whiteboards: string[]
}

export interface Einheit {
    id: string,
    topic: string,
    description: string,
    notes: string,
    tasks: Task[],
    files: File[],
    whiteboards: Whiteboard[]
}

export interface File {
    path: string,
    categoryId?: string
}

export interface Whiteboard {
    path: string,
    categoryId?: string
}

export interface Task {
    description: string,
    closed: boolean,
    categoryId?: string
}