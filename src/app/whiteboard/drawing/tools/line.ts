import { getDistance } from "../../global-whiteboard/essentials/utils";
import { Point } from "../../global-whiteboard/interfaces/point";


// Eine Gerade der allgemeinen Geradenform 'ax + by = c'

export class Line {

    public get slope(): number {
        return - this.a / this.b;
    }

    public get yIntercept(): number {
        return this.c / this.b;
    }

    constructor(public a: number, public b: number, public c: number, public interval?: Interval) {
        if (this.a == 0 && this.b == 0) throw "Invalid line";
    }

    public intercepts(p: Point): boolean {
        return (this.a * p.x + this.b * p.y == this.c) && (!this.interval || this.interval.isIn(p.x));
    }

    public getOrthogonal(p: Point): Line {
        if (this.a == 0) {
            return new Line(1, 0, p.x);
        }
        else if (this.b == 0) {
            return new Line(0, 1, p.y);
        }
        else {
            return Line.fromPointAndSlope(this.b / this.a, p);
        }
    }

    public getInterceptionPoint(line: Line): Point | undefined {
        // Die ersten drei Fälle zielen auf Parallelität ab
        // 1. Fall: Der Fall mit ax = c (bei beiden)
        if (this.b == 0 && line.b == 0) {
            return undefined;
        }
        // 2. Fall: Der Fall mit by = c (bei beiden)
        else if (this.a == 0 && line.a == 0) {
            return undefined;
        }
        // 3. Fall: Die Geraden sind parallel (und nicht parallel zu einer Achse)
        else if (this.slope == line.slope) {
            return undefined;
        }

        // 4: Fall: Die aktuelle Gerade ist parallel zur y-Achse
        else if (this.b == 0) {
            let x = this.c / this.a;
            return line.getPointToX(x);
        }
        // 5. Fall: Die andere Gerade ist parallel zur y-Achse
        else if (line.b == 0) {
            let x = line.c / line.a ;
            return this.getPointToX(x);
        }

        // Nun sind die Geraden also nicht parallel zueinander und nicht parallel zur y-Achse
        else {
            let x = (line.yIntercept - this.yIntercept) / (this.slope - line.slope);
            return this.getPointToX(x);
        }
    }

    public getPointToX(x: number): Point | undefined {
        if (this.b == 0) return undefined;
        else if (this.interval && !this.interval.isIn(x)) return undefined;
        else {
            return {
                x: x,
                y: (this.c - this.a * x) / this.b
            }
        }
    }

    public getPointToY(y: number): Point | undefined {
        if (this.a == 0) return undefined;
        else if (this.interval && !this.interval.isIn((this.c - this.b * y) / this.a)) return undefined;
        else {
            return {
                x: (this.c - this.b * y) / this.a,
                y: y
            }
        }
    }

    public getClosestPointOnLineTo(p: Point): Point {
        // Berechne den nächsten Punkt
        let closestP = this.getInterceptionPoint(this.getOrthogonal(p)) as Point;

        // für den Fall, dass der Punkt außerhalb des Intervalls liegt
        if (this.interval && !this.interval.isIn(closestP.x)) {
            let startP = this.getPointToX(this.interval.start) as Point;
            let startDist = getDistance(p, startP);

            let endP = this.getPointToX(this.interval.end) as Point;
            let endDist = getDistance(p, endP);
            
            return startDist < endDist ? startP : endP;
        }

        // Gebe den nächsten Punkt zurück
        return closestP;
    }

    public getDistance(p: Point): number {
        // Gebe die Distanz zurück
        return getDistance(p, this.getClosestPointOnLineTo(p));
    }

    public static fromPoint(a: number, b: number, p: Point, interval?: Interval): Line {
        return new Line(a, b, a * p.x + b * p.y, interval);
    }

    public static fromPointAndYIntercept(slope: number, yIntercept: number, interval?: Interval) {
        return new Line(-slope, 1, yIntercept, interval);
    }

    public static fromPointAndSlope(slope: number, p: Point, interval?: Interval): Line {
        return Line.fromPoint(-slope, 1, p, interval);
    }
}

export class Interval {
    
    constructor (public start: number, public end: number, public startOpen: boolean = false, public endOpen: boolean = false) { }

    public isIn(num: number): boolean {
        return (this.startOpen ? (num > this.start) : (num >= this.start))
            && (this.endOpen   ? (num < this.end)   : (num <= this.end));
    }
}