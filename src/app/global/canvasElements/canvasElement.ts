export const svgns = "http://www.w3.org/2000/svg";

export interface Point {
    x: number,
    y: number
}

export abstract class CanvasItem {
    public abstract touchStart(p: Point): void;
    public abstract touchMove(from: Point, to: Point): void;
    public abstract touchEnd(p: Point): void;
}