import { Rect } from './../../interfaces/rect';
import { CanvasComponent } from "src/app/whiteboard/drawing/canvas/canvas.component";
import { Board } from "./board";
import { Stack } from "../stack";

const maxStepsBack = 30;

export class Page {

    public get canvas(): CanvasComponent | undefined {
        return this.board.canvas;
    }

    public lastContent: Stack<string> = new Stack(maxStepsBack);
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
    public nextContent: Stack<string> = new Stack(maxStepsBack);

    private save(): void {
        if (this.canvas && this.canvas.gElement) {
            let newContent = this.canvas.gElement.innerHTML;

            if (this.currentContent != newContent) {
                this.lastContent.push(this.currentContent);
                this._currentContent = newContent;
                this.nextContent.empty();
            }
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
    
    constructor(private board: Board) {
        this.board.onTouchEnd.addListener(() => {
            if (this.board.currentPage == this) this.save();
        });
    }

    public getSizeRect(): Rect {
        let rect = {
            x: 0,
            y: 0,
            width: 100,
            height: 100
        };

        let max = (a: number, b: number) => {
            return a > b ? a : b;
        }
        let min = (a: number, b: number) => {
            return a < b ? a : b;
        }

        if (this.canvas && this.canvas.gElement) {
            for (let i in this.canvas.gElement.children) {
                let el = this.canvas.gElement.children[i];
                if (el) {
                    try {
                        let r = (this.canvas.gElement.children[i] as SVGElement).getBoundingClientRect();
                        rect.x = min(r.left, rect.x);
                        rect.y = min(r.top, rect.y);
                        rect.width = max(rect.width, r.width + r.left);
                        rect.height = max(rect.height, r.height + r.top);
                    }
                    catch { }
                }
            }
        }

        rect.width += 20;
        rect.height += 20;

        return rect;
    }

    public clear() {
        if (this.canvas && this.canvas.gElement) {
            this.canvas.gElement.innerHTML = '';

            this.save();
        }
    }
}