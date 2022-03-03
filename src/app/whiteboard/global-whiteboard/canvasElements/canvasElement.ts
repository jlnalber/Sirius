import { Point } from "../interfaces/point";

export abstract class CanvasItem {
    public abstract touchStart(p: Point): void;
    public abstract touchMove(from: Point, to: Point): void;
    public abstract touchEnd(p: Point): void;
}