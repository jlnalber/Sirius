import { CanvasComponent } from "src/app/whiteboard/drawing/canvas/canvas.component";
import { Board } from "./board";
import { Stack } from "../stack";

export class Page {

    public get canvas(): CanvasComponent | undefined {
        return this.board.canvas;
    }

    public lastContent: Stack<string> = new Stack();
    private _currentContent: string = "";
    public get currentContent(): string {
        return this._currentContent;
    }
    public set currentContent(value: string) {
        if (this.canvas && this.canvas.svgElement) {
            this.canvas.svgElement.innerHTML = value;
        }
        this._currentContent = value;
    }
    public nextContent: Stack<string> = new Stack();

    private save(): void {
        if (this.canvas && this.canvas.svgElement) {
            let newContent = this.canvas.svgElement.innerHTML;

            if (this.currentContent != newContent) {
                this.lastContent.push(this.currentContent);
                this._currentContent = newContent;
                this.nextContent.empty();
            }

            console.log(this.lastContent);
            console.log(this._currentContent);
            console.log(this.nextContent);
        }
    }

    public goBack(): void {
        if (this.canvas && this.canvas.svgElement && this.lastContent.size() != 0) {
            let c = this.lastContent.pop();
            
            if (c) {
                this.nextContent.push(this.currentContent);
                this.currentContent = c;
            }
        }
    }

    public canGoBack() {
        return this.lastContent.size() != 0;
    }

    public goForward(): void {
        if (this.canvas && this.canvas.svgElement && this.nextContent.size() != 0) {
            let c = this.nextContent.pop();

            if (c) {
                this.lastContent.push(this.currentContent);
                this.currentContent = c;
            }
        }
    }

    public canGoForward() {
        return this.nextContent.size() != 0;
    }
    
    constructor(private board: Board) {
        this.board.onTouchEnd.addListener(() => this.save());
    }
}