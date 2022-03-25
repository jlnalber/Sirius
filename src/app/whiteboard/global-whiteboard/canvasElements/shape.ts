import { Board } from '../board/board';
import { CanvasItem } from "./canvasElement";

export abstract class Shape extends CanvasItem {
    
    private initialize() {
        this.svgElement.setAttributeNS(null, 'stroke', this.board.stroke.color.toString());
        this.svgElement.setAttributeNS(null, 'stroke-width', this.board.stroke.getThicknessString());
        this.svgElement.setAttributeNS(null, 'fill', this.board.fill.toString());
    }
    
    protected svgElement: SVGElement; 

    constructor(protected board: Board, svgTag: string, initialize: boolean = true) {
        super();

        this.svgElement = this.board.createElement(svgTag);

        if (initialize) {
            this.initialize();
        }
    }
}