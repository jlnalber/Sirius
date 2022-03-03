import { Color } from './color';
import { Event } from './event';

export type StrokelineCap = 'round' | 'butt' | 'square';

export class Stroke {

    private _thickness: number = 1;
    public get thickness(): number | null {
        return this._thickness;
    }
    public set thickness(t: number | null) {
        if (t == null) {
            t = 1;
        }
        this._thickness = t;
        this.onchange.emit();
    }
    public getThicknessString() {
        return this._thickness.toString();
    }
    public getThickness() {
        return this._thickness;
    }

    private _strokelineCap: StrokelineCap = 'round';
    public get strokeLineCap(): StrokelineCap {
        return this._strokelineCap;
    }
    public set strokeLineCap(value: StrokelineCap) {
        this._strokelineCap = value;
        this.onchange.emit();
    }

    private _color: Color;
    public get color(): Color {
        return this._color;
    }
    public set color(col: Color) {
        this._color = col;
        this.addOnChangeEvent(this._color)
        this.onchange.emit()
    }
    private addOnChangeEvent(color: Color) {
        color.onchange.addListener(() => this.onchange.emit());
    }

    constructor(color: Color, thickness?: number, strokeLineCap?: StrokelineCap) {
        this._color = color;
        this.addOnChangeEvent(this._color);
        if (thickness) {
            this._thickness = thickness;
        }
        if (strokeLineCap) {
            this._strokelineCap = strokeLineCap;
        }
    }

    public readonly onchange: Event = new Event();
}