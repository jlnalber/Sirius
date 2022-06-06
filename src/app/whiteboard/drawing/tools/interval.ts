import { mod } from "../../global-whiteboard/essentials/utils";

// function that can check whether numbers are between each other
const isIn = (num: number, start: number, end: number, startOpen: boolean, endOpen: boolean) => {
    return (startOpen ? (num > start) : (num >= start))
        && (endOpen   ? (num < end)   : (num <= end));
}


// Ein Interval
export class Interval {
    
    constructor (public start: number, public end: number, public startOpen: boolean = false, public endOpen: boolean = false) { 
        if (this.start > this.end) {
            let temp = this.start;
            this.start = this.end;
            this.end = temp;
        }
    }

    public isIn(num: number): boolean {
        return isIn(num, this.start, this.end, this.startOpen, this.endOpen);
    }
}


// Ein Interval mit Modul-Eigenschaften
export class ModulInterval extends Interval {

    constructor(public readonly modul: number, start: number, end: number, startOpen: boolean = false, endOpen = false) {
        super(start, end, startOpen, endOpen);

    }

    public override isIn(num: number): boolean {
        num = mod(num, this.modul);

        if (this.end - this.start >= this.modul || isIn(num, this.start, this.end, this.startOpen, this.endOpen)) return true;

        let modStart = mod(this.start, this.modul);
        let modEnd = mod(this.end, this.modul);

        if (modStart >= modEnd) {
            let value = this.startOpen ? (num > modStart) : (num >= modStart)
                        || this.endOpen ? (num < modEnd) : (num <= modEnd);
            return value;
        }
        else {
            return isIn(num, modStart, modEnd, this.startOpen, this.endOpen);
        }
    }

}