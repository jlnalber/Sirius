import { timingSafeEqual } from 'crypto';
import { BoardService } from 'src/app/features/board.service';
import { Board, BoardModes } from '../board/board';
import { CanvasItem, Point } from "./canvasElement";
import { Shape } from "./shape";

export class Select {
    
    // gibt an, ob gerade das select aktiv ist
    private active: boolean = false;

    public start(): void {
        if (this.board.canvas?.gElement) {
            let children = this.board.canvas.gElement.children;
            for (let i in children) {
                let el = children[i] as SVGElement;
                let ev = this.getListener(el);

                try {
                    el.addEventListener('click', ev);
                } catch { }
            }
        }
    }
    
    public end(): void {
        if (this.board.canvas?.gElement) {
            let children = this.board.canvas.gElement.children;
            for (let i in children) {
                let el = children[i];

                if (el.removeAllListeners) {
                    el.removeAllListeners('click');
                }
            }
        }

        if (this.board.selector) {
            this.board.selector.svgEl = undefined;
        }
    }

    private captureElement(el: SVGElement, ev: MouseEvent): boolean {
        if (this.board.selector) {
            this.board.selector.svgEl = el;
            return true;
        }
        return false;
    }

    private getListener(el: SVGElement): (ev: MouseEvent) => void {
        return (ev: MouseEvent) => { return this.captureElement(el, ev) };
    }

    constructor(private readonly board: Board) {
        // startet/endet das select
        this.board.onBoardModeChange.addListener(() => {
            if (this.board.mode == BoardModes.Select && !this.active) {
                this.start();
                this.active = true;
            }
            else if (this.active) {
                this.end();
                this.active = false;
            }
        });

        // endet das select, wenn eine Seite geschlossen wird
        this.board.beforePageSwitched.addListener(() => {
            if (this.active) {
                this.end();
                if (this.board.selector) this.board.selector.svgEl = undefined;
            }
        })

        // startet das select wieder, wenn eine andere Seite geöffnet wird
        this.board.onPageSwitched.addListener(() => {
            if (this.active) {
                this.start();
            }
        })
    }
    
}