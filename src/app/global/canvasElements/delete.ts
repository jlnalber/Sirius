import { timingSafeEqual } from 'crypto';
import { BoardService } from 'src/app/features/board.service';
import { Board } from '../board/board';
import { CanvasItem, Point } from "./canvasElement";
import { Shape } from "./shape";

export class Delete extends CanvasItem {

    public touchStart(p: Point): void {
        if (this.board.canvas?.gElement) {
            let children = this.board.canvas.gElement.children;
            for (let i in children) {
                let el = children[i] as SVGElement;
                let ev = this.getListener(el);
                let evt = this.getListenerTouch(el);

                try {
                    el.addEventListener('mousemove', ev);
                    el.addEventListener('click', ev);
                    el.addEventListener('touchstart', evt);
                    el.addEventListener('touchmove', evt)
                } catch { }
            }
        }
    }
    public touchMove(from: Point, to: Point): void {
        return;
    }
    public touchEnd(p: Point): void {
        if (this.board.canvas?.gElement) {
            let children = this.board.canvas.gElement.children;
            for (let i in children) {
                let el = children[i];

                if (el.removeAllListeners) {
                    el.removeAllListeners('mousemove');
                    el.removeAllListeners('click');
                    el.removeAllListeners('touchstart');
                    el.removeAllListeners('touchmove');
                }
            }
        }
    }

    private removeElement(el: SVGElement, ev: MouseEvent): boolean {
        if (ev.buttons != 0 && this.board.canvas && this.board.canvas.gElement && this.board.canvas.gElement.contains(el)) {
            this.board.canvas.gElement.removeChild(el);
            return true;
        }
        return false;
    }

    private removeElementTouch(el: SVGElement): boolean {
        if (this.board.canvas && this.board.canvas.gElement && this.board.canvas.gElement.contains(el)) {
            this.board.canvas.gElement.removeChild(el);
            return true;
        }
        return false;
    }

    private getListener(el: SVGElement): (ev: MouseEvent) => void {
        return (ev: MouseEvent) => { return this.removeElement(el, ev) };
    }

    private getListenerTouch(el: SVGElement): () => void {
        return () => { return this.removeElementTouch(el); };
    }

    constructor(private readonly board: Board) { 
        super()
    }
    
}