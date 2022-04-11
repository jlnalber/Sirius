import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Vector, Point } from './../interfaces/point';
import { Rect } from './../interfaces/rect';

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

export function getDistance(from: Point, to: Point): number {
    return Math.sqrt((from.x - to.x) ** 2 + (from.y - to.y) ** 2);
}

export function inRange(num: number, from: number, to: number): boolean {
    return num >= from && num <= to;
}