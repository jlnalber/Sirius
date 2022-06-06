import { TouchController } from 'dist/whiteboard/lib/global-whiteboard/essentials/touchController';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Color as IColor } from '../interfaces/whiteboard';
import { Vector, Point } from './../interfaces/point';
import { Rect } from './../interfaces/rect';
import { Color } from './color';
import { TouchControllerEvents } from './touchController';

export function max<T>(coll: T[], func: (t: T) => number): number | undefined {
    if (coll.length != 0) {
        let max = func(coll[0]);

        for (let i = 1; i < coll.length; i++) {
            let val = func(coll[i]);
            if (val > max) {
                max = val;
            }
        }

        return max;
    }
    return undefined;
}

export function min<T>(coll: T[], func: (t: T) => number): number | undefined {
    if (coll.length != 0) {
        let min = func(coll[0]);

        for (let i = 1; i < coll.length; i++) {
            let val = func(coll[i]);
            if (val < min) {
                min = val;
            }
        }

        return min;
    }
    return undefined;
}

export function getBoundingRect(rects: Rect[] | HTMLCollection, board?: Board): Rect {
    if (rects instanceof HTMLCollection) {
        // if it is an HTMLCollection, calculate the rects
        let coll: Rect[] = [];

        for (let i in rects) {
            let el = rects[i];
            if (el && el instanceof SVGElement) {
                // if there is an board, map to the actual coordinates
                if (board) {
                    coll.push(board.getRectFromBoundingClientRect(el.getBoundingClientRect()));
                }
                else {
                    coll.push(DOMRectToRect(el.getBoundingClientRect()));
                }
            }
        }

        return getBoundingRect(coll);
    }
    else {
        let x = min(rects, r => r.x) ?? 0;
        let y = min(rects, r => r.y) ?? 0;
        let outerX = max(rects, r => r.x + r.width) ?? 0;
        let outerY = max(rects, r => r.y + r.height) ?? 0;

        return {
            x: x,
            y: y,
            width: outerX - x,
            height: outerY - y
        }
    }
}

export function DOMRectToRect(domRect: DOMRect | undefined): Rect {
    return {
        x: domRect?.left ?? 0,
        y: domRect?.top ?? 0,
        width: domRect?.width ?? 0,
        height: domRect?.height ?? 0
    }
}

export function moveRect(rect: Rect, vector: Vector): Rect {
    return {
        x: rect.x + vector.x,
        y: rect.y + vector.y,
        width: rect.width,
        height: rect.height
    };
}

export function resizeRect(rect: Rect, factor: number): Rect {
    return {
        x: rect.x * factor,
        y: rect.y * factor,
        width: rect.width * factor,
        height: rect.height * factor
    }
}

export function getImageDimensions(file: string): Promise<Rect> {
    return new Promise (function (resolved, rejected) {
        var i = new Image()
        i.onload = function(){
            resolved({x: 0, y: 0, width: i.width, height: i.height})
        };
        i.src = file
    })
}

export const defaultRect: Rect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

export const defaultPoint: Point = {
    x: 0,
    y: 0
}

export function getDistance(from?: Point, to?: Point): number {
    if (!from || !to) return Number.MAX_VALUE;
    return Math.sqrt((from.x - to.x) ** 2 + (from.y - to.y) ** 2);
}

export function getLength(vector: Vector): number {
    return getDistance({
        x: 0,
        y: 0
    }, vector);
}

export function scale(vector: Vector, factor: number): Vector {
    return {
        x: vector.x * factor,
        y: vector.y * factor
    };
}

export function scaleToLength(vector: Vector, length: number): Vector {
    return scale(vector, length / getLength(vector));
}

export function add(v1: Vector, v2: Vector): Vector {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y
    };
}

export function getAngleVector(vector: Vector): number {
    return getAngle({
        x: 0,
        y: 0
    }, vector);
}

export function inRange(num: number, from: number, to: number): boolean {
    return num >= from && num <= to;
}

export function inRangeWithOrder(num: number, from: number, to: number): boolean {
    if (from < to) return inRange(num, from, to);
    return inRange(num, to, from);
}

export function clamp(min: number, num: number, max: number): number {
    if (num < min) return min;
    if (num > max) return max;
    return num;
}

export function readPoints(d: string): Point[] {
    // this method can split a 'd'-property to a point array
    try {
        // complicated, but works
        return d.split(/[MQL]/).filter(s => s != "").map(s => s.substring(0, Math.max(0, s.indexOf(',')) || s.length).split(' ').filter(f => f != "")).map(p => { return { x: parseFloat(p[0]), y: parseFloat(p[1]) } });
    }
    catch {
        return [];
    }
}

export function createPathD(points: Point[]): string {
    // create the d property for paths
    if (points.length == 0) return '';

    let firstPoint = points[0];
    let d = `M${firstPoint.x} ${firstPoint.y}`;

    for (let i = 2; i < points.length; i++) {
        let point = points[i];
        let lastPoint = points[i - 1];

        let dx = (point.x + lastPoint.x) / 2;
        let dy = (point.y + lastPoint.y) / 2;

        d += ` Q ${lastPoint.x} ${lastPoint.y}, ${dx} ${dy}`;
    }

    if (points.length > 2) {
        let lastPoint = points[points.length - 1];
        d += ` L${lastPoint.x} ${lastPoint.y}`;
    }

    return d;
}

export function splitByPoints(origPoints: Point[], pointsToSplit: Point[]): Point[][] {
    // this method splits the origPoints at the pointsToSplit
    let pointArrays: Point[][] = [];
    let lastArray: Point[] = [];

    for (let p of origPoints) {
        if (pointsToSplit.indexOf(p) != -1) {
            if (lastArray.length != 0) {
                pointArrays.push(lastArray);
                lastArray = [];
            }
        }
        else {
            lastArray.push(p);
        }
    }

    if (lastArray.length != 0) {
        pointArrays.push(lastArray);
    }

    return pointArrays;
}

export function sameColorAs(c1: Color | IColor, c2: Color | IColor): boolean {
    return c1.r == c2.r && c1.g == c2.g && c1.b == c2.b && (c1.a == c2.a || (!c1.a && c2.a == 255) || (!c2.a && c1.a == 255));
}

export function getAngle(p1: Point, p2: Point): number {
    // function, that calculates the angle of a vector between two points --> with respecting the flip at pi
    let deltaY = p1.y - p2.y;
    let deltaX = p1.x - p2.x;
    let firstAngle = Math.atan(deltaY / deltaX); // first angle, that is only calculated by atan (no flip yet)
    let finalAngle = firstAngle + (deltaX < 0 ? Math.PI : 0); // now with flip

    return finalAngle;
}

export function getTouchControllerEventsAllSame(
    start: (p: Point) => void, 
    move: (from: Point, to: Point) => void, 
    end: (p: Point) => void,
    pinchZoom?: (factor: number, p: Point) => void,
    pinchTurn?: (angle: number, p: Point) => void): TouchControllerEvents {
    return {
        touchStart: start,
        stylusStart: start,
        mouseStart: start,
        touchMove: move,
        stylusMove: move,
        mouseMove: move,
        touchEnd: end,
        stylusEnd: end,
        mouseEnd: end,
        pinchZoom: pinchZoom,
        pinchTurn: pinchTurn
    }
}

export function mod(a: number, modul: number): number {
    if (a < 0) {
        return modul + a % modul;
    }
    return a % modul;
}

export function getIntersectionRects(rect1: Rect | DOMRect, rect2: Rect | DOMRect) {
    
    if ((rect1 as DOMRect).left) rect1 = DOMRectToRect(rect1 as DOMRect);
    if ((rect2 as DOMRect).left) rect2 = DOMRectToRect(rect2 as DOMRect);

    let x = Math.max(rect1.x, rect2.x);
    let y = Math.max(rect1.y, rect2.y);

    let minX = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
    let minY = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);

    return {
        x: x,
        y: y,
        width: minX - x,
        height: minY - y
    };
}