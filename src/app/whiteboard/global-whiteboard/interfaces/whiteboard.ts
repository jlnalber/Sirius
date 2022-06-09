import { Rect } from "./rect"

export interface Whiteboard {
    backgroundColor: Color,
    backgroundImage: string,
    backgroundScale?: number,
    format?: Rect,
    pages: Page[],
    pageIndex: number
}

export interface Page {
    translateX: number,
    translateY: number,
    zoom: number,
    content: string
}

export interface Color {
    r: number,
    g: number,
    b: number,
    a?: number
}

export const defaultWhiteboard: Whiteboard = {
    backgroundColor: {
        r: 255,
        g: 255,
        b: 255
    },
    backgroundImage: "",
    pages: [
        {
            translateX: 0,
            translateY: 0,
            zoom: 1,
            content: ""
        }
    ],
    pageIndex: 0
}