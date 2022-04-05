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

export function getBoundingRect(rects: Rect[]): Rect {
    let x = min(rects, r => r.x) ?? 0;
    let y = min(rects, r => r.y) ?? 0;
    let outerX = max(rects, r => r.x + r.width) ?? 0;
    let outerY = max(rects, r => r.y + r.height) ?? 0;

    return {
        x: x,
        y: y,
        width: outerX - x,
        height: outerY - y
    };
}

export function DOMRectToRect(domRect: DOMRect | undefined): Rect {
    return {
        x: domRect?.left ?? 0,
        y: domRect?.top ?? 0,
        width: domRect?.width ?? 0,
        height: domRect?.height ?? 0
    }
}