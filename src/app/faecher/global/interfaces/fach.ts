import { Color } from "src/app/whiteboard/global-whiteboard/interfaces/whiteboard";

export interface Mappen {
  mappen: Mappe[],
  categories: Category[],
  gruppen: Gruppe[],
}

export interface Mappe {
  title: string,
  description: string,
  gruppen: string[],
  id: string
}

export interface Category {
    name: string,
    color: Color,
    id: string
}

export interface Gruppe {
    id: string,
    name: string,
    description: string,
    files: File[],
    gruppen: string[],
    editors: Editor[],
    notes: string,
    tasks: Task[],
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
