import { BoardService } from 'src/app/features/board.service';
import { CanvasItem, Point } from "./canvasElement";
import { Shape } from "./shape";

export class Delete extends CanvasItem {

    public touchStart(p: Point): void {
        if (this.boardService.canvas?.gElement) {
            let children = this.boardService.canvas.gElement.children;
            for (let i in children) {
                let el = children[i] as SVGElement;
                let ev = this.getListener(el);

                try {
                    el.addEventListener('mousemove', ev);
                    el.addEventListener('click', ev);
                } catch { }
            }
        }
    }
    public touchMove(from: Point, to: Point): void {
        return;
    }
    public touchEnd(p: Point): void {
        if (this.boardService.canvas?.gElement) {
            let children = this.boardService.canvas.gElement.children;
            for (let i in children) {
                let el = children[i];

                if (el.removeAllListeners) {
                    el.removeAllListeners('mousemove');
                    el.removeAllListeners('click');
                }
            }
        }
    }

    private removeElement(el: SVGElement, ev: MouseEvent): boolean {
        if (ev.buttons != 0 && this.boardService.canvas && this.boardService.canvas.gElement && this.boardService.canvas.gElement.contains(el)) {
            this.boardService.canvas.gElement.removeChild(el);
            return true;
        }
        return false;
    }

    private getListener(el: SVGElement): (ev: MouseEvent) => void {
        return (ev: MouseEvent) => { return this.removeElement(el, ev) };
    }

    constructor(private readonly boardService: BoardService) { 
        super()
    }
    
}