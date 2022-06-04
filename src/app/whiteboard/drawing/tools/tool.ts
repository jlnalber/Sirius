import { Point } from "../../global-whiteboard/interfaces/point";

export abstract class Tool {
    public abstract correctPoint(p: Point): Point;
    public abstract angle: number;
}