import { BoardService } from 'src/app/features/board.service';
import { CanvasItem } from "./canvasElement";

export abstract class Shape extends CanvasItem {
    
    private initialize() {
        this.svgElement.setAttributeNS(null, 'stroke', this.boardService.stroke.color.toString());
        this.svgElement.setAttributeNS(null, 'stroke-width', this.boardService.stroke.getThicknessString());
        this.svgElement.setAttributeNS(null, 'fill', this.boardService.fill.toString());
    }
    
    protected svgElement: SVGElement; 

    constructor(protected boardService: BoardService, svgTag: string) {
        super();

        this.svgElement = this.boardService.createElement(svgTag);

        this.initialize();
    }
}