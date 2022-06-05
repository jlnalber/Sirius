import { add, getAngleVector, getDistance, scale, scaleToLength } from "../../global-whiteboard/essentials/utils";
import { Point, Vector } from "../../global-whiteboard/interfaces/point";
import { Geometry } from "./geometry";
import { ModulInterval } from "./interval";
import { Line } from "./line";

// Ein Kreisabschnitt

export class CircleSegment extends Geometry {

    constructor(public readonly center: Point, public readonly radius: number, public readonly angleInterval?: ModulInterval) {
        super();

        this.radius = Math.abs(this.radius);
    }

    public intercepts(p: Point): boolean {
        return getDistance(p, this.center) == this.radius && (!this.angleInterval || this.angleInterval.isIn(getAngleVector(this.getCenterToP(p))));
    }

    public getOrthogonal(p: Point): Line {
        return Line.fromPoints(p, this.center);
    }

    public getClosestPointTo(p: Point): Point {
        let centerToP = this.getCenterToP(p);

        // if the point is not in the interval
        if (this.angleInterval && this.angleInterval.isIn(getAngleVector(centerToP))) return { x: Number.MAX_VALUE, y: Number.MAX_VALUE }

        // otherwise return the point
        let pOnCircle = scaleToLength(centerToP, this.radius);
        return add(this.center, pOnCircle);
    }

    private getCenterToP(p: Point): Vector {
        return add(p, scale(this.center, -1));
    }

}