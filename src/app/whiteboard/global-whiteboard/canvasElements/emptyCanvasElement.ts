import { Point } from "../interfaces/point";
import { CanvasItem } from "./canvasElement";

export class EmptyCanvasElement extends CanvasItem {

    public touchStart(p: Point): void {
        return;
    }
    public touchMove(from: Point, to: Point): void {
        return;
    }
    public touchEnd(p: Point): void {
        return;
    }
    
}