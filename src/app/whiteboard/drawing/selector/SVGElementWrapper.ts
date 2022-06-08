import { Vector } from 'src/app/whiteboard/global-whiteboard/interfaces/point';
import { defaultPoint } from './../../global-whiteboard/essentials/utils';
import { Rect } from './../../global-whiteboard/interfaces/rect';
import { Event } from "../../global-whiteboard/essentials/event";
import { add, DOMRectToRect, getBoundingRect, scale, turnVectorByAngle } from '../../global-whiteboard/essentials/utils';
import { Point } from '../../global-whiteboard/interfaces/point';
import { Board } from '../../global-whiteboard/board/board';

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

    private _translateX: number = 0;
    public get translateX(): number {
        return this._translateX;
    }
    public set translateX(value: number) {
        this._translateX = value == Infinity ? 0 : value;
        this.reloadTransform();
        this.onPropertyChange.emit();
    }
  
    private _translateY: number = 0;
    public get translateY(): number {
        return this._translateY;
    }
    public set translateY(value: number) {
        this._translateY = value == Infinity ? 0 : value;
        this.reloadTransform();
        this.onPropertyChange.emit();
    }
  
    private _scaleX: number = 1;
    public get scaleX(): number {
        return this._scaleX;
    }
    public set scaleX(value: number) {
        this._scaleX = value == Infinity ? 0 : value;
        this.reloadTransform();
        this.onPropertyChange.emit();
    }
  
    private _scaleY: number = 1;
    public get scaleY(): number {
        return this._scaleY;
    }
    public set scaleY(value: number) {
        this._scaleY = value == Infinity ? 0 : value;
        this.reloadTransform();
        this.onPropertyChange.emit();
    }
  
    private _rotate: number = 0;
    public get rotate(): number {
        return this._rotate;
    }
    public set rotate(value: number) {
        this._rotate = value;
        this.reloadTransform();
        this.onPropertyChange.emit();
    }

    constructor(private readonly board: Board | undefined, svgEl?: SVGElement) {
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
                transform += ` rotate(${this.rotate * 180 / Math.PI})`;
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
            this._rotate = Number.parseFloat(rotate[0]) * Math.PI / 180;
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

    public moveBy(x: number, y: number): void {
        // move the element
        this._translateX += x;
        this.translateY += y;
    }

    public scaleBy(factorX: number, factorY: number, p?: Point): void {
        // this method scales the element relative to the Point p
        p = p ?? defaultPoint;

        // calculate the vector which is scaled
        let translateToP = add(p, scale({
            x: this.translateX,
            y: this.translateY
        }, -1));
        let scaledTranslateToP = {
            x: translateToP.x * factorX,
            y: translateToP.y * factorY
        };

        // then move with this vector
        this._translateX += translateToP.x - scaledTranslateToP.x;
        this._translateY += translateToP.y - scaledTranslateToP.y;

        // then do the transformation
        this._scaleX *= factorX;
        this.scaleY *= factorY;
    }

    public rotateBy(angle: number, p?: Point): void {
        // this method scales the element relative to the Point p
        p = p ?? defaultPoint;

        // calculate the vector which is scaled
        let translateToP = add(p, scale({
            x: this.translateX,
            y: this.translateY
        }, -1)); // undo the translate

        let translateToPWithoutScale = {
            x: translateToP.x / Math.abs(this.scaleX),
            y: translateToP.y / Math.abs(this.scaleY)
        } // undo the scale
        let rotatedTranslateToPWithoutScale = turnVectorByAngle({
            x: translateToPWithoutScale.x,
            y: translateToPWithoutScale.y
        }, angle); // do the rotation

        //let x = p.x;
        //let y = p.y;
        //let sx = this.scaleX;
        //let sy = this.scaleY;

        //let b = (sy * (x * Math.sin(angle) + y * Math.cos(angle)) - (sx - (sx * y * Math.sin(angle)) / x * Math.cos(angle)) * x * Math.sin(angle)) / (y * Math.sin(angle) * Math.sin(angle) / Math.cos(angle) + y * Math.cos(angle));
        //let a = sx - (sx * y * Math.sin(angle)) / (x * Math.cos(angle)) + (b * y * Math.sin(angle)) / (x * Math.cos(angle));

        let newScale: Vector = {
            x: this.scaleX,
            y: this.scaleY
        };

        let rotatedTranslateToP = {
            x: rotatedTranslateToPWithoutScale.x * Math.abs(newScale.x),
            y: rotatedTranslateToPWithoutScale.y * Math.abs(newScale.y)
        } // do the scale again

        // then move this vector ...
        this._translateX += translateToP.x - rotatedTranslateToP.x;
        this._translateY += translateToP.y - rotatedTranslateToP.y;

        // ... and scale it
        this._scaleX = newScale.x;
        this._scaleY = newScale.y;
        
        // then do the transformation
        this.rotate += angle * Math.sign(this.scaleX * this.scaleY);
    }
}

export class SVGElementWrapperCollection implements Iterable<SVGElementWrapper> {
    public readonly onEdit: Event = new Event();
    public readonly onRemove: Event = new Event();
    public readonly onPush: Event = new Event();
    public readonly onClear: Event = new Event();
    public readonly onSet: Event = new Event();

    private svgElementWrappers: SVGElementWrapper[] = [];

    constructor(private readonly getBoard: () => Board, svgElementWrappers?: SVGElementWrapper[]) {
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
                        this.push(new SVGElementWrapper(this.getBoard(), i));
                    }
                }
            }
            else if (value instanceof SVGElementWrapper) {
                this.clear();
                this.push(value);
            }
            else if (value instanceof SVGElement) {
                this.clear();
                this.push(new SVGElementWrapper(this.getBoard(), value));
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
        return getBoundingRect(this.svgElementWrappers.map(s => DOMRectToRect(s.getBoundingClientRect())));
    }


    public rotateBy(addition: number, p?: Point) {
        for (let svgEl of this.svgElementWrappers) {
            svgEl.rotateBy(addition, p);
        }
    }

    public moveBy(additionX: number, additionY: number) {
        for (let svgEl of this.svgElementWrappers) {
            svgEl.moveBy(additionX, additionY);
        }
    }

    public scaleBy(factorX: number, factorY: number, p?: Point) {
        for (let svgEl of this.svgElementWrappers) {
            svgEl.scaleBy(factorX, factorY, p);
        }
    }
}