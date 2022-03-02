import { BoardService } from 'src/app/features/board.service';
import { Board, BoardModes } from '../board/board';
import { CanvasItem, Point } from "./canvasElement";
import { Shape } from "./shape";

export class Delete {

    private active: boolean = false;

    public globalListener = (ev: any): boolean => {
        let p = this.board.getActualPoint(this.board.getPosFromTouchEvent(ev));
        let elem = document.elementFromPoint(p.x, p.y);
        if (elem instanceof SVGElement) {
            return this.board.removeElement(elem);
        }
        return false;
    }

    public start(): void {
        if (this.board.canvas?.gElement) {
            let children = this.board.canvas.gElement.children;
            for (let i in children) {
                let el = children[i] as SVGElement;
                let ev = this.getListener(el);
                let evt = this.getListenerTouch(el);

                try {
                    el.addEventListener('mousemove', ev);
                    el.addEventListener('mousedown', ev)
                    el.addEventListener('touchstart', evt);
                    el.addEventListener('touchmove', evt);
                } catch { }
            }

            this.board.canvas.svgElement?.addEventListener('touchmove', this.globalListener);
        }
    }
    
    public end(): void {
        if (this.board.canvas?.gElement) {
            let children = this.board.canvas.gElement.children;
            for (let i in children) {
                let el = children[i];

                if (el.removeAllListeners) {
                    el.removeAllListeners('mousemove');
                    el.removeAllListeners('mousedown');
                    el.removeAllListeners('touchstart');
                    el.removeAllListeners('touchmove');
                }
            }

            this.board.canvas.svgElement?.removeEventListener('touchmove', this.globalListener);
        }
    }

    private removeElement(el: SVGElement, ev: MouseEvent): boolean {
        if (ev.buttons != 0 && this.board.canvas && this.board.canvas.gElement && this.board.canvas.gElement.contains(el)) {
            return this.board.removeElement(el);
        }
        return false;
    }

    private removeElementTouch(el: SVGElement): boolean {
        if (this.board.canvas && this.board.canvas.gElement && this.board.canvas.gElement.contains(el)) {
            return this.board.removeElement(el);
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
        this.board.onBoardModeChange.addListener(() => {
            if (this.board.mode == BoardModes.Delete && !this.active) {
                this.start();
                this.active = true;
            }
            else if (this.active) {
                this.end();
                this.active = false;
            }
        })

        this.board.onAddElement.addListener(() => {
            if (this.active) {
                this.end();
                this.start();
            }
        })
    }
    
}