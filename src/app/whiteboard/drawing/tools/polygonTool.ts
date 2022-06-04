import { getDistance } from "../../global-whiteboard/essentials/utils";
import { Point } from "../../global-whiteboard/interfaces/point";
import { Line } from "./line";
import { Tool } from "./tool";

export abstract class PolygonTool extends Tool {
    
    protected abstract getLines(): Line[];

    private _lineCache?: Line[];

    private getLinesFromCache(): Line[] {
        // manage the cache of the lines
        if (!this._lineCache) {
            this._lineCache = this.getLines();
        }
        return this._lineCache;
    }

    protected clearCache = () => {
        this._lineCache = undefined;
    }

    public correctPoint(p: Point): Point {
        if (this.isActive) {
            // get all the closestPs to the lines
            let closestPs = this.getLinesFromCache().map(l => l.getClosestPointOnLineTo(p));
            const maxDistance = 40 / this.board.zoom;

            // now look for the closest one to the Point p and return it when it's smaller than the maxDistance
            if (closestPs.length >= 1) {
                let closestP = closestPs[0];
                let minDistance = getDistance(p, closestP);

                for (let i = 1; i < closestPs.length; i++) {
                    const distance = getDistance(p, closestPs[i]);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestP = closestPs[i];
                    }
                }

                if (minDistance <= maxDistance) {
                    return closestP;
                }
            }
        }

        // otherwise return the original Point
        return p;
    }
}