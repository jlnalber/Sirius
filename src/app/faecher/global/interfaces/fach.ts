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
    files: File[],
    einheiten: Einheit[],
    editors: Editor[],
    notes: string,
    tasks: Task[],
    whiteboards: Whiteboard[]
}

export interface Einheit {
    id: string,
    topic: string,
    description: string,
    notes: string,
    tasks: Task[],
    files: File[],
    editors: Editor[],
    whiteboards: Whiteboard[]
}

export interface File {
    name: string,
    categoryId?: string
}

export interface Whiteboard {
    id: string,
    name: string,
    categoryId?: string
}

export interface Task {
    description: string,
    closed: boolean,
    categoryId?: string
}

export interface Editor {
    id: string,
    name: string,
    categoryId?: string
}