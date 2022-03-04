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
    files: string[],
    whiteboards: string[]
}

export interface Task {
    description: string,
    closed: boolean
}