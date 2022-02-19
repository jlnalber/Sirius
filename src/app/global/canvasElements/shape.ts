import { BoardService } from 'src/app/features/board.service';
import { CanvasItem, svgns } from "./canvasElement";

export abstract class Shape extends CanvasItem {
    
    private initialize() {
        this.svgElement.setAttributeNS(null, 'stroke', this.boardService.stroke.color.toString());
        this.svgElement.setAttributeNS(null, 'stroke-width', this.boardService.stroke.getThicknessString());
        this.svgElement.setAttributeNS(null, 'fill', 'transparent')
    }
    
    protected svgElement: SVGElement; 

    constructor(protected boardService: BoardService, svgTag: string) {
        super();

        this.svgElement = document.createElementNS(svgns, svgTag);
        this.boardService.canvas?.gElement?.appendChild(this.svgElement);

        this.initialize();
    }
}