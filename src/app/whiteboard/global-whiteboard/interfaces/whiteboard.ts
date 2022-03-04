export interface Whiteboard {
    backgroundColor: Color,
    backgroundImage: string,
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