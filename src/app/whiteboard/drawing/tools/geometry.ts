import { getDistance } from "../../global-whiteboard/essentials/utils";
import { Point } from "../../global-whiteboard/interfaces/point";
import { Line } from "./line";

export abstract class Geometry {

    public abstract intercepts(p: Point): boolean;
    public abstract getOrthogonal(p: Point): Line;
    public abstract getClosestPointTo(p: Point): Point;

    public getDistance(p: Point): number {
        // Gebe die Distanz zurück
        return getDistance(p, this.getClosestPointTo(p));
    }

}