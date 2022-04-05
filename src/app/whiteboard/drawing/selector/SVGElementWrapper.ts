import { Rect } from './../../global-whiteboard/interfaces/rect';
import { Event } from "../../global-whiteboard/essentials/event";
import { DOMRectToRect, getBoundingRect } from '../../global-whiteboard/essentials/utils';

export class SVGElementWrapper {
    public readonly onSVGElChange: Event = new Event();
    public readonly onPropertyChange: Event = new Event();

    private _svgEl: SVGElement | undefined;
    public set svgEl(value: SVGElement | undefined) {
        this._svgEl = value;
        this.readTransform();
        this.onSVGElChange.emit();
    }
    public get svgEl(): SVGElement | undefined {
        return this._svgEl;
    }

    private _translateX: number | undefined;
    public get translateX(): number | undefined {
        return this._translateX;
    }
    public set translateX(value: number | undefined) {
        this._translateX = !value || value == Infinity ? 0.00001 : value;
        this.reloadTransform();
        this.onPropertyChange.emit();
    }
  
    private _translateY: number | undefined;
    public get translateY(): number | undefined {
        return this._translateY;
    }
    public set translateY(value: number | undefined) {
        this._translateY = !value || value == Infinity ? 0.00001 : value;
        this.reloadTransform();
        this.onPropertyChange.emit();
    }
  
    private _scaleX: number | undefined;
    public get scaleX(): number | undefined {
        return this._scaleX;
    }
    public set scaleX(value: number | undefined) {
        this._scaleX = !value || value == Infinity ? 0 : value;
        this.reloadTransform();
        this.onPropertyChange.emit();
    }
  
    private _scaleY: number | undefined;
    public get scaleY(): number | undefined {
        return this._scaleY;
    }
    public set scaleY(value: number | undefined) {
        this._scaleY = !value || value == Infinity ? 0 : value;
        this.reloadTransform();
        this.onPropertyChange.emit();
    }
  
    private _rotate: number | undefined;
    public get rotate(): number | undefined {
        return this._rotate;
    }
    public set rotate(value: number | undefined) {
        this._rotate = !value || value == Infinity ? 0 : value;
        this.reloadTransform();
        this.onPropertyChange.emit();
    }

    constructor(svgEl?: SVGElement) {
        this.svgEl = svgEl;
    }
    
    private reloadTransform(): void {
        if (this.svgEl) {
            let transform = '';
            if (this.translateX != undefined && this.translateY != undefined) {
                transform += `translate(${this.translateX} ${this.translateY})`;
            }
            if (this.scaleX != undefined && this.scaleY != undefined) {
                transform += ` scale(${this.scaleX} ${this.scaleY})`
            }
            if (this.rotate != undefined) {
                transform += ` rotate(${this.rotate})`;
            }
            this.svgEl.setAttributeNS(null, 'transform', transform);
        }
    }

    private readTransform(): void {
      // funktion, die die parameter einer Funktion zurückgibt
      let getFuncParams = (str: string, func: string): string[] | undefined => {
        let ind = str.indexOf(func + '(');
        if (ind != -1) {
          try {
            ind += func.length + 1;
            let indEnd = str.indexOf(')', ind);
            let substr = str.substring(ind, indEnd); // in 'substr' ist jetzt das innere von den Klammern
            return substr.split(/(?: |,)/); // Und hier wird an den ','/' ' getrennt
          } catch { }
        }
        return undefined;
      }
  
      if (this.svgEl) {
        let transform = this.svgEl.getAttributeNS(null, 'transform');
  
        if (transform != null) {
          let translate = getFuncParams(transform, 'translate');
          let scale = getFuncParams(transform, 'scale');
          let rotate = getFuncParams(transform, 'rotate');
  
          // set the translate properties
          if (translate) {
            if (translate.length == 1) {
              let num = Number.parseFloat(translate[0]);
              this._translateX = num;
              this._translateY = num;
            }
            else if (translate.length == 2) {
              this._translateX = Number.parseFloat(translate[0]);
              this._translateY = Number.parseFloat(translate[1]);
            }
          }
          else {
            this._translateX = 0;
            this._translateY = 0;
          }
  
          // set the scale properties
          if (scale) {
            if (scale.length == 1) {
              let num = Number.parseFloat(scale[0]);
              this._scaleX = num;
              this._scaleY = num;
            }
            else if (scale.length == 2) {
              this._scaleX = Number.parseFloat(scale[0]);
              this._scaleY = Number.parseFloat(scale[1]);
            }
          }
          else {
            this._scaleX = 1;
            this._scaleY = 1;
          }
  
          // set the rotate propertie
          if (rotate && rotate.length == 1) {
            this._rotate = Number.parseFloat(rotate[0]);
          }
          else {
            this._rotate = 0;
          }
        }
        else {
          this._translateX = 0;
          this._translateY = 0;
          this._scaleX = 1;
          this._scaleY = 1;
          this._rotate = 0;
        }
      }
    }

    public getBoundingClientRect(): DOMRect | undefined {
        return this.svgEl?.getBoundingClientRect();
    }
}

export class SVGElementWrapperCollection implements Iterable<SVGElementWrapper> {
    public readonly onEdit: Event = new Event();
    public readonly onRemove: Event = new Event();
    public readonly onPush: Event = new Event();
    public readonly onClear: Event = new Event();
    public readonly onSet: Event = new Event();

    private svgElementWrappers: SVGElementWrapper[] = [];

    constructor(svgElementWrappers?: SVGElementWrapper[]) {
        if (svgElementWrappers) {
            this.svgElementWrappers = svgElementWrappers;
        }
    }

    [Symbol.iterator](): Iterator<SVGElementWrapper, any, undefined> {
        let counter = 0;
        return {
            next: () => {
                return {
                    done: counter >= this.svgElementWrappers.length,
                    value: this.svgElementWrappers[counter++]
                }
            }
        }
    }

    public push(...svgElementWrappers: SVGElementWrapper[]): number {
        let res = this.svgElementWrappers.push(...svgElementWrappers);
        this.onPush.emit();
        this.onEdit.emit();
        return res;
    }

    public remove(svgElementWrapper: SVGElementWrapper): boolean {
        const index = this.svgElementWrappers.indexOf(svgElementWrapper);
        if (index > -1) {
            this.svgElementWrappers.splice(index, 1);
            this.onRemove.emit();
            this.onEdit.emit();
            return true;
        }
        return false;
    }

    public clear(): void {
        this.svgElementWrappers = [];
        this.onClear.emit();
    }

    public set svgElementWrapper(value: SVGElement | SVGElementWrapper | (SVGElement | SVGElementWrapper)[] | undefined) {
        if (value) {
            if (value instanceof Array) {
                this.clear();
                for (let i of value) {
                    if (i instanceof SVGElementWrapper) {
                        this.push(i);
                    }
                    else if (i instanceof SVGElement) {
                        this.push(new SVGElementWrapper(i));
                    }
                }
            }
            else if (value instanceof SVGElementWrapper) {
                this.clear();
                this.push(value);
            }
            else if (value instanceof SVGElement) {
                this.clear();
                this.push(new SVGElementWrapper(value));
            }
        }
        else {
            this.clear();
        }
        this.onSet.emit();
    }

    public get empty(): boolean {
        return this.svgElementWrappers.length == 0;
    }

    public getBoundingClientRect(): Rect {
        return getBoundingRect(this.svgElementWrappers.map(s => DOMRectToRect(s.getBoundingClientRect())))

        /*let minX: number | undefined = undefined;
        let maxX: number | undefined = undefined;
        let minY: number | undefined = undefined;
        let maxY: number | undefined = undefined;

        for (let svgElWrapper of this.svgElementWrappers) {
            let rect = svgElWrapper.getBoundingClientRect();
            if (rect) {
                if (!minX || minX > rect.left) {
                    minX = rect.left;
                }
                if (!minY || minY > rect.top) {
                    minY = rect.top;
                }
                if (!maxX || maxX < rect.left + rect.width) {
                    maxX = rect.left + rect.width;
                }
                if (!maxY || maxY < rect.top + rect.height) {
                    maxY = rect.top + rect.height;
                }
            }
        }

        return {
            x: minX ?? 0,
            y: minY ?? 0,
            width: (maxX ?? 0) - (minX ?? 0),
            height: (maxY ?? 0) - (minY ?? 0)
        }*/
    }

    public scaleXBy(factor: number) {
        for (let svgEl of this.svgElementWrappers) {
            if (svgEl.scaleX != undefined) {
                svgEl.scaleX *= factor;
            }
        }
    }

    public scaleYBy(factor: number) {
        for (let svgEl of this.svgElementWrappers) {
            if (svgEl.scaleY != undefined) {
                svgEl.scaleY *= factor;
            }
        }
    }

    public translateXBy(addition: number) {
        for (let svgEl of this.svgElementWrappers) {
            if (svgEl.translateX != undefined) {
                svgEl.translateX += addition;
            }
        }
    }

    public translateYBy(addition: number) {
        for (let svgEl of this.svgElementWrappers) {
            if (svgEl.translateY != undefined) {
                svgEl.translateY += addition;
            }
        }
    }

    public rotateBy(addition: number) {
        for (let svgEl of this.svgElementWrappers) {
            if (svgEl.rotate != undefined) {
                svgEl.rotate += addition;
            }
        }
    }
}