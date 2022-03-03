import { Board, BoardModes } from '../board/board';

export class Delete {

    private active: boolean = false;

    public globalListener = (ev: any): boolean => {
        if (this.board.mode == BoardModes.Delete) {
            let p = this.board.getActualPoint(this.board.getPosFromTouchEvent(ev));
            let elem = document.elementFromPoint(p.x, p.y);
            if (elem instanceof SVGElement) {
                return this.board.removeElement(elem);
            }
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

            // this.board.canvas.svgElement?.removeEventListener('touchmove', this.globalListener);
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
        });

        // endet das select, wenn eine Seite geschlossen wird
        this.board.beforePageSwitched.addListener(() => {
            if (this.active) {
                this.end();
            }
        })

        // startet das select wieder, wenn eine andere Seite geöffnet wird
        this.board.onPageSwitched.addListener(() => {
            if (this.active) {
                this.start();
            }
        })

        // entferne das select von neu entfernten Element
        this.board.onRemoveElement.addListener(() => {
            if (this.active) {
                this.end();
                this.start();
            }
        })

        this.board.canvas?.svgElement?.addEventListener('touchmove', this.globalListener);
    }
    
}