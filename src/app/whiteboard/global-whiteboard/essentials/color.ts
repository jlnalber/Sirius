import { Event } from "./event";
import { Color as ColorExport } from "../interfaces/whiteboard";
import { sameColorAs } from "./utils";

export class Color {

    private _r: number = 0;
    private _g: number = 0;
    private _b: number = 0;
    private _a?: number;
    public readonly onchange: Event = new Event();

    public get r(): number | null {
        return this._r;
    }

    public set r(value: number | null) {
        this._r = Color.clamp(value, 0, 255, true);
        this.onchange.emit();
    }

    public get g(): number | null {
        return this._g;
    }

    public set g(value: number | null) {
        this._g = Color.clamp(value, 0, 255, true);
        this.onchange.emit();
    }

    public get b(): number | null {
        return this._b;
    }

    public set b(value: number | null) {
        this._b = Color.clamp(value, 0, 255, true);
        this.onchange.emit();
    }

    public get a(): number | undefined {
        return this._a;
    }

    public set a(value: number | undefined) {
        if (value) {
            this._a = Color.clamp(value, 0, 255, true);
        } else {
            this._a = value;
        }
        this.onchange.emit();
    }

    private static clamp(value: number | null, min: number, max: number, round?: boolean) {
        if (value) {
            if (round) value = Math.round(value);
            if (value < min) {
                return min;
            } else if (value > max) {
                return max;
            }
            return value;
        }
        return min;
    }

    private static toHex(num: number | null, length: number = 2): string {
        
        let multiply = (s: string, times: number): string => {
            if (times == 0) return '';
            return s + multiply(s, times - 1)
        }
        
        if (num) {
            let str = num.toString(16);

            if (str.length < length) {

                str = multiply('0', length - str.length) + str;
            }
            
            return str;
        }
        return multiply('0', length);
    }

    constructor(r: number, g: number, b: number, a?: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this._a = a;
    }

    public static from(color: ColorExport): Color {
        return new Color(color.r, color.g, color.b, color.a);
    }

    public toString() {
        let str = '#' + Color.toHex(this.r) + Color.toHex(this.g) + Color.toHex(this.b);
        if (this.a != undefined) {
            str += Color.toHex(this.a);
        }
        return str;
    }

    public sameColorAs(color: Color | ColorExport): boolean {
        return sameColorAs(this, color);
    }

    public copy(): Color {
        return new Color(this.r as number, this.g as number, this.b as number, this.a);
    }

    public setTo(c: Color | ColorExport) {
        if (c instanceof Color) {
            this._r = c._r;
            this._g = c._g;
            this._b = c._b;
            this._a = c._a;
        }
        else {
            this._r = c.r;
            this._g = c.g;
            this._b = c.b;
            this._a = c.a;
        }
        this.onchange.emit();
    }

    public export(): ColorExport {
        return {
            r: this._r,
            g: this._g,
            b: this._b,
            a: this._a
        };
    }

    public from(value: ColorExport): void {
        this._r = value.r;
        this._g = value.g;
        this._b = value.b;
        this._a = value.a;
        this.onchange.emit();
    }

    public isBright(): boolean {
        if (this.r != null && this.g != null && this.b != null && (!this.a || this.a > 100)) {
            return this.r + this.g + this.b > 3 * 255 / 2;
        }
        return false;
    }
}