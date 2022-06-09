import { CanvasComponent } from "src/app/whiteboard/drawing/canvas/canvas.component";
import { Stack } from "../essentials/stack";
import { Rect } from "../interfaces/rect";
import { Board, svgns } from "./board";
import { Page as PageExport } from "../interfaces/whiteboard";
import { Point } from "../interfaces/point";
import { Canvg, presets, RenderingContext2D } from "canvg";
import { DOMRectToRect, getBoundingRect, getImageDimensions } from "../essentials/utils";

const maxStackSize = 10000000;
const minStepsBack = 10;
const sizeCalculator = (s: string) => s.length;
const offsetSizeRect = 40;

export class Page {

    public get canvas(): CanvasComponent | undefined {
        return this.board.canvas;
    }

    // lastContent: Stack, der die Rückgängig-Funktion bereitstellt
    public lastContent: Stack<string> = new Stack(maxStackSize, sizeCalculator, minStepsBack);

    // currentContent: hält den aktuellen Inhalt
    private _currentContent: string = "";
    public get currentContent(): string {
        return this._currentContent;
    }
    public set currentContent(value: string) {
        if (this.canvas && this.canvas.gElement) {
            this.canvas.gElement.innerHTML = value;
        }
        this._currentContent = value;
    }

    // nextContent: Stack, der die Vorwärts-Funktion bereitstellt
    public nextContent: Stack<string> = new Stack(maxStackSize, sizeCalculator, minStepsBack);

    private _translateX: number = 0;
    public get translateX(): number {
        if (this.board.currentPage == this && this.canvas) {
            return this.canvas.translateX;
        }
        else {
            return this._translateX;
        }
    }
    public set translateX(value: number) {
        if (this.board.currentPage == this && this.canvas) {
            this.canvas.translateX = value;
        }
        this._translateX = value;
    }

    private _translateY: number = 0;
    public get translateY(): number {
        if (this.board.currentPage == this && this.canvas) {
            return this.canvas.translateY;
        }
        else {
            return this._translateY;
        }
    }
    public set translateY(value: number) {
        if (this.board.currentPage == this && this.canvas) {
            this.canvas.translateY = value;
        }
        this._translateY = value;
    }

    private _zoom: number = 1;
    public get zoom(): number {
        if (this.board.currentPage == this && this.canvas) {
            return this.canvas.zoom;
        }
        else {
            return this._zoom;
        }
    }
    public set zoom(value: number) {
        if (this.board.currentPage == this && this.canvas) {
            this.canvas.zoom = value;
            this._zoom = this.canvas.zoom;
        }
        else {
            this._zoom = value;
        }
    }

    public zoomTo(value: number, p?: Point): void {
        if (this.board.currentPage == this && this.canvas) {
            this.canvas.zoomTo(value, p);
        }
        else {
            this._zoom = value;
        }
    }

    public resetZoomAndTranslate(): void {
        this.zoom = 1;
        if (this.board.format && this.board.canvas && this.board.canvas.svgWrapperElement) {
            this.translateY = 40;
            let rect = DOMRectToRect(this.board.canvas.svgWrapperElement.getBoundingClientRect());
            this.translateX = (rect.width - this.board.format.width) / 2;
        }
        else {
            this.translateX = 0;
            this.translateY = 0;
        }
    }


    private save(): void {
        if (this.board.currentPage == this && this.canvas && this.canvas.gElement) {
            let newContent = this.canvas.gElement.innerHTML;

            if (this.currentContent != newContent) {
                this.lastContent.push(this.currentContent);
                this._currentContent = newContent;
                this.nextContent.empty();
            }

            this._translateX = this.canvas.translateX;
            this._translateY = this.canvas.translateY;
            this._zoom = this.canvas.zoom;
        }
    }

    public goBack(): void {
        if (this.canvas && this.canvas.gElement && this.lastContent.size() != 0) {
            let c = this.lastContent.pop();
            
            if (c != undefined) {
                this.nextContent.push(this.currentContent);
                this.currentContent = c;
            }
        }
    }

    public canGoBack() {
        return this.lastContent.size() != 0;
    }

    public goForward(): void {
        if (this.canvas && this.canvas.gElement && this.nextContent.size() != 0) {
            let c = this.nextContent.pop();

            if (c != undefined) {
                this.lastContent.push(this.currentContent);
                this.currentContent = c;
            }
        }
    }

    public canGoForward() {
        return this.nextContent.size() != 0;
    }
    
    constructor(private readonly board: Board) {
        this.board.onInput.addListener(() => {
            if (this.board.currentPage == this) this.save();
        });
    }

    public getSizeRect(): Rect {

        if (this.board.format) {
            return this.board.format;
        }
        else {

            // get a rect that limits the view: left-most, right-most, top-most and bottom-most elements in the svg
            let rect = {
                x: 0,
                y: 0,
                width: 100,
                height: 100
            };

            let currentPageIndex = this.board.currentPageIndex;
            let myPageIndex = this.board.pages.indexOf(this);
            let switchPage = myPageIndex >= 0 && myPageIndex != currentPageIndex;

            if (switchPage) {
                this.board.currentPageIndex = myPageIndex;
            }

            if (this.canvas && this.canvas.gElement) {
                rect = getBoundingRect(this.canvas.gElement.children, this.board);
            }

            if (switchPage) {
                this.board.currentPageIndex = currentPageIndex;
            }

            rect.width += 2 * offsetSizeRect /*+ rect.x > 0 ? rect.x : 0*/;
            rect.height += 2 * offsetSizeRect /*+ rect.y > 0 ? rect.y : 0*/;
            rect.x -= offsetSizeRect;
            rect.y -= offsetSizeRect;
            //rect.x = rect.x < 0 ? rect.x : 0;
            //rect.y = rect.y < 0 ? rect.y : 0;

            return rect;
        }
    }

    public clear() {
        if (this.canvas && this.canvas.gElement) {
            this.canvas.gElement.innerHTML = '';

            this.save();
        }
    }

    public open() {
        if (this.canvas && this.canvas.gElement) {
            this.canvas.gElement.innerHTML = this.currentContent;
            this.canvas.translateX = this._translateX;
            this.canvas.translateY = this._translateY;
            this.canvas.zoom = this._zoom;
        }
    }

    public close() {
        this.save();
        if (this.canvas && this.canvas.gElement) {
            this.canvas.gElement.innerHTML = '';
        }
    }

    public async getSVG(): Promise<[string, Rect]> {
        // this method returns a string (and a rect for the shape) of a svg of this page, it moves the content and scales so that it makes sense

        if (this.canvas && this.canvas.svgElement && this.canvas.gElement) {
            let content = this.canvas.gElement.outerHTML;
            if (this.board.currentPage != this) {
                if (this.board.format) {
                    content = `<g>${this.currentContent}</g>`;
                }
                else {
                    content = `<g transform="translate(${this.translateX} ${this.translateY}) scale(${this.zoom})">${this.currentContent}</g>`;
                }
            }

            let sizeRect = this.getSizeRect();

            let scaleBack = 1 / this.zoom;
            let translateXBack = -this.translateX - sizeRect.x * this.zoom;
            let translateYBack = -this.translateY - sizeRect.y * this.zoom;

            let rect = {
                x: 0,
                y: 0,
                width: sizeRect.width,
                height: sizeRect.height
            };

            // load the background color into an image, the background into a pattern
            let rectBGImg = await getImageDimensions(this.board.backgroundImage);
            rectBGImg = {
                x: rectBGImg.x * this.board.backgroundScale,
                y: rectBGImg.y * this.board.backgroundScale,
                width: rectBGImg.width * this.board.backgroundScale,
                height: rectBGImg.height * this.board.backgroundScale
            }

            let properties = `x="${-(this.translateX + Math.floor(translateXBack / rectBGImg.width + 1) * rectBGImg.width) / this.zoom}" y="${-(this.translateY + Math.floor(translateYBack / rectBGImg.height + 1) * rectBGImg.height) / this.zoom}" width="${Math.abs((rect.width + rectBGImg.width) / Math.min(this.zoom, 1))}" height="${Math.abs((rect.height + rectBGImg.height) / Math.min(this.zoom, 1))}" transform="translate(${this.translateX} ${this.translateY}) scale(${this.zoom})"`;

            let rectStr = `<rect fill="${this.board.backgroundColor.toString()}" ${properties} />`;
            
            

            let def = `<defs>
            <pattern width="${rectBGImg.width}" height="${rectBGImg.height}" patternUnits="userSpaceOnUse" id="pat1" x="0" y="0">
                <image width="${rectBGImg.width}" height="${rectBGImg.height}" href="${this.board.backgroundImage}" />
            </pattern>
        </defs>`;
            
            if (this.board.backgroundImage != '') {
                rectStr += `
                <rect ${properties} fill="url(#pat1)"/>`;
            }

            if (this.board.format) {
                rectStr = '';
                def += `<rect fill="${this.board.backgroundColor.toString()}" x="0" y="0" width="${rect.width}" height="${rect.height}" />
                        <rect fill="url(#pat1)" x="0" y="0" width="${rect.width}" height="${rect.height}"  />`;
                translateXBack = 0;
                translateYBack = 0;
                scaleBack = 1;
            }
  
            let str = `<?xml version="1.0" encoding="UTF-8"?>
            <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background-color: ${this.board.backgroundColor.toString()};">
            ${def}
            <g transform="scale(${scaleBack}) translate(${translateXBack} ${translateYBack})">${rectStr} ${content}</g>
            </svg>`;

            return [str, rect];
        }
        return ['', {x: 0, y: 0, width: 0, height: 0}];
    }

    public import(value: PageExport): void {
        this._currentContent = value.content;
        this.lastContent.empty();
        this.nextContent.empty();
        this.zoom = value.zoom;
        this.translateX = value.translateX;
        this.translateY = value.translateY;
    }

    public export(): PageExport {
        // export this page
        return {
            translateX: this.translateX,
            translateY: this.translateY,
            zoom: this.zoom,
            content: this.currentContent
        };
    }

    public getSVGPreview(): SVGSVGElement {
        let curr = this.currentContent;
        if (this.board.currentPage == this && this.canvas && this.canvas.gElement) {
            curr = this.canvas.gElement.innerHTML;
        }
        let g = document.createElementNS(svgns, 'g');
        g.setAttributeNS(null, 'transform', `translate(${this.translateX} ${this.translateY}) scale(${this.zoom})`);
        /*g.style.background = `url('${this.board.backgroundImage}')`;
        g.style.backgroundColor = this.board.backgroundColor.toString();*/
        g.innerHTML = curr;

        let gWrapper = document.createElementNS(svgns, 'g');
        gWrapper.appendChild(g);

        let svg = document.createElementNS(svgns, 'svg');
        svg.appendChild(gWrapper);
        svg.style.backgroundColor = this.board.backgroundColor.toString();
        svg.style.backgroundImage = 'url(\'' + this.board.backgroundImage + '\')';

        return svg;
    }

    public async getPageAsPicture(): Promise<string> {
        // this method returns the data url of the png image of this page

        let svg = await this.getSVG();
        let svgString = svg[0];
        let rect = svg[1];

        let canv = document.createElement('canvas');
        canv.style.background = this.board.backgroundColor.toString();
        let ctx = canv.getContext('2d') as RenderingContext2D;
        //ctx.scale(scale, scale);


        let v = await Canvg.fromString(ctx as RenderingContext2D, svgString, presets.offscreen());

        v.resize(rect.width, rect.height);
        await v.render();

        /*ctx.fillStyle = 'red';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);*/

        return canv.toDataURL('image/png');
    }
}